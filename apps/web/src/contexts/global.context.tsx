import { getChatHistoryOfConversation, getConversationsList, getUsers, socket } from '@message-management/client';
import {
  ChatHistoryOfConversation,
  Conversation,
  GetConversationRequest,
  GetUsersResponse,
  SocketPayloadType,
  TelegramUser,
} from '@message-management/types';
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

interface AppContextType {
  // users
  users: GetUsersResponse[];
  isUsersLoaded?: boolean;
  addUser?: (user: GetUsersResponse) => void;
  loadUsers: () => Promise<void>;

  // conversations
  conversationsMap: Record<string, Conversation[]>; // { OPEN: [...], CLOSED: [...] }
  isConversationsLoaded?: Record<string, boolean>; // { OPEN: true, CLOSED: false }
  loadConversations: (filter: GetConversationRequest) => Promise<void>;
  updateConversationInList?: (payload: SocketPayloadType) => void;

  // chat histories
  chatHistoriesMap: Record<string, ChatHistoryOfConversation>; // {conversationId,chatHistories}
  isChatHistoryLoaded?: Record<string, boolean>;
  loadChatHistory: (conversationId: string) => Promise<void>;
  updateChatHistory?: (payload: SocketPayloadType) => void;
}

export const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  // users
  const [users, setUsers] = useState<GetUsersResponse[]>([]);
  const [isUsersLoaded, setIsUsersLoaded] = useState(false);

  // conversations
  const [conversationsMap, setConversationsMap] = useState<Record<string, Conversation[]>>({});
  const [isConversationsLoaded, setIsConversationsLoaded] = useState<Record<string, boolean>>({});

  // chat histories
  const [chatHistoriesMap, setChatHistoriesMap] = useState<Record<string, ChatHistoryOfConversation>>({});
  const [isChatHistoryLoaded, setIsChatHistoryLoaded] = useState<Record<string, boolean>>({});

  const addUser = (user: GetUsersResponse) => {
    setUsers((prev) => {
      const exists = prev.some((u) => u.telegramID === user.telegramID);
      if (exists) return prev;
      return [user, ...prev];
    });
  };

  const loadUsers = async () => {
    if (isUsersLoaded) return;

    try {
      const data = await getUsers();
      setUsers(data.result);
      setIsUsersLoaded(true);
    } catch {
      toast.error('Failed to load users');
    }
  };

  const loadConversations = useCallback(
    async (filter: GetConversationRequest) => {
      const statusKey = filter.status ?? 'ALL';
      const key = filter.search ? `${statusKey}_search` : statusKey;

      if (!filter.search && isConversationsLoaded[statusKey]) return;

      try {
        const data = await getConversationsList(filter);
        setConversationsMap((prev) => ({ ...prev, [key]: data.result }));
        if (!filter.search) {
          setIsConversationsLoaded((prev) => ({ ...prev, [statusKey]: true }));
        }
      } catch {
        toast.error('Failed to load conversations');
      }
    },
    [isConversationsLoaded],
  );

  const loadChatHistory = async (conversationId: string) => {
    if (isChatHistoryLoaded[conversationId]) return;

    try {
      const data = await getChatHistoryOfConversation(conversationId);
      setChatHistoriesMap((prev) => ({ ...prev, [conversationId]: data.result }));
      setIsChatHistoryLoaded((prev) => ({ ...prev, [conversationId]: true }));
    } catch (error) {
      console.log('Load chat history error: ', error);
      toast.error('Failed to load chat history');
    }
  };

  // Handle users
  useEffect(() => {
    const handler = (payload: { meta: SocketPayloadType }) => {
      if (payload.meta.telegramUser) {
        addUser({
          telegramID: payload.meta.telegramUser.telegramID,
          username: payload.meta.telegramUser.username,
          firstName: payload.meta.telegramUser.firstName,
          lastName: payload.meta.telegramUser.lastName,
          conversation: {
            id: payload.meta.message?.conversationId as string,
          },
        });
      }
    };

    socket.on('socket_event', handler);
    return () => {
      socket.off('socket_event', handler);
    };
  }, []);

  // Handle conversations
  useEffect(() => {
    const handler = (payload: { meta: SocketPayloadType }) => {
      setConversationsMap((prev) => {
        const updated = { ...prev };

        // Don't have message => Update isReadByAdmin
        if (!payload.meta.message) {
          for (const status in updated) {
            updated[status] = updated[status].map((c) =>
              c.id === payload.meta.conversation.id
                ? { ...c, isReadByAdmin: payload.meta.conversation.isReadByAdmin ?? c.isReadByAdmin }
                : c,
            );
          }

          return updated;
        }

        // Has message => find old conversation and update

        let existConversation: Conversation | null = null;

        // find old conversation
        for (const status in updated) {
          const conversation = updated[status].find((item) => item.id === payload.meta.message?.conversationId);
          if (conversation) {
            existConversation = conversation;
            break;
          }
        }

        /**
         * Xóa conversation được thay đổi ra khỏi state
         * Thêm conversation được thay đổi vào đầu danh sách ứng với status của nó
         */

        for (const status in updated) {
          const others = updated[status].filter((c) => c.id !== payload.meta.message?.conversationId);

          if (payload.meta.conversation.status === status) {
            updated[status] = [
              {
                id: payload.meta.message.conversationId,
                status: payload.meta.conversation.status,
                isReadByAdmin: payload.meta.conversation.isReadByAdmin as boolean,
                telegramUser: existConversation
                  ? existConversation.telegramUser
                  : (payload.meta.telegramUser as TelegramUser),
                lastMessage: {
                  ...payload.meta.message,
                  content: payload.meta.message.content ?? '',
                  createdAt: payload.meta.message.createdAt,
                },
              },
              ...others,
            ];
          } else {
            updated[status] = others;
          }
        }

        return updated;
      });
    };

    socket.on('socket_event', handler);
    return () => {
      socket.off('socket_event', handler);
    };
  }, []);

  // Handle chat history
  useEffect(() => {
    const handler = (payload: { meta: SocketPayloadType }) => {
      setChatHistoriesMap((prev) => {
        // Don't have message => Update isReadByAdmin
        if (!payload.meta.message) {
          if (!payload.meta.conversation.id || !prev[payload.meta.conversation.id]) return prev;
          return {
            ...prev,
            [payload.meta.conversation.id]: {
              ...prev[payload.meta.conversation.id],
              isReadByAdmin: payload.meta.conversation.isReadByAdmin as boolean,
            },
          };
        }

        // Has message => add Messages into conversation
        const updated = { ...prev };

        for (const conversationId in updated) {
          const hasMessageForCurrentConversation = payload.meta.message?.conversationId === conversationId;

          if (hasMessageForCurrentConversation) {
            const isDuplicate = updated[conversationId].messages.some((m) => m.id === payload.meta.message?.id);
            if (isDuplicate) return updated;

            return {
              ...updated,
              [conversationId]: {
                ...updated[conversationId],
                // isReadByAdmin: payload.meta.conversation.isReadByAdmin,
                isReadByAdmin: payload.meta.conversation.isReadByAdmin as boolean,
                messages: [...updated[conversationId].messages, payload.meta.message],
              },
            };
          }
        }

        return updated;
      });
    };

    socket.on('socket_event', handler);
    return () => {
      socket.off('socket_event', handler);
    };
  }, []);

  return (
    <AppContext.Provider
      value={{
        users,
        loadUsers,
        conversationsMap,
        loadConversations,
        chatHistoriesMap,
        loadChatHistory,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used inside AppProvider');
  return ctx;
}
