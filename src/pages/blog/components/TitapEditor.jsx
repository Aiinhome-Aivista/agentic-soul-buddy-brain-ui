
import { useEditor, EditorContent } from "@tiptap/react";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Heading from "@tiptap/extension-heading";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Underline from "@tiptap/extension-underline";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import { useEffect } from "react";

// Custom OrderedList extension for Roman numerals
const RomanList = OrderedList.extend({
  name: "romanList",
  addAttributes() {
    return {
      ...this.parent?.(),
      type: {
        default: "i",
        parseHTML: (element) => element.getAttribute("type"),
        renderHTML: (attributes) => {
          if (!attributes.type) {
            return {};
          }
          return { type: attributes.type };
        },
      },
    };
  },
});

// Custom OrderedList extension for Alphabetical lists
const AlphaList = OrderedList.extend({
  name: "alphaList",
  addAttributes() {
    return {
      ...this.parent?.(),
      type: {
        default: "a",
        parseHTML: (element) => element.getAttribute("type"),
        renderHTML: (attributes) => {
          if (!attributes.type) {
            return {};
          }
          return { type: attributes.type };
        },
      },
    };
  },
});



export default function TiptapEditor({ formData, setFormData }) {
  const editor = useEditor({
    extensions: [
      Document,
      Paragraph,
      Text,
      Heading.configure({
        levels: [1, 2, 3],
      }),
      Bold,
      Italic,
      Underline,
      BulletList,
      OrderedList,
      RomanList,
      AlphaList,
      ListItem,
    ],
    content: formData.content_preview,
    onUpdate: ({ editor }) => {
      setFormData({
        ...formData,
        content_preview: editor.getHTML(),
      });
    },
  });

  // Text transformation functions
  const transformText = (transformType) => {
    const { from, to } = editor.state.selection;
    const text = editor.state.doc.textBetween(from, to, "");

    let transformedText = "";
    switch (transformType) {
      case "uppercase":
        transformedText = text.toUpperCase();
        break;
      case "lowercase":
        transformedText = text.toLowerCase();
        break;
      case "sentencecase":
        transformedText = text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
        break;
      default:
        transformedText = text;
    }

    editor.chain().focus().deleteSelection().insertContent(transformedText).run();
  };

  useEffect(() => {
    if (editor && formData.content_preview !== editor.getHTML()) {
      editor.commands.setContent(formData.content_preview);
    }
  }, [formData.content_preview, editor]);

  if (!editor) return null;

  const buttonClass = (active) =>
    `px-2 py-1 text-xs rounded transition ${active
      ? "bg-yellow-500 text-black"
      : "bg-slate-700 text-white hover:bg-slate-600"
    }`;

  return (
    <div className="bg-slate-700/50 border border-slate-600 rounded-lg overflow-hidden">

      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 p-2 border-b border-slate-600 bg-slate-800">

        {/* Heading Buttons */}
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



        {/* Text Formatting */}
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

        {/* List Buttons */}
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
          1,2,3
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleList("romanList", "listItem").run()}
          className={buttonClass(editor.isActive("romanList"))}
        >
          i,ii,iii
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleList("alphaList", "listItem").run()}
          className={buttonClass(editor.isActive("alphaList"))}
        >
          a,b,c
        </button>

        {/* Divider */}
        <div className="w-px bg-slate-600 mx-1"></div>

        {/* Text Case Transformations */}
        <button
          type="button"
          onClick={() => transformText("uppercase")}
          className="px-2 py-1 text-xs rounded transition bg-slate-700 text-white hover:bg-slate-600"
          title="Uppercase"
        >
          ABC
        </button>

        <button
          type="button"
          onClick={() => transformText("lowercase")}
          className="px-2 py-1 text-xs rounded transition bg-slate-700 text-white hover:bg-slate-600"
          title="Lowercase"
        >
          abc
        </button>

        <button
          type="button"
          onClick={() => transformText("sentencecase")}
          className="px-2 py-1 text-xs rounded transition bg-slate-700 text-white hover:bg-slate-600"
          title="Sentence case"
        >
          Abc
        </button>

      </div>


      {/* Editor Area */}
      <EditorContent
        editor={editor}
        className="p-4 min-h-[300px] text-white prose prose-invert max-w-none
          [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:mb-4 [&_h1]:mt-6
          [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mb-3 [&_h2]:mt-5
          [&_h3]:text-xl [&_h3]:font-bold [&_h3]:mb-2 [&_h3]:mt-4
          [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:my-4
          [&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:my-4
          [&_ol[type='i']]:list-[lower-roman]
          [&_ol[type='a']]:list-[lower-alpha]
          [&_li]:mb-1
          [&_p]:mb-3"
      />

    </div>
  );
}

