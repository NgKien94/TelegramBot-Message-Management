import { Box, TextArea } from '@radix-ui/themes';
import { VscSend } from 'react-icons/vsc';
import { BsSend, BsSendArrowUp } from "react-icons/bs";

export default function ChatInput() {
  return (
    <div className="flex justify-center items-center gap-2 h-full">
      {/* <input
      placeholder="Message..."
        type="text"
        className="text-sm block w-1/3 px-3 py-2.5 border focus:border-blue-400  text-blue-400 border-gray-200 rounded-xl focus:outline-none focus:ring-0 placeholder:text-gray-400 placeholder:font-normal font-medium transition duration-150 ease-linear"
      /> */}
      <TextArea size="1" placeholder="Message..." className='w-1/3' />
      {/* <VscSend className="text-2xl text-[var(--primary-color)]" /> */}
      <BsSendArrowUp   className="text-2xl text-[var(--primary-color)]" />
    </div>
  );
}
