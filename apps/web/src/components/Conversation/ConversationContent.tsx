import { useContext, useEffect, useMemo, useRef } from 'react';
import MessageBubble from './MessageBubble';
import UserCard from './UserCard';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getChatHistoryOfConversation, socket, updateConversation } from '@message-management/client';
import EmptyConversation from './EmptyConversation';

import {
  ApiDataForClient,
  ChatHistoryOfConversation,
  Messages,
  UpdateConversationRequest,
} from '@message-management/types';
import { ConversationIdContext } from '../../contexts/conversation.context';
import Editor from '../Editor/Editor';
import { formatTimestamp } from '@message-management/utils';
import DateDivider from './DateDivider';

const groupMessagesByDate = (messages: Messages[]) => {
  const groups: { [key: string]: { date: string; messages: Messages[] } } = {};

  messages.forEach((message) => {
    const dateKey = formatTimestamp(message.createdAt);

    if (!groups[dateKey]) {
      groups[dateKey] = {
        date: dateKey,
        messages: [],
      };
    }

    groups[dateKey].messages.push(message);
  });

  return Object.values(groups);
};

export default function ConversationContent() {
  const conversationId = useContext(ConversationIdContext);

  const queryClient = useQueryClient();
  const { isSuccess, isError, data } = useQuery({
    queryKey: ['chat-history', conversationId],
    queryFn: () => getChatHistoryOfConversation(conversationId || ''),
    enabled: !!conversationId,
  });

  const updateConversationMutation = useMutation({
    mutationFn: ({ conversationId, body }: { conversationId: string; body: UpdateConversationRequest }) =>
      updateConversation(conversationId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['conversation-list'],
      });
    },
  });

  const historyRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (historyRef.current) {
      historyRef.current.scrollTop = historyRef.current.scrollHeight;
    }
  }, [data]);

  useEffect(() => {
    // console.log(queryClient.getQueryData(['chat-history', conversationId]));
    const conversationContentHandler = (payload: { newMessages: Messages[] }) => {
      const hasMessageForCurrentConversation = payload.newMessages.filter((item) => item.conversationId === conversationId);

      queryClient.setQueryData(
        ['chat-history', conversationId],
        (oldData: ApiDataForClient<ChatHistoryOfConversation>) => {
          // in case of, websocket emit event while useQuery is fetching api
          if (!oldData) return oldData;
          // filter message for current conversation and replace messages array of this conversation
          const newMessagesForCurrentConversation = payload.newMessages.filter(
            (item) => item.conversationId === conversationId,
          );

          return {
            ...oldData,
            result: {
              ...oldData.result,
              messages: [...oldData.result.messages, ...newMessagesForCurrentConversation],
            },
          };
        },
      );

      if (hasMessageForCurrentConversation.length > 0 && !hasMessageForCurrentConversation.at(-1)?.sentByAdmin) {
        updateConversationMutation.mutate({
          conversationId: conversationId as string,
          body: {
            isReadByAdmin: true,
          },
        });
      }
    };

    socket.on('new_messages', conversationContentHandler);

    return () => {
      socket.off('new_messages', conversationContentHandler);
    };
  }, [queryClient, conversationId, updateConversationMutation]);


  const listMessages = useMemo(() => {
    return data ? groupMessagesByDate(data.result.messages) : [];
  }, [data]);

  return (
    <div className="w-full h-screen flex flex-col">
      {(!conversationId || isError) && <EmptyConversation />}
      {isSuccess && (
        <>
          <UserCard user={data.result.telegramUser} />
          <div ref={historyRef} className="conversation-history p-3 overflow-auto flex-1 flex flex-col gap-5">
            {listMessages &&
              listMessages.map((item) => (
                <div className="flex flex-col gap-3">
                  <DateDivider label={item.date} />
                  {item.messages.map((message) => (
                    <MessageBubble
                      key={message.id}
                      senderType={message.senderType}
                      content={message.content}
                      sendTime={new Date(message.createdAt)}
                      fileUrls={message.fileUrls}
                      sentByAdmin={message.sentByAdmin}
                      telegramUser={data.result.telegramUser}
                    />
                  ))}
                </div>
              ))}
          </div>

          <div className="conversation-action w-full mb-2 flex justify-center">
            <Editor key={conversationId} />
          </div>
        </>
      )}
    </div>
  );
}
