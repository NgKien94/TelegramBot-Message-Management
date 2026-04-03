import { Dispatch, MouseEvent, SetStateAction, useState } from 'react';
import { Modal } from '@message-management/shared/ui';
import { Button, Flex, TextArea } from '@radix-ui/themes';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getUsers, sendBroadcastMessage } from '@message-management/client';
import { toast } from 'react-toastify';
import { MessageType } from '@message-management/types';
import Select from 'react-select';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import ToolBar from './Editor/ToolBar';
import { sanitizeToTelegramHtml } from '@message-management/utils';

interface ModalLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpenModal: boolean;
  setIsOpenModal: Dispatch<SetStateAction<boolean>>;
}

type OptionType = { value: string; label: string };

export default function ModalLayout({ isOpenModal, setIsOpenModal }: ModalLayoutProps) {
  const [selectedOption, setSelectedOption] = useState<OptionType[]>([]);

  const { data } = useQuery({
    queryKey: ['users'],
    queryFn: () => getUsers(),
    enabled: isOpenModal,
  });

  const options: OptionType[] =
    data?.result.map((item) => {
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

  const adminId = localStorage.getItem('id');
  const handleOnClickSend = (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
    const textContent  = editor.getText()
    const htmlContent = editor.getHTML()

    if (textContent) {
      const sanitizedHtml = sanitizeToTelegramHtml(htmlContent);
      sendBroadcastMessageMutation.mutate({
        content: sanitizedHtml,
        type: MessageType.TEXT,
        sentByAdmin: adminId as string,
        conversationIds: selectedOption.map((item) => item.value),
      });
    }
    editor.commands.clearContent()
    setIsOpenModal(false);
  };

  const editor = useEditor({
    extensions: [StarterKit],
  });

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

          <div className="overflow-y-auto text-sm flex-1 border border-gray-300 rounded-md">
            <EditorContent
              placeholder="Write something ..."
              editor={editor}
              className=" [&_.ProseMirror]:outline-none [&_.ProseMirror]:p-2"
            />
          </div>
          <ToolBar editor={editor} />
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
