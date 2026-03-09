import { IoSend } from "react-icons/io5";


export default function ChatInput() {
  return (
    <div className="flex justify-center items-center gap-2 h-full">
      <input
      placeholder="Message..."
        type="text"
        className="text-sm block w-2/4 px-3 py-2.5 border focus:border-blue-400  text-blue-400 border-gray-200 rounded-xl focus:outline-none focus:ring-0 placeholder:text-gray-400 placeholder:font-normal font-medium transition duration-150 ease-linear"
      />
      <IoSend className="text-3xl text-[var(--primary-color)]"/>
    </div>
  );
}
