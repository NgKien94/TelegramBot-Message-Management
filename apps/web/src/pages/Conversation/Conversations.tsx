import { useState } from "react";
import ConversationContent from "../../components/Conversation/ConversationContent";
import ConversationFilter from "../../components/Conversation/ConversationFilter";
import ConversationList from "../../components/Conversation/ConversationList";

export default function Conversations() {
  const [conversationDetail, setConversationDetail] = useState<string | undefined>(undefined)
  return (
    <div className='flex'>
      <div className="bg-gray-50">
        <ConversationFilter />
        <ConversationList setConversation={setConversationDetail} />
      </div>
      <ConversationContent conversationId={conversationDetail}/>
    </div>
  );
}
