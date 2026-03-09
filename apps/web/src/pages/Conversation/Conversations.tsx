import ConversationContent from "../../components/Conversation/ConversationContent";
import ConversationFilter from "../../components/Conversation/ConversationFilter";
import ConversationList from "../../components/Conversation/ConversationList";

export default function Conversations() {
  return (
    <div className='flex'>
      <div className="bg-gray-50">
        <ConversationFilter />
        <ConversationList />
      </div>
      <ConversationContent />
    </div>
  );
}
