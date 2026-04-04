import { Dispatch, MouseEvent, SetStateAction, useEffect, useRef, useState } from 'react';
import { Modal } from '@message-management/shared/ui';
import { Button, Flex } from '@radix-ui/themes';
// import { useMutation, useQuery } from '@tanstack/react-query';
import { getUsers, sendBroadcastMessage, uploadImage } from '@message-management/client';
import { toast } from 'react-toastify';
import Select from 'react-select';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import ToolBar from './Editor/ToolBar';
import { sanitizeToTelegramHtml } from '@message-management/utils';
import { LuImagePlus } from 'react-icons/lu';
import Image from '@tiptap/extension-image';
import CharacterCount from '@tiptap/extension-character-count';

interface ModalLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpenModal: boolean;
  setIsOpenModal: Dispatch<SetStateAction<boolean>>;
}

type OptionType = { value: string; label: string };
const MAX_LENGTH = 1024;

export default function ModalLayout({ isOpenModal, setIsOpenModal }: ModalLayoutProps) {
  const [selectedOption, setSelectedOption] = useState<OptionType[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [charCounter, setCharCounter] = useState<number>(0);
  const adminId = localStorage.getItem('id');
  const [users, setUsers] = useState<
    {
      telegramID: string;
      username: string;
      firstName: string;
      lastName: string;
      conversation: {
        id: string;
        isReadByAdmin: boolean;
      };
    }[]
  >([]);

  // const { data } = useQuery({
  //   queryKey: ['users'],
  //   queryFn: () => getUsers(),
  //   enabled: isOpenModal,
  // });

  // const options: OptionType[] =
  //   data?.result.map((item) => {
  //     return {
  //       value: item.conversation.id,
  //       label: `${item.firstName} ${item.lastName}`,
  //     };
  //   }) ?? [];

  useEffect(() => {
    getUsers()
      .then((data) => setUsers(data.result))
      .catch(() => toast.error('Failed to load users'));
  }, []);

  const options: OptionType[] =
    users.map((item) => {
      return {
        value: item.conversation.id,
        label: `${item.firstName} ${item.lastName}`,
      };
    }) ?? [];

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file || !editor) {
      return;
    }

    const objectUrl = URL.createObjectURL(file); // create a link : blob:http://.... => binary data of file in RAM Browser
    editor.chain().focus().setImage({ src: objectUrl }).run();

    e.target.value = '';
  };

  // const sendBroadcastMessageMutation = useMutation({
  //   mutationFn: sendBroadcastMessage,
  //   onSuccess: () => {
  //     toast.success('Send broadcast message successfully');
  //   },
  //   onError: (error) => {
  //     console.log('Error: ', error);
  //   },
  // });

  const handleOnClickSend = async (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
    const text = editor.getText().trim();
    const rawHtml = editor.getHTML();

    const divElement = document.createElement('div');
    divElement.innerHTML = rawHtml;
    const imgElements = divElement.querySelectorAll('img');

    const fileUrls = await Promise.all(
      Array.from(imgElements).map(async (img) => {
        // fetch object URL
        const response = await fetch(img.src);

        // get raw binary data
        const blob = await response.blob();
        const data = await uploadImage(blob);

        return data.result.url;
      }),
    );

    const sanitizedHtml = sanitizeToTelegramHtml(editor.getHTML());

    if (!text && imgElements.length === 0) {
      return;
    }

    if (text) {
      // sendBroadcastMessageMutation.mutate({
      //   fileUrls,
      //   content: sanitizedHtml,
      //   sentByAdmin: adminId as string,
      //   conversationIds: selectedOption.map((item) => item.value),
      // });
      try {
        await sendBroadcastMessage({
          fileUrls,
          content: sanitizedHtml,
          sentByAdmin: adminId as string,
          conversationIds: selectedOption.map((item) => item.value),
        });
        toast.success('Send broadcast message successfully');
      } catch (error) {
        console.log('Error: ', error);
      }
    }

    editor.commands.clearContent();
    setIsOpenModal(false);
  };

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        allowBase64: true,
        HTMLAttributes: {
          class: 'w-12 h-12 mr-1 align-bottom object-cover rounded-lg inline-block',
        },
      }),
      CharacterCount.configure({
        limit: MAX_LENGTH,
      }),
    ],
    onUpdate({ editor }) {
      setCharCounter(editor.storage.characterCount.characters());
    },
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

          <div className="flex flex-col text-sm flex-1 border border-gray-300 rounded-md overflow-hidden">
            <div className="overflow-y-auto flex-1">
              <EditorContent
                placeholder="Write something ..."
                editor={editor}
                className="[&_.ProseMirror]:outline-none [&_.ProseMirror]:p-2"
              />
            </div>

            {editor && (
              <div className="flex justify-start items-center px-2 py-1 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 rounded hover:bg-gray-100 text-gray-500 hover:text-blue-500 transition-colors"
                  title="Chèn ảnh"
                >
                  <LuImagePlus size={16} />
                </button>
                <span className={`text-xs ${charCounter >= MAX_LENGTH ? 'text-red-500' : 'text-gray-400'}`}>
                  {charCounter}/{MAX_LENGTH}
                </span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageSelect}
                />
                <ToolBar editor={editor} />
              </div>
            )}
          </div>

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
