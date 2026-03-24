import { useState } from 'react';
import ConversationContent from '../../components/Conversation/ConversationContent';
import ConversationFilter from '../../components/Conversation/ConversationFilter';
import ConversationList from '../../components/Conversation/ConversationList';
import { ConversationIdContext } from '../../contexts/conversation.context';
import { GetConversationRequest } from '@message-management/types';

const initialFilter: GetConversationRequest = {
  status: 'OPEN'
}

export default function Conversations() {
  const [conversationDetail, setConversationDetail] = useState<string | undefined>(undefined);
  const [filter, setFilter] = useState<GetConversationRequest>(initialFilter)

  return (
    <div className="flex">
      <div className=" shadow-lg">
        <ConversationFilter onApplyFilter={setFilter} filter={filter} />
        <ConversationList setConversation={setConversationDetail} filterCriteria={filter}/>
      </div>
      <ConversationIdContext.Provider value={conversationDetail}>
        <ConversationContent />
      </ConversationIdContext.Provider>
    </div>
  );
}
