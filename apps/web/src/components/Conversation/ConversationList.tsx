import ConversationItem from './ConversationItem';

export default function ConversationList() {
  return (
    <div className='px-3 w-80 h-screen flex flex-col'>
      <ConversationItem />
      <ConversationItem />
      <ConversationItem />
      <ConversationItem />
    </div>
  );
}
