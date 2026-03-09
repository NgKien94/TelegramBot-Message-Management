import {  TextArea } from '@radix-ui/themes';
import {  BsSendArrowUp } from "react-icons/bs";

export default function ChatInput() {
  return (
    <div className="flex justify-center items-center gap-2 h-full">
      <TextArea size="1" placeholder="Message..." className='w-1/3' />
      <BsSendArrowUp   className="text-2xl text-[var(--primary-color)]" />
    </div>
  );
}
