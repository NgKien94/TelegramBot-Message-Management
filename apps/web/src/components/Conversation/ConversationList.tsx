// import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import ConversationItem from './ConversationItem';
import { getConversationsList, socket, updateConversation } from '@message-management/client';
import { useEffect, useState } from 'react';

import {
  ApiDataForClient,
  Conversation,
  GetConversationRequest,
  SocketPayloadType,
  UpdateConversationRequest,
} from '@message-management/types';
import { useNavigate } from 'react-router-dom';
import { Loading } from '@message-management/shared/ui';
import { toast } from 'react-toastify';

interface ConversationListProps extends React.HTMLAttributes<HTMLDivElement> {
  filterCriteria: GetConversationRequest;
}

export default function ConversationList({ filterCriteria, ...rest }: ConversationListProps) {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<Conversation[]>([]);

  useEffect(() => {
    getConversationsList(filterCriteria)
      .then((data) => setConversations(data.result))
      .catch(() => toast.error('Failed to load users'));
  }, [filterCriteria]);

  // const queryClient = useQueryClient();
  // const updateConversationMutation = useMutation({
  //   mutationFn: ({ conversationId, body }: { conversationId: string; body: UpdateConversationRequest }) =>
  //     updateConversation(conversationId, body),
  //   onSuccess: (_, variables) => {
  //     queryClient.setQueryData(['conversation-list', filterCriteria], (oldData: ApiDataForClient<Conversation[]>) => {
  //       if (!oldData) return oldData;
  //       return {
  //         result: oldData.result.map((conversation) => {
  //           if (conversation.id === variables.conversationId) {
  //             return {
  //               ...conversation,
  //               isReadByAdmin: variables.body.isReadByAdmin,
  //             };
  //           }
  //           return conversation;
  //         }),
  //       };
  //     });
  //   },
  //   onError: (error) => {
  //     console.log('Error when mutation conversation list', error);
  //   },
  // });

  // useEffect(() => {
  //   const handlerConversationList = (payload: { conversation: Conversation }) => {
  //     const queries = queryClient.getQueryCache().findAll({ queryKey: ['conversation-list'] });

  //     queries.forEach((query) => {
  //       const status = (query.queryKey[1] as GetConversationRequest).status;

  //       queryClient.setQueryData(query.queryKey, (oldData: ApiDataForClient<Conversation[]>) => {
  //         if (!oldData) return oldData;

  //         const filteredList = oldData.result.filter((c) => c.id !== payload.conversation.id);

  //         if (status === payload.conversation.status) {
  //           return {
  //             result: [payload.conversation, ...filteredList],
  //           };
  //         }

  //         return {
  //           result: filteredList,
  //         };
  //       });
  //     });
  //   };
  //   socket.on('conversation_updated', handlerConversationList);

  //   return () => {
  //     socket.off('conversation_updated', handlerConversationList);
  //   };
  // }, [queryClient]);

  // const { isSuccess, isLoading, data } = useQuery({
  //   queryKey: ['conversation-list', filterCriteria],
  //   queryFn: () => getConversationsList(filterCriteria),
  // });

  // const handleOnClickConversationItem = (conversation: Conversation) => () => {
  // navigate(`/conversations/${conversation.id}`);
  // if (!conversation.isReadByAdmin) {
  //   updateConversationMutation.mutate({
  //     conversationId: conversation.id,
  //     body: {
  //       isReadByAdmin: true,
  //     },
  //   });
  // }
  // };

  // new handler with useState instead Tanstack query
  // useEffect(() => {
  //   const handlerConversationList = (payload: { conversation: Conversation }) => {
  //     setConversations((prev) => {
  //       const others = prev.filter((c) => c.id !== payload.conversation.id);

  //       if (payload.conversation.status === filterCriteria.status) {
  //         return [payload.conversation, ...others];
  //       }

  //       return others;
  //     });
  //   };
  //   socket.on('conversation_updated', handlerConversationList);

  //   return () => {
  //     socket.off('conversation_updated', handlerConversationList);
  //   };
  // }, [filterCriteria.status]);

  useEffect(() => {
    const handlerConversationList = (payload: { meta: SocketPayloadType }) => {

      setConversations((prev) => {
        const others = prev.filter((c) => c.id !== payload.meta.conversation.id);

        if (payload.meta.conversation.status === filterCriteria.status) {
          return [
            {
              ...payload.meta.conversation,
              telegramUser: payload.meta.telegramUser,
              lastMessage: {
                ...payload.meta.message,
                content: payload.meta.message.content ?? ''
              },
              lastMessageAt: payload.meta.message.createdAt,
            },
            ...others,
          ];
        }

        return others;
      });
    };
    socket.on('socket_event', handlerConversationList);

    return () => {
      socket.off('socket_event', handlerConversationList);
    };
  }, [filterCriteria.status]);

  const handleOnClickConversationItem = (conversation: Conversation) => () => {
    navigate(`/conversations/${conversation.id}`);
  };

  return (
    <div {...rest} className="px-3 h-screen flex flex-col space-y-2">
      {/* {isLoading && <Loading />}
      {isSuccess &&
        data.result.map((conversation) => (
          <ConversationItem
            conversation={conversation}
            onClick={handleOnClickConversationItem(conversation)}
            key={conversation.id}
          />
        ))} */}
      {conversations &&
        conversations.map((conversation) => (
          <ConversationItem
            conversation={conversation}
            onClick={handleOnClickConversationItem(conversation)}
            key={conversation.id}
          />
        ))}
    </div>
  );
}
