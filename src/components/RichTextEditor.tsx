"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import Typography from "@tiptap/extension-typography";
import { Markdown } from "tiptap-markdown";
import { useCallback } from "react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false, // We'll use a better one or just starter kit's default
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-600 underline",
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "rounded-xl max-w-full h-auto shadow-lg my-8",
        },
      }),
      Typography,
      Placeholder.configure({
        placeholder: "Tulis cerita Anda di sini...",
      }),
      Markdown.configure({
        html: false, // Keep it pure markdown in DB
        tightLists: true,
        tightListClass: "tight",
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      // @ts-expect-error - getMarkdown exists in tiptap-markdown storage
      const markdown = editor.storage.markdown.getMarkdown();
      onChange(markdown);
    },
    editorProps: {
      attributes: {
        class: "prose prose-lg prose-serif max-w-none focus:outline-none min-h-[400px] p-6 font-serif",
      },
    },
  });

  const addImage = useCallback(() => {
    const url = window.prompt("Masukkan URL gambar:");
    if (url && editor) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  const setLink = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL Link:", previousUrl);

    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  if (!editor) return null;

  return (
    <div className="border rounded-2xl overflow-hidden bg-white shadow-sm border-gray-100 focus-within:ring-2 focus-within:ring-gray-900 transition-all">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 border-b bg-gray-50/50">
        <ToolbarButton 
          onClick={() => editor.chain().focus().toggleBold().run()} 
          active={editor.isActive("bold")}
          label="B" 
          title="Bold"
        />
        <ToolbarButton 
          onClick={() => editor.chain().focus().toggleItalic().run()} 
          active={editor.isActive("italic")}
          label="I" 
          className="italic"
          title="Italic"
        />
        <ToolbarButton 
          onClick={() => editor.chain().focus().toggleUnderline().run()} 
          active={editor.isActive("underline")}
          label="U" 
          className="underline"
          title="Underline"
        />
        <ToolbarButton 
          onClick={() => editor.chain().focus().toggleStrike().run()} 
          active={editor.isActive("strike")}
          label="S" 
          className="line-through"
          title="Strike"
        />
        
        <div className="w-[1px] h-6 bg-gray-200 mx-1" />

        <ToolbarButton 
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} 
          active={editor.isActive("heading", { level: 1 })}
          label="H1" 
          title="Heading 1"
        />
        <ToolbarButton 
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} 
          active={editor.isActive("heading", { level: 2 })}
          label="H2" 
          title="Heading 2"
        />
        <ToolbarButton 
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} 
          active={editor.isActive("heading", { level: 3 })}
          label="H3" 
          title="Heading 3"
        />

        <div className="w-[1px] h-6 bg-gray-200 mx-1" />

        <ToolbarButton 
          onClick={() => editor.chain().focus().toggleBulletList().run()} 
          active={editor.isActive("bulletList")}
          label="• List" 
          title="Bullet List"
        />
        <ToolbarButton 
          onClick={() => editor.chain().focus().toggleOrderedList().run()} 
          active={editor.isActive("orderedList")}
          label="1. List" 
          title="Ordered List"
        />
        <ToolbarButton 
          onClick={() => editor.chain().focus().toggleBlockquote().run()} 
          active={editor.isActive("blockquote")}
          label="“" 
          title="Blockquote"
        />

        <div className="w-[1px] h-6 bg-gray-200 mx-1" />

        <ToolbarButton 
          onClick={setLink} 
          active={editor.isActive("link")}
          label="🔗" 
          title="Link"
        />
        <ToolbarButton 
          onClick={addImage} 
          label="🖼️" 
          title="Image"
        />
        
        <ToolbarButton 
          onClick={() => editor.chain().focus().undo().run()} 
          label="↩️" 
          title="Undo"
        />
        <ToolbarButton 
          onClick={() => editor.chain().focus().redo().run()} 
          label="↪️" 
          title="Redo"
        />
      </div>

      <EditorContent editor={editor} />
    </div>
  );
}

function ToolbarButton({ 
  onClick, 
  active, 
  label, 
  className = "", 
  title 
}: { 
  onClick: () => void, 
  active?: boolean, 
  label: string | React.ReactNode, 
  className?: string,
  title?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`min-w-[40px] h-10 px-2 flex items-center justify-center rounded-lg text-sm font-medium transition-all ${
        active 
          ? "bg-gray-900 text-white shadow-md" 
          : "text-gray-600 hover:bg-gray-100"
      } ${className}`}
    >
      {label}
    </button>
  );
}
