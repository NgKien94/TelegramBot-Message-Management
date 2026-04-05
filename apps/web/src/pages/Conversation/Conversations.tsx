import { useState } from 'react';
import ConversationContent from '../../components/Conversation/ConversationContent';
import ConversationFilter from '../../components/Conversation/ConversationFilter';
import ConversationList from '../../components/Conversation/ConversationList';
import { ConversationIdContext } from '../../contexts/conversation.context';
import { GetConversationRequest } from '@message-management/types';
import { useParams } from 'react-router-dom';

const initialFilter: GetConversationRequest = {
  status: 'OPEN'
}

export default function Conversations() {
  const {conversationId} = useParams<{conversationId?: string}>()

  const [filter, setFilter] = useState<GetConversationRequest>(initialFilter)

  return (
    <div className="flex">
      <div className="basis-7/12 min-w-64 shadow-lg">
        <ConversationFilter onApplyFilter={setFilter} filter={filter} />
        <ConversationList  filterCriteria={filter}/>
      </div>
      <ConversationIdContext.Provider value={conversationId}>
        <ConversationContent />
      </ConversationIdContext.Provider>
    </div>
  );
}
