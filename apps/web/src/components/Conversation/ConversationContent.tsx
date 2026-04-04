import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import MessageBubble from './MessageBubble';
import UserCard from './UserCard';
// import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getChatHistoryOfConversation, socket, updateConversation } from '@message-management/client';
import EmptyConversation from './EmptyConversation';

import {
  ApiDataForClient,
  ChatHistoryOfConversation,
  Conversation,
  GetConversationRequest,
  Messages,
  SocketPayloadType,
  UpdateConversationRequest,
} from '@message-management/types';
import { ConversationIdContext } from '../../contexts/conversation.context';
import Editor from '../Editor/Editor';
import { formatTimestamp } from '@message-management/utils';
import DateDivider from './DateDivider';
import { toast } from 'react-toastify';

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
  const [content, setConversationContent] = useState<ChatHistoryOfConversation | null>(null);
  const historyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!conversationId) return;

    getChatHistoryOfConversation(conversationId)
      .then((data) => setConversationContent(data.result))
      .catch(() => toast.error('Failed to load users'));
  }, [conversationId]);

  useEffect(() => {
    if (historyRef.current) {
      historyRef.current.scrollTop = historyRef.current.scrollHeight;
    }
  }, [content]);

  useEffect(() => {
    const conversationContentHandler = (payload: { meta: SocketPayloadType }) => {
      const hasMessageForCurrentConversation = payload.meta.message.conversationId === conversationId;

      setConversationContent((prev) => {
        if (!prev || !hasMessageForCurrentConversation) return prev;

        const isDuplicate = prev.messages.some((m) => m.id === payload.meta.message.id);
        if (isDuplicate) return prev;

        return {
          ...prev,
          isReadByAdmin: payload.meta.conversation.isReadByAdmin,
          messages: [...prev.messages, payload.meta.message],
        };
      });
    };

    socket.on('socket_event', conversationContentHandler);
    return () => {
      socket.off('socket_event', conversationContentHandler);
    };
  }, [conversationId]);

  // update conversation status
  useEffect(() => {
    if (!conversationId) return;

    if (content?.isReadByAdmin === false) {
      updateConversation(conversationId, {
        isReadByAdmin: true,
        // status: 'OPEN',
      }).then(() => {
        setConversationContent((prev) => {
          if (!prev) return prev;

          return {
            ...prev,
            isReadByAdmin: true,
          };
        });
      });
    }
  }, [conversationId, content]);

  const listMessages = useMemo(() => {
    return content ? groupMessagesByDate(content.messages) : [];
  }, [content]);

  return (
    <div className="w-full h-screen flex flex-col">
      {!conversationId && <EmptyConversation />}
      {content && (
        <>
          <UserCard user={content.telegramUser} />
          <div ref={historyRef} className="conversation-history p-3 overflow-auto flex-1 flex flex-col gap-5">
            {listMessages &&
              listMessages.map((item) => (
                <div className="flex flex-col gap-3" key={item.date}>
                  <DateDivider label={item.date} />
                  {item.messages.map((message) => (
                    <MessageBubble
                      key={message.id}
                      senderType={message.senderType}
                      content={message.content}
                      sendTime={new Date(message.createdAt)}
                      fileUrls={message.fileUrls}
                      sentByAdmin={message.sentByAdmin}
                      telegramUser={content.telegramUser}
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
