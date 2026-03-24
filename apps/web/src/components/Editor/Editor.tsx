import { EditorContent, Extension, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import ToolBar from './ToolBar';
import { useContext } from 'react';
import { ConversationIdContext } from '../../contexts/conversation.context';
import { useMutation } from '@tanstack/react-query';
import { createMessage } from '@message-management/client';
import { SenderType } from '@message-management/types';
import { sanitizeToTelegramHtml } from '@message-management/utils';

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

  const createMessageMutation = useMutation({
    mutationFn: createMessage,
    onSuccess: () => {
      console.log('Create message successfully');
    },
    onError: (error) => {
      console.log('Create message failed: ', error);
    },
  });

  const handleSubmit = () => {
    if (!editor) {
      return;
    }

    const text = editor.getText().trim();
    if (!text) {
      return;
    }

    const sanitizedHtml = sanitizeToTelegramHtml(editor.getHTML());

    createMessageMutation.mutate({
      conversationId: conversationId || '',
      senderType: SenderType.OUTGOING,
      content: sanitizedHtml,
      sentByAdmin: true,
    });

    editor.commands.clearContent();
  };

  const editor = useEditor({
    extensions: [StarterKit, createCustomEnter(handleSubmit)],
  });

  return (
    <div className="border border-gray-300 p-1 w-4/5 h-full rounded-xl shadow-xl flex flex-col">
      {editor && <ToolBar editor={editor} />}
      <div className="flex-1 overflow-y-auto text-sm">
        <EditorContent
          placeholder="Write something ..."
          editor={editor}
          className="[&_.ProseMirror]:min-h-full [&_.ProseMirror]:outline-none [&_.ProseMirror]:p-2"
        />
      </div>
    </div>
  );
}
