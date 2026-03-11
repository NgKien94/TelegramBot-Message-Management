import { useQuery, useQueryClient } from '@tanstack/react-query';
import ConversationItem from './ConversationItem';
import { getConversationsList } from '@message-management/client';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { socket } from '../../socket';
import { ApiDataForClient, Conversation } from '@message-management/types';

interface ConversationListProps extends React.HTMLAttributes<HTMLDivElement> {
  setConversation: Dispatch<SetStateAction<string | undefined>>;
}

export default function ConversationList({
  setConversation,
  ...rest
}: ConversationListProps) {
  const queryClient = useQueryClient();

  useEffect(() => {
    socket.on(
      'conversation_updated',
      (payload: { conversation: Conversation }) => {
        queryClient.setQueryData(
          ['conversation-list'],
          (oldData: ApiDataForClient<Conversation[]>) => {
            if (!oldData) return { result: [payload.conversation] };
            return {
              result: [
                payload.conversation,
                ...oldData.result.filter(
                  (c) => c.id !== payload.conversation.id,
                ),
              ],
            };
          },
        );

        console.log('cache:', queryClient.getQueryData(['conversation-list']));
      },
    );
    return () => {
      socket.off();
    };
  }, [queryClient]);

  const { isSuccess, data } = useQuery({
    queryKey: ['conversation-list'],
    queryFn: () => getConversationsList(),
  });

  return (
    <div {...rest} className="px-3 w-80 h-screen flex flex-col">
      {isSuccess &&
        data.result.map((conversation) => (
          <ConversationItem
            conversation={conversation}
            onClick={() => setConversation(conversation.id)}
            key={conversation.id}
          />
        ))}
    </div>
  );
}
