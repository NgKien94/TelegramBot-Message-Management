import { EditorContent, Extension, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import ToolBar from './ToolBar';
import { useContext, useRef, useState } from 'react';
import { ConversationIdContext } from '../../contexts/conversation.context';
import { useMutation } from '@tanstack/react-query';
import { createMessage, uploadImage } from '@message-management/client';
import { SenderType } from '@message-management/types';
import { sanitizeToTelegramHtml, toBase64FromBlob } from '@message-management/utils';
import Image from '@tiptap/extension-image';
import { LuImagePlus } from 'react-icons/lu';
import CharacterCount from '@tiptap/extension-character-count';

const MAX_LENGTH = 1024;

const createCustomEnter = (onSubmit: () => void) =>
  Extension.create({
    name: 'customEnter',
    addKeyboardShortcuts() {
      return {
        Enter: () => {
          onSubmit();
          return true;
        },
      };
    },
  });

export default function Editor() {
  const conversationId = useContext(ConversationIdContext);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [charCounter, setCharCounter] = useState<number>(0);
  const handleSubmitRef = useRef<(() => Promise<void>) | null>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    console.log('File: ', file);

    if (!file || !editor) {
      return;
    }

    const objectUrl = URL.createObjectURL(file); // create a link : blob:http://.... => binary data of file in RAM Browser
    editor.chain().focus().setImage({ src: objectUrl }).run();

    e.target.value = '';
  };

  const createMessageMutation = useMutation({
    mutationFn: createMessage,
    onSuccess: () => {
      console.log('Create message successfully');
    },
    onError: (error) => {
      console.log('Create message failed: ', error);
    },
  });

  const handleSubmit = async () => {
    if (!editor) {
      return;
    }

    const text = editor.getText().trim();
    const rawHtml = editor.getHTML();

    const divElement = document.createElement('div');
    divElement.innerHTML = rawHtml;
    const imgElements = divElement.querySelectorAll('img');

    // const base64Images: string[] = [];

    // await Promise.all(
    //   Array.from(imgElements).map(async (img) => {
    //     // fetch object URL
    //     const response = await fetch(img.src);

    //     // get raw binary data
    //     const blob = await response.blob();

    //     const base64 = await toBase64FromBlob(blob);
    //     base64Images.push(base64);
    //   }),
    // );

    const fileUrls = await Promise.all(
      Array.from(imgElements).map(async (img) => {
        // fetch object URL
        const response = await fetch(img.src);

        // get raw binary data
        const blob = await response.blob();
        console.log("Blob: ",blob);

        const data = await uploadImage(blob)
        console.log("Data: ",data);
        return data.result.url
      }),
    );

    const sanitizedHtml = sanitizeToTelegramHtml(editor.getHTML());

    if (!text && imgElements.length === 0) {
      return;
    }

    const adminId = localStorage.getItem('id')

    createMessageMutation.mutate({
      conversationId: conversationId || '',
      senderType: SenderType.OUTGOING,
      fileUrls,
      content: sanitizedHtml,
      sentByAdmin: adminId,
    });

    editor.commands.clearContent();
  };

  handleSubmitRef.current = handleSubmit;

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
      createCustomEnter(() => handleSubmitRef.current?.()),
    ],
    onUpdate({ editor }) {
      setCharCounter(editor.storage.characterCount.characters());
    },
  });

  return (
    <div className="border border-gray-300 p-1 w-4/5  rounded-xl shadow-xl">
      <div className="overflow-y-auto text-sm max-h-20">
        <EditorContent
          placeholder="Write something ..."
          editor={editor}
          className=" [&_.ProseMirror]:outline-none [&_.ProseMirror]:p-2"
        />
      </div>

      {editor && (
        <div className="flex justify-start items-center px-2 pb-1">
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
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageSelect} />

          <ToolBar editor={editor} />
        </div>
      )}
    </div>
  );
}
