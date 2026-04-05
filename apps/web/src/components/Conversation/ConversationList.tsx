// import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import ConversationItem from './ConversationItem';
import { useEffect } from 'react';

import {
  Conversation,
  GetConversationRequest,
} from '@message-management/types';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../contexts/global.context';

interface ConversationListProps extends React.HTMLAttributes<HTMLDivElement> {
  filterCriteria: GetConversationRequest;
}

export default function ConversationList({ filterCriteria, ...rest }: ConversationListProps) {
  const navigate = useNavigate();
  const { conversationsMap, loadConversations } = useAppContext();

  const statusKey = filterCriteria.status ?? 'ALL';
  const key = filterCriteria.search ? `${statusKey}_search` : statusKey;

  const conversations = conversationsMap[key] ?? [];

  useEffect(() => {
    loadConversations(filterCriteria);
  }, [filterCriteria, loadConversations]);

  const handleOnClickConversationItem = (conversation: Conversation) => () => {
    navigate(`/conversations/${conversation.id}`);
  };

  return (
    <div {...rest} className="px-3 h-screen flex flex-col space-y-2">
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
