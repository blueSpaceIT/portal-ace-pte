"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Heading from "@tiptap/extension-heading";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import { useEffect } from "react";
import {
  Bold,
  Italic,
  List,
  Link as LinkIcon,
  Image as ImageIcon,
  AlignLeft,
  Heading1,
  Heading2,
  Heading3,
  Undo,
  Redo,
} from "lucide-react";

interface RichTextEditorProps {
  value?: string | object | null;
  onChange?: (value: string) => void;
  placeholder?: string;
  label?: string;
  className?: string;
  required?: boolean;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Start typing...",
  label,
  className = "",
  required,
}: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: false,
        bulletList: false,
        orderedList: false,
        listItem: false,
      }),
      Heading.configure({
        levels: [1, 2, 3],
        HTMLAttributes: {
          class: "font-bold font-noto my-4",
        },
      }).extend({
        renderHTML({ node, HTMLAttributes }) {
          const level = node.attrs.level;
          const sizeClasses = {
            1: "text-4xl",
            2: "text-3xl",
            3: "text-2xl",
          };
          return [
            `h${level}`,
            {
              ...HTMLAttributes,
              class: `${HTMLAttributes.class || ""} ${
                sizeClasses[level as keyof typeof sizeClasses] || ""
              } text-blue-700`,
            },
            0,
          ];
        },
      }),
      BulletList.configure({
        HTMLAttributes: {
          class: "list-disc ml-6 my-2",
        },
      }),
      OrderedList.configure({
        HTMLAttributes: {
          class: "list-decimal ml-6 my-2",
        },
      }),
      ListItem.configure({
        HTMLAttributes: {
          class: "ml-2",
        },
      }),
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-600 underline",
        },
      }),
    ],
    content: value || "",
    editorProps: {
      attributes: {
        class:
          "prose prose-sm max-w-none focus:outline-none min-h-[200px] p-4 text-gray-900 bg-white",
      },
    },
    onUpdate: ({ editor }) => {
      if (onChange) {
        const html = editor.getHTML();
        onChange(html === "<p></p>" ? "" : html);
      }
    },
  });

  useEffect(() => {
    if (editor && value !== undefined) {
      const currentContent = editor.getHTML();
      let newContent = "";

      if (typeof value === "string") {
        newContent = value || "";
      } else if (value && typeof value === "object") {
        try {
          editor.commands.setContent(value);
          return;
        } catch {
          newContent = "";
        }
      }

      if (currentContent !== newContent) {
        editor.commands.setContent(newContent);
      }
    }
  }, [value, editor]);

  if (!editor) {
    return (
      <div
        className={`border border-gray-200 rounded-2xl bg-white p-4 min-h-[200px] ${className}`}
      >
        <div className="animate-pulse text-gray-400">Loading editor...</div>
      </div>
    );
  }

  const addImage = () => {
    const url = window.prompt("Enter image URL:");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const addLink = () => {
    const url = window.prompt("Enter URL:");
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="text-sm  font-semibold mb-1 text-gray-900">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="border border-gray-200 rounded bg-white">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-2 p-2 border-b border-gray-200 bg-gray-50 rounded-t-[18px]">
          {/* Text Formatting */}
          <div className="flex items-center gap-1 border-r border-gray-200 pr-2">
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBold().run()}
              disabled={!editor.can().chain().focus().toggleBold().run()}
              className={`p-2 rounded-full hover:bg-blue-100 transition-colors ${
                editor.isActive("bold")
                  ? "bg-blue-200 text-blue-700"
                  : "text-gray-700"
              }`}
              title="Bold"
            >
              <Bold className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              disabled={!editor.can().chain().focus().toggleItalic().run()}
              className={`p-2 rounded-full hover:bg-blue-100 transition-colors ${
                editor.isActive("italic")
                  ? "bg-blue-200 text-blue-700"
                  : "text-gray-700"
              }`}
              title="Italic"
            >
              <Italic className="w-4 h-4" />
            </button>
          </div>

          {/* Headings */}
          <div className="flex items-center gap-1 border-r border-gray-200 pr-2">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                if (editor) {
                  editor.chain().focus().toggleHeading({ level: 1 }).run();
                }
              }}
              disabled={!editor}
              className={`p-2 rounded-full hover:bg-blue-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                editor?.isActive("heading", { level: 1 })
                  ? "bg-blue-200 text-blue-700"
                  : "text-gray-700"
              }`}
              title="Heading 1"
            >
              <Heading1 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                if (editor) {
                  editor.chain().focus().toggleHeading({ level: 2 }).run();
                }
              }}
              disabled={!editor}
              className={`p-2 rounded-full hover:bg-blue-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                editor?.isActive("heading", { level: 2 })
                  ? "bg-blue-200 text-blue-700"
                  : "text-gray-700"
              }`}
              title="Heading 2"
            >
              <Heading2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                if (editor) {
                  editor.chain().focus().toggleHeading({ level: 3 }).run();
                }
              }}
              disabled={!editor}
              className={`p-2 rounded-full hover:bg-blue-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                editor?.isActive("heading", { level: 3 })
                  ? "bg-blue-200 text-blue-700"
                  : "text-gray-700"
              }`}
              title="Heading 3"
            >
              <Heading3 className="w-4 h-4" />
            </button>
          </div>

          {/* Lists */}
          <div className="flex items-center gap-1 border-r border-gray-200 pr-2">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                if (editor) {
                  editor.chain().focus().toggleBulletList().run();
                }
              }}
              disabled={!editor}
              className={`p-2 rounded-full hover:bg-blue-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                editor?.isActive("bulletList")
                  ? "bg-blue-200 text-blue-700"
                  : "text-gray-700"
              }`}
              title="Bullet List"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                if (editor) {
                  editor.chain().focus().toggleOrderedList().run();
                }
              }}
              disabled={!editor}
              className={`p-2 rounded-full hover:bg-blue-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                editor?.isActive("orderedList")
                  ? "bg-blue-200 text-blue-700"
                  : "text-gray-700"
              }`}
              title="Numbered List"
            >
              <AlignLeft className="w-4 h-4" />
            </button>
          </div>

          {/* Insert */}
          <div className="flex items-center gap-1 border-r border-gray-200 pr-2">
            <button
              type="button"
              onClick={addLink}
              className="p-2 rounded-full hover:bg-blue-100 transition-colors text-gray-700"
              title="Add Link"
            >
              <LinkIcon className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={addImage}
              className="p-2 rounded-full hover:bg-blue-100 transition-colors text-gray-700"
              title="Add Image"
            >
              <ImageIcon className="w-4 h-4" />
            </button>
          </div>

          {/* Undo/Redo */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().chain().focus().undo().run()}
              className="p-2 rounded-full hover:bg-blue-100 transition-colors disabled:opacity-50 text-gray-700"
              title="Undo"
            >
              <Undo className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().chain().focus().redo().run()}
              className="p-2 rounded-full hover:bg-blue-100 transition-colors disabled:opacity-50 text-gray-700"
              title="Redo"
            >
              <Redo className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Editor Content */}
        <EditorContent
          editor={editor}
          className="min-h-[200px] max-h-[400px] overflow-y-auto bg-white text-gray-900"
        />
      </div>
    </div>
  );
}
