"use client";

import { useEditor, EditorContent, Extension } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import Heading from "@tiptap/extension-heading";
import { TextAlign } from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import { 
  Bold, Italic, Underline as UnderlineIcon, 
  List, ListOrdered, Image as ImageIcon, 
  Link as LinkIcon, Heading1, Heading2, 
  Undo, Redo, Quote, AlignLeft, AlignCenter, 
  AlignRight, AlignJustify, Type, Code, Sparkles,
  Indent as IndentIcon, Outdent as OutdentIcon,
  Baseline, Palette, Maximize, GripHorizontal,
  Subscript as SubscriptIcon, Superscript as SuperscriptIcon
} from "lucide-react";
import { useRef, useState, useEffect } from "react";
import CodeBlock from "@tiptap/extension-code-block";
import { NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react";

// --- Custom Extensions ---

// Custom CodeBlock Extension with Toggleable Icon
const CustomCodeBlock = CodeBlock.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      withIcon: {
        default: false,
        parseHTML: element => element.classList.contains('with-icon'),
        renderHTML: attributes => {
          if (!attributes.withIcon) return {};
          return { class: 'with-icon' };
        },
      },
    }
  },
});

// Custom Font Family Extension
const CustomFontFamily = Extension.create({
  name: 'customFontFamily',
  addGlobalAttributes() {
    return [{
      types: ['textStyle', 'paragraph', 'heading'],
      attributes: {
        fontFamily: {
          default: null,
          parseHTML: element => element.style.fontFamily.replace(/['"]+/g, ''),
          renderHTML: attributes => {
            if (!attributes.fontFamily) return {};
            return { style: `font-family: ${attributes.fontFamily}` };
          },
        },
      },
    }]
  },
  addCommands() {
    return {
      setCustomFontFamily: (fontFamily: string) => ({ chain }: any) => {
        return chain().setMark('textStyle', { fontFamily }).run();
      },
      unsetCustomFontFamily: () => ({ chain }: any) => {
        return chain().setMark('textStyle', { fontFamily: null }).removeEmptyTextStyle().run();
      },
    } as any
  },
});

// Line Height Extension
const LineHeight = Extension.create({
  name: 'lineHeight',
  addGlobalAttributes() {
    return [{
      types: ['paragraph', 'heading', 'list'],
      attributes: {
        lineHeight: {
          default: null,
          parseHTML: element => element.style.lineHeight,
          renderHTML: attributes => {
            if (!attributes.lineHeight) return {};
            return { style: `line-height: ${attributes.lineHeight}` };
          },
        },
      },
    }]
  },
  addCommands() {
    return {
      setLineHeight: (lineHeight: string) => ({ chain }: any) => {
        return chain().updateAttributes('paragraph', { lineHeight }).run();
      },
    } as any
  },
});

// Indent Extension
const Indent = Extension.create({
  name: 'indent',
  addGlobalAttributes() {
    return [{
      types: ['paragraph', 'heading', 'blockquote', 'list'],
      attributes: {
        indent: {
          default: 0,
          parseHTML: element => parseInt(element.style.paddingLeft) / 24 || 0,
          renderHTML: attributes => {
            if (!attributes.indent) return {};
            return { style: `padding-left: ${attributes.indent * 24}px` };
          },
        },
      },
    }]
  },
  addCommands() {
    return {
      indent: () => ({ tr, state, dispatch, chain }: any) => {
        const { selection } = state;
        tr.doc.nodesBetween(selection.from, selection.to, (node: any, pos: number) => {
          if (node.type.isBlock) {
            const indent = (node.attrs.indent || 0) + 1;
            tr.setNodeMarkup(pos, undefined, { ...node.attrs, indent });
          }
        });
        if (dispatch) dispatch(tr);
        return true;
      },
      outdent: () => ({ tr, state, dispatch, chain }: any) => {
        const { selection } = state;
        tr.doc.nodesBetween(selection.from, selection.to, (node: any, pos: number) => {
          if (node.type.isBlock) {
            const indent = Math.max(0, (node.attrs.indent || 0) - 1);
            tr.setNodeMarkup(pos, undefined, { ...node.attrs, indent });
          }
        });
        if (dispatch) dispatch(tr);
        return true;
      },
    } as any
  },
});

// Custom Color Extension
const CustomColor = Extension.create({
  name: 'customColor',
  addGlobalAttributes() {
    return [{
      types: ['textStyle'],
      attributes: {
        color: {
          default: null,
          parseHTML: element => element.style.color,
          renderHTML: attributes => {
            if (!attributes.color) return {};
            return { style: `color: ${attributes.color}` };
          },
        },
      },
    }]
  },
  addCommands() {
    return {
      setCustomColor: (color: string) => ({ chain }: any) => {
        return chain().setMark('textStyle', { color }).run();
      },
      unsetCustomColor: () => ({ chain }: any) => {
        return chain().setMark('textStyle', { color: null }).removeEmptyTextStyle().run();
      },
    } as any
  },
});

// Resizable Image Component
const ResizableImageComponent = ({ node, updateAttributes, selected }: any) => {
  const [resizing, setResizing] = useState(false);
  const [width, setWidth] = useState(node.attrs.width || "100%");
  const containerRef = useRef<HTMLDivElement>(null);

  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setResizing(true);
    
    const startX = e.clientX;
    const startWidth = containerRef.current?.offsetWidth || 0;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const newWidth = Math.max(50, startWidth + deltaX);
      setWidth(`${newWidth}px`);
    };

    const onMouseUp = () => {
      setResizing(false);
      updateAttributes({ width: `${containerRef.current?.offsetWidth}px` });
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  const isLeft = node.attrs.align === 'left';
  const isRight = node.attrs.align === 'right';

  return (
    <NodeViewWrapper 
      ref={containerRef}
      className={`relative inline-block transition-all ${selected ? 'ring-2 ring-primary ring-offset-2 ring-offset-background rounded-lg' : ''}`} 
      style={{ 
        width, 
        display: 'block', 
        marginLeft: isLeft ? '0' : 'auto',
        marginRight: isRight ? '0' : 'auto',
      }}
    >
      <img
        src={node.attrs.src}
        alt={node.attrs.alt}
        className="w-full h-auto rounded-lg"
      />
      {selected && (
        <>
          {/* Alignment Toolbar */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-black/80 backdrop-blur-md p-1 rounded-lg shadow-xl border border-white/20 z-10 transition-all scale-100 opacity-100">
            <button
              onClick={() => updateAttributes({ align: 'left' })}
              className={`p-1.5 rounded-md hover:bg-white/10 transition-colors ${node.attrs.align === 'left' ? 'text-primary' : 'text-white'}`}
              title="Align Left"
            >
              <AlignLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => updateAttributes({ align: 'center' })}
              className={`p-1.5 rounded-md hover:bg-white/10 transition-colors ${(!node.attrs.align || node.attrs.align === 'center') ? 'text-primary' : 'text-white'}`}
              title="Align Center"
            >
              <AlignCenter className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => updateAttributes({ align: 'right' })}
              className={`p-1.5 rounded-md hover:bg-white/10 transition-colors ${node.attrs.align === 'right' ? 'text-primary' : 'text-white'}`}
              title="Align Right"
            >
              <AlignRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div
            onMouseDown={onMouseDown}
            className="absolute bottom-1 right-1 w-6 h-6 bg-primary text-white flex items-center justify-center rounded-md cursor-nwse-resize shadow-lg z-10 hover:scale-110 transition-transform"
          >
            <GripHorizontal className="w-4 h-4 rotate-45" />
          </div>
        </>
      )}
      {resizing && (
        <div className="absolute top-2 left-2 bg-black/70 text-white text-[10px] px-2 py-1 rounded backdrop-blur-md">
          {Math.round(containerRef.current?.offsetWidth || 0)}px
        </div>
      )}
    </NodeViewWrapper>
  );
};

// Resizable Image Extension
const ResizableImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: '100%',
        parseHTML: element => element.getAttribute('width'),
        renderHTML: attributes => ({ width: attributes.width }),
      },
      align: {
        default: 'center',
        parseHTML: element => element.style.marginLeft === '0px' ? 'left' : (element.style.marginRight === '0px' ? 'right' : 'center'),
        renderHTML: attributes => {
          const styles: any = {
            left: 'display: block; margin-left: 0; margin-right: auto;',
            center: 'display: block; margin-left: auto; margin-right: auto;',
            right: 'display: block; margin-left: auto; margin-right: 0;',
          };
          return { style: styles[attributes.align || 'center'] };
        },
      },
    };
  },
  addNodeView() {
    return ReactNodeViewRenderer(ResizableImageComponent);
  },
});

// Custom Font Size Extension
const FontSize = Extension.create({
  name: 'fontSize',
  addOptions() {
    return {
      types: ['textStyle'],
    }
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            parseHTML: element => element.style.fontSize.replace(/['"]+/g, ''),
            renderHTML: attributes => {
              if (!attributes.fontSize) {
                return {}
              }
              return {
                style: `font-size: ${attributes.fontSize}`,
              }
            },
          },
        },
      },
    ]
  },
  addCommands() {
    return {
      setFontSize: (fontSize: string) => ({ chain }: any) => {
        return chain()
          .setMark('textStyle', { fontSize })
          .run()
      },
      unsetFontSize: () => ({ chain }: any) => {
        return chain()
          .setMark('textStyle', { fontSize: null })
          .removeEmptyTextStyle()
          .run()
      },
    } as any
  },
});

interface EditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: string;
}

const MenuBar = ({ editor }: { editor: any }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!editor) return null;

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        
        // Kompresi gambar via Canvas
        const img = new window.Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;
          
          const MAX_WIDTH = 800;
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }
          
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            // Compress as JPEG 70% quality
            const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.7);
            editor.chain().focus().setImage({ src: compressedDataUrl }).run();
          } else {
            // Fallback if canvas fails
            editor.chain().focus().setImage({ src: result }).run();
          }
        };
        img.src = result;
      };
      reader.readAsDataURL(file);
    }
  };

  const addImage = () => {
    // Show a small choice or just trigger file input
    fileInputRef.current?.click();
  };

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("Masukkan URL Link:", previousUrl);
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const fontSizes = ["12px", "14px", "16px", "18px", "20px", "24px", "32px", "48px"];
  const fontFamilies = [
    { label: "Default", value: "inherit" },
    { label: "Sans", value: "ui-sans-serif, system-ui, sans-serif" },
    { label: "Serif", value: "ui-serif, Georgia, Cambria, Times New Roman, Times, serif" },
    { label: "Mono", value: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace" },
  ];
  const lineHeights = ["1", "1.2", "1.5", "1.8", "2"];
  const colors = [
    { label: "Default", value: "inherit" },
    { label: "Blue", value: "#3b82f6" },
    { label: "Green", value: "#10b981" },
    { label: "Yellow", value: "#f59e0b" },
    { label: "Red", value: "#ef4444" },
    { label: "Purple", value: "#8b5cf6" },
    { label: "White", value: "#ffffff" },
  ];

  return (
    <div className="flex flex-wrap gap-1 p-2 border-b border-border/50 bg-secondary/30 sticky top-0 z-20">
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileUpload} 
        accept="image/*" 
        className="hidden" 
      />
      
      {/* Basic Marks */}
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-2 rounded hover:bg-secondary ${editor.isActive("bold") ? "text-primary bg-primary/10" : "text-muted-foreground"}`}
        title="Bold"
      >
        <Bold className="h-4 w-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-2 rounded hover:bg-secondary ${editor.isActive("italic") ? "text-primary bg-primary/10" : "text-muted-foreground"}`}
        title="Italic"
      >
        <Italic className="h-4 w-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={`p-2 rounded hover:bg-secondary ${editor.isActive("underline") ? "text-primary bg-primary/10" : "text-muted-foreground"}`}
        title="Underline"
      >
        <UnderlineIcon className="h-4 w-4" />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleSubscript().run()}
        className={`p-2 rounded hover:bg-secondary ${editor.isActive("subscript") ? "text-primary bg-primary/10" : "text-muted-foreground"}`}
        title="Subscript (H₂O)"
      >
        <SubscriptIcon className="h-4 w-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleSuperscript().run()}
        className={`p-2 rounded hover:bg-secondary ${editor.isActive("superscript") ? "text-primary bg-primary/10" : "text-muted-foreground"}`}
        title="Superscript (x²)"
      >
        <SuperscriptIcon className="h-4 w-4" />
      </button>
      
      <div className="w-px h-6 bg-secondary mx-1 self-center" />

      {/* Font Family Dropdown */}
      <div className="relative group flex items-center">
        <select
          onChange={(e) => editor.chain().focus().setMark('textStyle', { fontFamily: e.target.value }).run()}
          className="bg-transparent text-[10px] font-bold text-muted-foreground outline-none cursor-pointer p-2 hover:text-primary transition-colors max-w-[80px]"
        >
          {fontFamilies.map(f => (
            <option key={f.value} value={f.value} className="bg-slate-900 text-foreground">{f.label}</option>
          ))}
        </select>
      </div>

      <div className="w-px h-6 bg-secondary mx-1 self-center" />

      {/* Font Size Dropdown */}
      <div className="relative group flex items-center">
        <select
          onChange={(e) => editor.chain().focus().setMark('textStyle', { fontSize: e.target.value }).run()}
          className="bg-transparent text-xs font-bold text-muted-foreground outline-none cursor-pointer p-2 hover:text-primary transition-colors"
          defaultValue="16px"
        >
          {fontSizes.map(size => (
            <option key={size} value={size} className="bg-slate-900 text-foreground">{size}</option>
          ))}
        </select>
        <Type className="h-3 w-3 text-muted-foreground/50 ml-[-4px]" />
      </div>

      <div className="w-px h-6 bg-secondary mx-1 self-center" />

      {/* Font Color Dropdown */}
      <div className="relative group flex items-center">
        <Palette className="h-3 w-3 text-muted-foreground/50 mr-1" />
        <select
          onChange={(e) => editor.chain().focus().setMark('textStyle', { color: e.target.value }).run()}
          className="bg-transparent text-[10px] font-bold text-muted-foreground outline-none cursor-pointer p-2 hover:text-primary transition-colors max-w-[80px]"
        >
          {colors.map(c => (
            <option key={c.value} value={c.value} style={{ color: c.value !== 'inherit' ? c.value : 'inherit' }} className="bg-slate-900">{c.label}</option>
          ))}
        </select>
      </div>

      <div className="w-px h-6 bg-secondary mx-1 self-center" />

      {/* Alignments */}
      <button
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        className={`p-2 rounded hover:bg-secondary ${editor.isActive({ textAlign: 'left' }) ? "text-primary bg-primary/10" : "text-muted-foreground"}`}
        title="Align Left"
      >
        <AlignLeft className="h-4 w-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        className={`p-2 rounded hover:bg-secondary ${editor.isActive({ textAlign: 'center' }) ? "text-primary bg-primary/10" : "text-muted-foreground"}`}
        title="Align Center"
      >
        <AlignCenter className="h-4 w-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        className={`p-2 rounded hover:bg-secondary ${editor.isActive({ textAlign: 'right' }) ? "text-primary bg-primary/10" : "text-muted-foreground"}`}
        title="Align Right"
      >
        <AlignRight className="h-4 w-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign('justify').run()}
        className={`p-2 rounded hover:bg-secondary ${editor.isActive({ textAlign: 'justify' }) ? "text-primary bg-primary/10" : "text-muted-foreground"}`}
        title="Align Justify"
      >
        <AlignJustify className="h-4 w-4" />
      </button>

      <div className="w-px h-6 bg-secondary mx-1 self-center" />

      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`p-2 rounded hover:bg-secondary ${editor.isActive("heading", { level: 1 }) ? "text-primary bg-primary/10" : "text-muted-foreground"}`}
        title="H1"
      >
        <Heading1 className="h-4 w-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`p-2 rounded hover:bg-secondary ${editor.isActive("heading", { level: 2 }) ? "text-primary bg-primary/10" : "text-muted-foreground"}`}
        title="H2"
      >
        <Heading2 className="h-4 w-4" />
      </button>

      <div className="w-px h-6 bg-secondary mx-1 self-center" />

      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-2 rounded hover:bg-secondary ${editor.isActive("bulletList") ? "text-primary bg-primary/10" : "text-muted-foreground"}`}
      >
        <List className="h-4 w-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`p-2 rounded hover:bg-secondary ${editor.isActive("orderedList") ? "text-primary bg-primary/10" : "text-muted-foreground"}`}
      >
        <ListOrdered className="h-4 w-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`p-2 rounded hover:bg-secondary ${editor.isActive("blockquote") ? "text-primary bg-primary/10" : "text-muted-foreground"}`}
      >
        <Quote className="h-4 w-4" />
      </button>

      {/* Line Height & Indentation */}
      <div className="w-px h-6 bg-secondary mx-1 self-center" />
      
      <div className="relative group flex items-center">
        <Baseline className="h-3 w-3 text-muted-foreground/50 mr-1" />
        <select
          onChange={(e) => editor.chain().focus().updateAttributes('paragraph', { lineHeight: e.target.value }).updateAttributes('heading', { lineHeight: e.target.value }).run()}
          className="bg-transparent text-[10px] font-bold text-muted-foreground outline-none cursor-pointer p-2 hover:text-primary transition-colors"
          defaultValue="1.5"
        >
          {lineHeights.map(lh => (
            <option key={lh} value={lh} className="bg-slate-900 text-foreground">{lh}</option>
          ))}
        </select>
      </div>

      <button
        onClick={() => {
          if (editor.can().indent()) {
            editor.chain().focus().indent().run();
          }
        }}
        className="p-2 rounded hover:bg-secondary text-muted-foreground"
        title="Tambah Tabulasi"
      >
        <IndentIcon className="h-4 w-4" />
      </button>
      <button
        onClick={() => {
          if (editor.can().outdent()) {
            editor.chain().focus().outdent().run();
          }
        }}
        className="p-2 rounded hover:bg-secondary text-muted-foreground"
        title="Kurangi Tabulasi"
      >
        <OutdentIcon className="h-4 w-4" />
      </button>

      <div className="w-px h-6 bg-secondary mx-1 self-center" />

      <button onClick={addImage} className="p-2 rounded hover:bg-secondary text-muted-foreground" title="Upload Image">
        <ImageIcon className="h-4 w-4" />
      </button>

      <button
        onClick={setLink}
        className={`p-2 rounded hover:bg-secondary ${editor.isActive("link") ? "text-primary bg-primary/10" : "text-muted-foreground"}`}
        title="Set Link"
      >
        <LinkIcon className="h-4 w-4" />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={`p-2 rounded hover:bg-secondary ${editor.isActive("codeBlock") ? "text-primary bg-primary/10" : "text-muted-foreground"}`}
        title="Tambah Kartu Materi (Info Card)"
      >
        <Code className="h-4 w-4" />
      </button>

      {/* Toggle Icon Button - Only show if in Code Block */}
      {editor.isActive("codeBlock") && (
        <button
          onClick={() => {
            const currentWithIcon = editor.getAttributes("codeBlock").withIcon;
            editor.chain().focus().updateAttributes("codeBlock", { withIcon: !currentWithIcon }).run();
          }}
          className={`p-2 rounded hover:bg-secondary ${editor.getAttributes("codeBlock").withIcon ? "text-accent bg-accent/10" : "text-muted-foreground"}`}
          title="Toggle Ikon Sains (Glass Card)"
        >
          <Sparkles className="h-4 w-4" />
        </button>
      )}

      <div className="flex-grow" />

      <button onClick={() => editor.chain().focus().undo().run()} className="p-2 rounded hover:bg-secondary text-muted-foreground">
        <Undo className="h-4 w-4" />
      </button>
      <button onClick={() => editor.chain().focus().redo().run()} className="p-2 rounded hover:bg-secondary text-muted-foreground">
        <Redo className="h-4 w-4" />
      </button>
    </div>
  );
};

export default function Editor({ content, onChange, placeholder, minHeight = "400px" }: EditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: false, 
        codeBlock: false,
      }),
      CustomCodeBlock,
      CustomFontFamily,
      CustomColor,
      ResizableImage,
      LineHeight,
      Indent,
      Subscript,
      Superscript,
      Heading.configure({
        levels: [1, 2, 3],
      }),
      Underline,
      Link.configure({
        openOnClick: false,
      }),
      ResizableImage.configure({
        HTMLAttributes: {
          class: 'rounded-2xl max-w-full h-auto border border-border shadow-2xl my-8 mx-auto block',
        },
      }),
      Placeholder.configure({
        placeholder: placeholder || "Tulis materi sains yang luar biasa di sini...",
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      TextStyle,
      FontSize,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: `prose prose-invert max-w-none focus:outline-none p-4 md:p-8 text-muted-foreground/90 leading-relaxed font-sans`,
        style: `min-height: ${minHeight}`,
      },
    },
  });

  return (
    <div className="border border-border/50 rounded-[2rem] overflow-hidden glass focus-within:border-primary/50 transition-all bg-[#0a0f18]">
      <MenuBar editor={editor} />
      <div className="bg-transparent">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
