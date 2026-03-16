import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import ConversationItem from './ConversationItem';
import { getConversationsList, updateConversation } from '@message-management/client';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { socket } from '../../socket';
import { ApiDataForClient, Conversation, UpdateConversationRequest } from '@message-management/types';

interface ConversationListProps extends React.HTMLAttributes<HTMLDivElement> {
  setConversation: Dispatch<SetStateAction<string | undefined>>;
}

export default function ConversationList({ setConversation, ...rest }: ConversationListProps) {
  const queryClient = useQueryClient();
  const updateConversationMutation = useMutation({
    mutationFn: ({ conversationId, body }: { conversationId: string; body: UpdateConversationRequest }) =>
      updateConversation(conversationId, body),
    onSuccess: () => {
      console.log('Update conversation successfully');
      queryClient.invalidateQueries({
        queryKey: ['conversation-list'],
      });
    },
    onError: (error) => {
      console.log("Error when mutation conversation list", error);
    }
  });

  useEffect(() => {
    const handlerConversationList = (payload: { conversation: Conversation }) => {
      queryClient.setQueryData(['conversation-list'], (oldData: ApiDataForClient<Conversation[]>) => {
        if (!oldData) return { result: [payload.conversation] };
        return {
          result: [payload.conversation, ...oldData.result.filter((c) => c.id !== payload.conversation.id)],
        };
      });
    };
    socket.on('conversation_updated', handlerConversationList);
    return () => {
      socket.off('conversation_updated', handlerConversationList);
    };
  }, [queryClient]);

  const { isSuccess, data } = useQuery({
    queryKey: ['conversation-list'],
    queryFn: () => getConversationsList(),
  });

  const handleOnClickConversationItem = (conversationId: string) => () => {
    setConversation(conversationId);
    updateConversationMutation.mutate({
      conversationId: conversationId as string,
      body: {
        isReadByAdmin: true,
      },
    });
  };

  return (
    <div {...rest} className="px-3 w-80 h-screen flex flex-col">
      {isSuccess &&
        data.result.map((conversation) => (
          <ConversationItem
            conversation={conversation}
            onClick={handleOnClickConversationItem(conversation.id)}
            key={conversation.id}
          />
        ))}
    </div>
  );
}
