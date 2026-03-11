import {  TextArea } from '@radix-ui/themes';
import { VscSend } from 'react-icons/vsc';

export default function ChatInput() {
  return (
    <div className="flex justify-center items-center gap-5 h-full">
      <TextArea size="1" placeholder="Message..." className='w-2/4' />
      <VscSend  className="text-3xl text-[var(--primary-color)]" />
    </div>
  );
}
