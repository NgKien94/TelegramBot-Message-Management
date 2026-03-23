import { Dispatch, MouseEvent, SetStateAction, useState } from 'react';
import { Modal } from '@message-management/shared/ui';
import { Button, Flex, TextArea } from '@radix-ui/themes';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getUsers, sendBroadcastMessage } from '@message-management/client';
import { toast } from 'react-toastify';
import { MessageType } from '@message-management/types';
import Select from 'react-select';

interface ModalLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpenModal: boolean;
  setIsOpenModal: Dispatch<SetStateAction<boolean>>;
}

type OptionType = { value: string; label: string };

export default function ModalLayout({ isOpenModal, setIsOpenModal }: ModalLayoutProps) {
  const [message, setMessage] = useState<string>('');
  const [selectedOption, setSelectedOption] = useState<OptionType[]>([]);

  const { data } = useQuery({
    queryKey: ['users'],
    queryFn: () => getUsers(),
    enabled: isOpenModal,
  });

  const options: OptionType[] = data?.result.map((item) => {
    return {
        value: item.conversation.id,
        label: `${item.firstName} ${item.lastName}`,
      };
  }) ?? [];

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
      sendBroadcastMessageMutation.mutate({
        content: message,
        type: MessageType.TEXT,
        conversationIds: selectedOption.map((item) => item.value),
      });
    }
    setMessage('');
    setIsOpenModal(false);
  };

  return (
    <div>
      <Modal isOpen={isOpenModal} onClose={() => setIsOpenModal(false)}>
        <div className="flex flex-col gap-3 h-full">
          <Select
            isMulti
            placeholder="Select users"
            value={selectedOption}
            onChange={(newValue) => setSelectedOption([...newValue])}
            options={options}
            className="text-sm"
          />
          <TextArea
            placeholder="Type here …"
            radius="full"
            className="flex-1"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Flex gap="3">
            <Button
              radius="medium"
              variant="solid"
              color="gray"
              size="2"
              className="flex-1"
              onClick={() => setIsOpenModal(false)}
            >
              Cancel
            </Button>
            <Button radius="medium" variant="solid" size="2" className="flex-1" onClick={handleOnClickSend}>
              Send
            </Button>
          </Flex>
        </div>
      </Modal>
    </div>
  );
}
