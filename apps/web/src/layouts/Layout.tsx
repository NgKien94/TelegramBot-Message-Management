import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { MouseEvent, useState } from 'react';
import { Modal } from '@message-management/shared/ui';
import { Button, Flex, TextArea } from '@radix-ui/themes';
import { useMutation } from '@tanstack/react-query';
import { sendBroadcastMessage } from '@message-management/client';
import { toast } from 'react-toastify';
import { MessageType } from '@message-management/types';
export default function Layout() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');

  const sendBroadcastMessageMutation = useMutation({
    mutationFn: sendBroadcastMessage,
    onSuccess: () => {
      toast.success('Send broadcast message successfully');
    },
    onError: (error) => {
      console.log('Error: ', error);
    },
  });

  const handleOnClickSend = (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
    if (message) {
      sendBroadcastMessageMutation.mutate({ content: message, type:  MessageType.TEXT});
    }
    setMessage('');
    setIsOpen(false)
  };

  return (
    <section className="flex min-h-screen ">
      <Sidebar onOpenBroadCastModal={() => setIsOpen(true)} />
      <div className="flex flex-col flex-1">
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
      {isOpen && (
        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <TextArea
            placeholder="Type here …"
            radius="full"
            className="h-4/5"
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
            }}
          />
          <Flex gap="3" className="mt-3">
            <Button
              radius="medium"
              variant="solid"
              color="gray"
              size="2"
              className="flex-1"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button radius="medium" variant="solid" size="2" className="flex-1" onClick={handleOnClickSend}>
              Send
            </Button>
          </Flex>
        </Modal>
      )}
    </section>
  );
}
