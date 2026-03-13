import { useState } from 'react';
import ConversationContent from '../../components/Conversation/ConversationContent';
import ConversationFilter from '../../components/Conversation/ConversationFilter';
import ConversationList from '../../components/Conversation/ConversationList';
import { ConversationIdContext } from '../../contexts/conversation.context';

export default function Conversations() {
  const [conversationDetail, setConversationDetail] = useState<string | undefined>(undefined);
  return (
    <div className="flex">
      <div className="bg-gray-50">
        <ConversationFilter />
        <ConversationList setConversation={setConversationDetail} />
      </div>
      <ConversationIdContext value={conversationDetail}>
        <ConversationContent />
      </ConversationIdContext>
    </div>
  );
}
