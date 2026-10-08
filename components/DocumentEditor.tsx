"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";

import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Heading1,
  Heading2,
  List,
  ListOrdered,
} from "lucide-react";

type DocumentEditorProps = {
  content: string;
  onChange: (content: string) => void;
  editable?: boolean;
};

export default function DocumentEditor({
  content,
  onChange,
  editable = true,
}: DocumentEditorProps) {
  const editor = useEditor({
  extensions: [
    StarterKit,
    Underline,
  ],

  content,

  editable,

  immediatelyRender: false,

  onUpdate({ editor }) {
    onChange(editor.getHTML());
  },
});

  if (!editor) {
    return null;
  }

  return (
    <div className="overflow-hidden rounded-lg border bg-white">
      <div className="flex flex-wrap gap-1 border-b p-2">
        <ToolbarButton
          active={editor.isActive("bold")}
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleBold()
              .run()
          }
        >
          <Bold size={16} />
        </ToolbarButton>

        <ToolbarButton
          active={editor.isActive("italic")}
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleItalic()
              .run()
          }
        >
          <Italic size={16} />
        </ToolbarButton>

        <ToolbarButton
          active={editor.isActive("underline")}
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleUnderline()
              .run()
          }
        >
          <UnderlineIcon size={16} />
        </ToolbarButton>

        <div className="mx-1 border-l" />

        <ToolbarButton
          active={editor.isActive("heading", {
            level: 1,
          })}
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleHeading({
                level: 1,
              })
              .run()
          }
        >
          <Heading1 size={16} />
        </ToolbarButton>

        <ToolbarButton
          active={editor.isActive("heading", {
            level: 2,
          })}
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleHeading({
                level: 2,
              })
              .run()
          }
        >
          <Heading2 size={16} />
        </ToolbarButton>

        <div className="mx-1 border-l" />

        <ToolbarButton
          active={editor.isActive("bulletList")}
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleBulletList()
              .run()
          }
        >
          <List size={16} />
        </ToolbarButton>

        <ToolbarButton
          active={editor.isActive("orderedList")}
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleOrderedList()
              .run()
          }
        >
          <ListOrdered size={16} />
        </ToolbarButton>
      </div>

      <EditorContent
        editor={editor}
        className="min-h-[500px] p-6 prose max-w-none"
      />
    </div>
  );
}

function ToolbarButton({
  children,
  onClick,
  active,
}: {
  children: React.ReactNode;
  onClick: () => void;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded p-2 ${
        active
          ? "bg-gray-200"
          : "hover:bg-gray-100"
      }`}
    >
      {children}
    </button>
  );
}