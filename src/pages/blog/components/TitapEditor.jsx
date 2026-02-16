import {
  useEditor,
  EditorContent,
  NodeViewWrapper,
  ReactNodeViewRenderer,
} from "@tiptap/react";
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
import TextAlign from "@tiptap/extension-text-align";
import Image from "@tiptap/extension-image";
import { useEffect, useRef } from "react";
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Image as ImageIcon,
  X,
} from "lucide-react";

// Custom Image Component with Resize and Delete
const ImageComponent = ({ node, updateAttributes, deleteNode, selected }) => {
  const { src, width, height, align } = node.attrs;

  return (
    <NodeViewWrapper
      style={{
        display: "flex",
        justifyContent:
          align === "left"
            ? "flex-start"
            : align === "right"
              ? "flex-end"
              : "center",
        width: "100%",
      }}
      className="relative group my-4"
    >
      <div className={`relative inline-block overflow-hidden rounded-lg shadow-lg border-2 transition-all ${selected ? 'border-yellow-500 ring-2 ring-yellow-500/20' : 'border-slate-700'} bg-slate-800`}>
        <img
          src={src}
          style={{
            width: width === "auto" ? "100%" : `${width}px`,
            height: height === "auto" ? "auto" : `${height}px`,
            maxWidth: width === "auto" ? "500px" : "100%",
            maxHeight: height === "auto" ? "500px" : "none",
            objectFit: "contain",
            display: "block",
          }}
          alt=""
        />

        {/* Delete Button */}
        <button
          type="button"
          onClick={deleteNode}
          className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-lg shadow-black/50 opacity-0 group-hover:opacity-100 transition-opacity z-10"
          title="Remove Image"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Dimension Controls Overlay */}
        <div
          contentEditable={false}
          className="absolute bottom-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900/90 text-white px-3 py-1.5 rounded-lg text-[10px] flex items-center gap-3 backdrop-blur-sm border border-slate-600/50 z-10 whitespace-nowrap"
        >
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">W:</span>
            <input
              type="number"
              value={width === "auto" ? "" : width}
              onChange={(e) =>
                updateAttributes({ width: e.target.value || "auto" })
              }
              onMouseDown={(e) => e.stopPropagation()}
              className="w-14 bg-slate-800 border border-slate-700 rounded px-1 py-0.5 outline-none text-center focus:border-yellow-500"
              placeholder="500"
            />
          </div>
          <div className="w-px h-3 bg-slate-700"></div>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">H:</span>
            <input
              type="number"
              value={height === "auto" ? "" : height}
              onChange={(e) =>
                updateAttributes({ height: e.target.value || "auto" })
              }
              onMouseDown={(e) => e.stopPropagation()}
              className="w-14 bg-slate-800 border border-slate-700 rounded px-1 py-0.5 outline-none text-center focus:border-yellow-500"
              placeholder="300"
            />
          </div>

          <div className="w-px h-3 bg-slate-700"></div>

          {/* Alignment Buttons */}
          <div className="flex items-center gap-1 opacity-80">
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                updateAttributes({ align: "left" });
              }}
              className={`p-1 rounded transition ${align === 'left' ? 'bg-yellow-500 text-black' : 'hover:bg-slate-700'}`}
              title="Align Left"
            >
              <AlignLeft className="w-3 h-3" />
            </button>
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                updateAttributes({ align: "center" });
              }}
              className={`p-1 rounded transition ${align === 'center' ? 'bg-yellow-500 text-black' : 'hover:bg-slate-700'}`}
              title="Align Center"
            >
              <AlignCenter className="w-3 h-3" />
            </button>
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                updateAttributes({ align: "right" });
              }}
              className={`p-1 rounded transition ${align === 'right' ? 'bg-yellow-500 text-black' : 'hover:bg-slate-700'}`}
              title="Align Right"
            >
              <AlignRight className="w-3 h-3" />
            </button>
          </div>

          <div className="w-px h-3 bg-slate-700"></div>

          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              updateAttributes({ width: "auto", height: "auto", align: "center" });
            }}
            className="text-yellow-500 hover:text-yellow-400 font-medium"
          >
            Reset
          </button>
        </div>
      </div>
    </NodeViewWrapper>
  );
};

// Extended Image extension with width/height attributes and custom node view
const CustomImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: "auto",
        parseHTML: (element) => element.getAttribute("width") || "auto",
        renderHTML: (attributes) => ({
          width: attributes.width,
        }),
      },
      height: {
        default: "auto",
        parseHTML: (element) => element.getAttribute("height") || "auto",
        renderHTML: (attributes) => ({
          height: attributes.height,
        }),
      },
      align: {
        default: "left",
        parseHTML: (element) => element.getAttribute("align") || "left",
        renderHTML: (attributes) => ({
          align: attributes.align,
        }),
      },
    };
  },
  addNodeView() {
    return ReactNodeViewRenderer(ImageComponent);
  },
});

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
  const fileInputRef = useRef(null);

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
      TextAlign.configure({
        types: ["heading", "paragraph", "image"],
        alignments: ["left", "center", "right", "justify"],
      }),
      CustomImage.configure({
        allowBase64: true,
      }),
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

  const addImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (readerEvent) => {
        const base64 = readerEvent.target.result;
        editor.chain().focus().setImage({ src: base64 }).run();
      };
      reader.readAsDataURL(file);
    }
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

        {/* Alignment Buttons */}
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className={buttonClass(editor.isActive({ textAlign: "left" }))}
          title="Align Left"
        >
          <AlignLeft className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className={buttonClass(editor.isActive({ textAlign: "center" }))}
          title="Align Center"
        >
          <AlignCenter className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          className={buttonClass(editor.isActive({ textAlign: "right" }))}
          title="Align Right"
        >
          <AlignRight className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
          className={buttonClass(editor.isActive({ textAlign: "justify" }))}
          title="Justify"
        >
          <AlignJustify className="w-4 h-4" />
        </button>

        {/* Image Upload */}
        <button
          type="button"
          onClick={() => fileInputRef.current.click()}
          className="px-2 py-1 text-xs rounded transition bg-slate-700 text-white hover:bg-slate-600"
          title="Insert Image"
        >
          <ImageIcon className="w-4 h-4" />
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={addImage}
          accept="image/*"
          className="hidden"
        />

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

