import React, { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import Image from "@tiptap/extension-image";
import { NodeSelection } from "@tiptap/pm/state";
import { Box } from "@mui/material";
import Toolbar from "./TiptapToolbar";

interface Props {
  content: string;
  onChange: (html: string) => void;
}

const TiptapEditor = ({ content, onChange }: Props) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        HTMLAttributes: {
          draggable: "false",
        },
        resize: {
          enabled: true,
          directions: ["top", "bottom", "left", "right"],
          minWidth: 50,
          minHeight: 50,
          alwaysPreserveAspectRatio: true,
        },
      }),
      Link,
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Placeholder.configure({
        placeholder: "Viet noi dung blog cua ban...",
        emptyEditorClass: "is-editor-empty",
      }),
    ],
    content: content || "",
    editorProps: {
      attributes: {
        class: "tiptap-editor",
      },
      handleClickOn(view, pos, node, nodePos, event, direct) {
        if (direct && node.type.name === "image") {
          const transaction = view.state.tr.setSelection(
            NodeSelection.create(view.state.doc, nodePos),
          );
          view.dispatch(transaction);
          return true;
        }
        return false;
      },
    },
    onUpdate: ({ editor }) => {
      const nextHtml = editor.getHTML();
      if (nextHtml !== (content || "")) {
        onChange(nextHtml);
      }
    },
  });

  useEffect(() => {
    if (!editor) return;

    const nextContent = content || "";
    const currentContent = editor.getHTML();

    if (currentContent !== nextContent) {
      editor.commands.setContent(nextContent, { emitUpdate: false });
    }
  }, [content, editor]);

  return (
    <Box
      sx={{
        border: "1px solid rgba(0,0,0,0.12)",
        borderRadius: "20px",
        overflow: "hidden",
        background: "#fff",
        "& .tiptap-editor": {
          minHeight: "300px",
          padding: "16px",
          outline: "none",
          cursor: "text",
          lineHeight: 1.7,
          fontSize: "16px",
        },
        "& .tiptap-editor:focus": {
          outline: "none",
        },
        "& .tiptap-editor p": {
          margin: "0 0 12px 0",
        },
        "& .tiptap-editor p:last-child": {
          marginBottom: 0,
        },
        "& .tiptap-editor p.is-editor-empty:first-child::before": {
          content: "attr(data-placeholder)",
          color: "#9ca3af",
          pointerEvents: "none",
          float: "left",
          height: 0,
        },
        "&:has(.tiptap-editor:focus)": {
          border: "1px solid #f97316",
          boxShadow: "0 0 0 3px rgba(249,115,22,0.12)",
        },
        "& [data-resize-container]": {
          display: "flex",
          justifyContent: "center",
          margin: "12px 0",
          position: "relative",
        },
        "& [data-resize-wrapper]": {
          position: "relative",
          display: "inline-block",
          maxWidth: "100%",
        },
        "& [data-resize-wrapper] img": {
          display: "block",
          maxWidth: "100%",
          height: "auto",
          borderRadius: "12px",
          pointerEvents: "none",
        },
        "& [data-resize-handle]": {
          position: "absolute",
          zIndex: 50,
        },
        "& [data-resize-handle='top']": {
          top: "-6px !important",
          left: 0,
          right: 0,
          height: "12px !important",
          cursor: "ns-resize",
        },
        "& [data-resize-handle='bottom']": {
          bottom: "-6px !important",
          left: 0,
          right: 0,
          height: "12px !important",
          cursor: "ns-resize",
        },
        "& [data-resize-handle='left']": {
          left: "-6px !important",
          top: 0,
          bottom: 0,
          width: "12px !important",
          cursor: "ew-resize",
        },
        "& [data-resize-handle='right']": {
          right: "-6px !important",
          top: 0,
          bottom: 0,
          width: "12px !important",
          cursor: "ew-resize",
        },
        "& .ProseMirror-selectednode [data-resize-wrapper]": {
          outline: "2px solid #f97316",
          outlineOffset: "2px",
        },
      }}
    >
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </Box>
  );
};

export default TiptapEditor;
