import React, { HTMLAttributes } from 'react';
import { FaBold } from 'react-icons/fa';
import { GoItalic } from 'react-icons/go';
import { LuStrikethrough } from 'react-icons/lu';
import { IoCode } from 'react-icons/io5';
import { MdOutlineFormatUnderlined } from 'react-icons/md';
import { Editor } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';

interface ToolBarProps extends HTMLAttributes<HTMLDivElement> {
  editor: Editor;
}

export default function ToolBar({ editor, ...rest }: ToolBarProps) {
  if (!editor) return null;

  return (
    <BubbleMenu editor={editor}
    options={{ placement: 'top', offset: 8, flip: true }}
    className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg shadow-lg p-1"
    {...rest}
    >
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('bold') ? 'bg-gray-200 text-blue-600' : ''}`}
      >
        <FaBold size={13} />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('italic') ? 'bg-gray-200 text-blue-600' : ''}`}
      >
        <GoItalic size={13} />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('strike') ? 'bg-gray-200 text-blue-600' : ''}`}
      >
        <LuStrikethrough size={13} />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('underline') ? 'bg-gray-200 text-blue-600' : ''}`}
      >
        <MdOutlineFormatUnderlined size={13} />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleCode().run()}
        className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('code') ? 'bg-gray-400 text-blue-600' : ''}`}
      >
        <IoCode size={13} />
      </button>
    </BubbleMenu>
  );
}
