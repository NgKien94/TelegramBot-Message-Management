import { TextArea } from '@radix-ui/themes';
import { useContext, useState } from 'react';
import { VscSend } from 'react-icons/vsc';
import { ConversationIdContext } from '../../contexts/conversation.context';
import { useMutation } from '@tanstack/react-query';
import { createMessage, socket } from '@message-management/client';
import { SenderType } from '@message-management/types';

export default function ChatInput() {
  const conversationId = useContext(ConversationIdContext);
  const [message, setMessage] = useState<string>('');
  // const createMessageMutation = useMutation({
  //   mutationFn: createMessage,
  //   onSuccess: () => {
  //     console.log('Create message successfully');
  //   },
  //   onError: (error) => {
  //     console.log('Create message failed: ', error);
  //   },
  // });

  // const handleOnClickSend = () => {
  //   if (message) {
  //     console.log('Value: ', message);
  //     createMessageMutation.mutate({
  //       conversationId: conversationId || '',
  //       senderType: SenderType.OUTGOING,
  //       content: message,
  //       sentByAdmin: true
  //     })
  //   }
  //   setMessage('');
  // };

  const handleOnClickSend = () => {
    if (message) {
      console.log('Client emit create message event: ', message);
      socket.emit('create_message', {
        conversationId: conversationId || '',
        senderType: SenderType.OUTGOING,
        content: message,
        sentByAdmin: true,
      });
    }
    setMessage('');
  };

  return (
    <div className="flex justify-center items-center gap-5 h-full">
      <TextArea
        size="1"
        placeholder="Message..."
        className="w-2/4 min-h-11"
        value={message}
        onChange={(e) => {
          setMessage(e.target.value);
        }}
      />
      <VscSend className="text-3xl text-[var(--primary-color)]" onClick={handleOnClickSend} />
    </div>
  );
}
