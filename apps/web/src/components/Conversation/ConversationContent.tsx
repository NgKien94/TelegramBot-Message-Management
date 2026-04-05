import { useContext, useEffect, useMemo, useRef } from 'react';
import MessageBubble from './MessageBubble';
import UserCard from './UserCard';
// import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {  updateConversation } from '@message-management/client';
import EmptyConversation from './EmptyConversation';

import {
  Messages,
} from '@message-management/types';
import { ConversationIdContext } from '../../contexts/conversation.context';
import Editor from '../Editor/Editor';
import { formatTimestamp } from '@message-management/utils';
import DateDivider from './DateDivider';
import { useAppContext } from '../../contexts/global.context';

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
  const conversationId = useContext(ConversationIdContext) || '';

  const {chatHistoriesMap, loadChatHistory} = useAppContext()
  const content = chatHistoriesMap[conversationId]

  const historyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!conversationId) return
    loadChatHistory(conversationId)
  }, [conversationId, loadChatHistory]);

  useEffect(() => {
    if (historyRef.current) {
      historyRef.current.scrollTop = historyRef.current.scrollHeight;
    }
  }, [content]);


  // update conversation status
  useEffect(() => {
    if (!conversationId) return;

    if (content?.isReadByAdmin === false) {
      updateConversation(conversationId, {
        isReadByAdmin: true,
      }).then(() => {
        console.log("Update isReadByAdmin successfully");
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
