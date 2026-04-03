

export default function EmptyConversation() {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <img
        src="../../../public/empty-conversation.svg"
        alt="Select conversation"
        className="object-contain w-2/5 h-2/5"
      />
      <h1 className="text-lg font-bold mt-5 text-blue text-[var(--primary-color)]">
        Select a conversation or the conversation not found
      </h1>
    </div>
  );
}
