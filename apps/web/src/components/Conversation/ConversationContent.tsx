import { useContext, useEffect, useRef } from 'react';
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
      queryClient.setQueryData(
        ['chat-history', conversationId],
        (oldData: ApiDataForClient<ChatHistoryOfConversation>) => {
          // in case of, websocket emit event while useQuery is fetching api
          if (!oldData) return oldData;
          // filter message for current conversation and replace messages array of this conversation
          const newMessagesForCurrentConversation = payload.newMessages.filter(
            (item) => item.conversationId === conversationId,
          );
          const replaceMessages = oldData.result.messages.push(...newMessagesForCurrentConversation);
          return {
            ...oldData,
            messages: replaceMessages,
          };
        },
      );

      // mark current conversation is read
      if (conversationId) {
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

  return (
    <div className="w-full h-screen flex flex-col">
      {(!conversationId || isError) && <EmptyConversation />}
      {isSuccess && (
        <>
          <UserCard user={data.result.telegramUser} />
          <div ref={historyRef} className="conversation-history p-5 overflow-auto flex-1 flex flex-col gap-3">
            {data &&
              data.result.messages.map((message) => (
                <MessageBubble
                  key={message.id}
                  senderType={message.senderType}
                  content={message.content}
                  sendTime={new Date(message.createdAt)}
                />
              ))}
          </div>

          <div className="conversation-action w-full h-16 mb-2 flex justify-center">
            <Editor key={conversationId}/>
          </div>
        </>
      )}
    </div>
  );
}
