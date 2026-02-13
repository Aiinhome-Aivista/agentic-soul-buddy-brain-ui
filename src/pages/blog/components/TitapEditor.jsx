 
 import { useEditor, EditorContent } from "@tiptap/react";
 import StarterKit from "@tiptap/starter-kit";
 import Underline from "@tiptap/extension-underline";
 
 
 export default function TiptapEditor({ formData, setFormData }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
    ],
    content: formData.content_preview,
    onUpdate: ({ editor }) => {
      setFormData({
        ...formData,
        content_preview: editor.getHTML(),
      });
    },
  });

  if (!editor) return null;

  const buttonClass = (active) =>
    `px-2 py-1 text-xs rounded transition ${
      active
        ? "bg-yellow-500 text-black"
        : "bg-slate-700 text-white hover:bg-slate-600"
    }`;

  return (
    <div className="bg-slate-700/50 border border-slate-600 rounded-lg overflow-hidden">
      
      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 p-2 border-b border-slate-600 bg-slate-800">

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={buttonClass(editor.isActive("heading", { level: 1 }))}
        >
          H1
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={buttonClass(editor.isActive("heading", { level: 2 }))}
        >
          H2
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={buttonClass(editor.isActive("heading", { level: 3 }))}
        >
          H3
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={buttonClass(editor.isActive("bold"))}
        >
          Bold
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={buttonClass(editor.isActive("italic"))}
        >
          Italic
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={buttonClass(editor.isActive("underline"))}
        >
          Underline
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={buttonClass(editor.isActive("bulletList"))}
        >
          Bullet
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={buttonClass(editor.isActive("orderedList"))}
        >
          Number
        </button>

      </div>

      {/* Editor Area */}
      <EditorContent
        editor={editor}
        className="p-4 min-h-[300px] text-white"
      />
    </div>
  );
}

