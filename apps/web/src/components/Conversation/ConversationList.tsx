import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import ConversationItem from './ConversationItem';
import { getConversationsList, updateConversation } from '@message-management/client';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { socket } from '../../socket';
import {
  ApiDataForClient,
  Conversation,
  GetConversationRequest,
  UpdateConversationRequest,
} from '@message-management/types';

interface ConversationListProps extends React.HTMLAttributes<HTMLDivElement> {
  setConversation: Dispatch<SetStateAction<string | undefined>>;
  filterCriteria: GetConversationRequest;
}

export default function ConversationList({ setConversation, filterCriteria, ...rest }: ConversationListProps) {
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
      console.log('Error when mutation conversation list', error);
    },
  });

  useEffect(() => {
    const handlerConversationList = (payload: { conversation: Conversation }) => {
      const queries = queryClient.getQueryCache().findAll({ queryKey: ['conversation-list'] });

      queries.forEach((query) => {
        const status = (query.queryKey[1] as GetConversationRequest).status;

        queryClient.setQueryData(query.queryKey, (oldData: ApiDataForClient<Conversation[]>) => {
          if (!oldData) return oldData;

          const filteredList = oldData.result.filter((c) => c.id !== payload.conversation.id);

          if (status === payload.conversation.status) {
            return {
              result: [payload.conversation, ...filteredList],
            };
          }

          return {
            result: filteredList,
          };
        });
      });

    };
    socket.on('conversation_updated', handlerConversationList);
    return () => {
      socket.off('conversation_updated', handlerConversationList);
    };
  }, [queryClient]);

  const { isSuccess, data } = useQuery({
    queryKey: ['conversation-list', filterCriteria],
    queryFn: () => getConversationsList(filterCriteria),
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
    <div {...rest} className="px-3 w-96 h-screen flex flex-col space-y-2">
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
