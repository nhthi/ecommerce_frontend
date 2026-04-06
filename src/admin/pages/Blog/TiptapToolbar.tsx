import React, { useRef, useState } from "react";
import { Box, IconButton } from "@mui/material";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import ImageIcon from "@mui/icons-material/Image";
import TitleIcon from "@mui/icons-material/Title";
import { uploadToCloundinary } from "../../../utils/uploadToCloudinary";
import CustomLoading from "../../../customer/components/CustomLoading/CustomLoading";
import { FormatUnderlined, Redo, Undo } from "@mui/icons-material";
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import FormatAlignCenterIcon from "@mui/icons-material/FormatAlignCenter";
import FormatAlignRightIcon from "@mui/icons-material/FormatAlignRight";
import FormatAlignJustifyIcon from "@mui/icons-material/FormatAlignJustify";
interface ToolbarProps {
  editor: any;
}
const iconBtnSx = (active: boolean) => ({
  color: active ? "#f97316" : "#374151",
  border: active
    ? "1px solid #f97316"
    : "1px solid rgba(0,0,0,0.08)",
  borderRadius: "10px",
  mx: 0.3,
  backgroundColor: active ? "rgba(249,115,22,0.15)" : "transparent",
  "&:hover": {
    backgroundColor: active
      ? "rgba(249,115,22,0.25)"
      : "rgba(0,0,0,0.05)",
  },
});
const Toolbar = ({ editor }: ToolbarProps) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const savedSelection = useRef<any>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  if (!editor) return null;

  const handleInsertImage = () => {
    savedSelection.current = editor.state.selection;
    fileRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);

      const imageUrl = await uploadToCloundinary(file, "image");
      if (!imageUrl) return;

      if (savedSelection.current) {
        editor.view.dispatch(
          editor.state.tr.setSelection(savedSelection.current)
        );
      }

      editor.chain().focus().setImage({ src: imageUrl }).run();
    } catch (error) {
      console.error("Upload image failed:", error);
    } finally {
      setUploadingImage(false);
      event.target.value = "";
    }
  };

  return (
    <Box
      sx={{
        borderBottom: "1px solid rgba(0,0,0,0.1)",
        p: 1,
        background: "#f9fafb",
        display: "flex",
        flexWrap: "wrap",
      }}
    >
      {uploadingImage && <CustomLoading message="Đang xử lý..." />}

      {/* BOLD */}
      <IconButton
        sx={iconBtnSx(editor.isActive("bold"))}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <FormatBoldIcon />
      </IconButton>

      {/* ITALIC */}
      <IconButton
        sx={iconBtnSx(editor.isActive("italic"))}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <FormatItalicIcon />
      </IconButton>

      {/* UNDERLINE */}
      <IconButton
        sx={iconBtnSx(editor.isActive("underline"))}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <FormatUnderlined />
      </IconButton>

      {/* LIST */}
      <IconButton
        sx={iconBtnSx(editor.isActive("bulletList"))}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <FormatListBulletedIcon />
      </IconButton>

      {/* H1 */}
      <IconButton
        sx={iconBtnSx(editor.isActive("heading", { level: 1 }))}
        onClick={() =>
          editor.chain().focus().toggleHeading({ level: 1 }).run()
        }
      >
        H1
      </IconButton>

      {/* H2 */}
      <IconButton
        sx={iconBtnSx(editor.isActive("heading", { level: 2 }))}
        onClick={() =>
          editor.chain().focus().toggleHeading({ level: 2 }).run()
        }
      >
        H2
      </IconButton>

      {/* H3 */}
      <IconButton
        sx={iconBtnSx(editor.isActive("heading", { level: 3 }))}
        onClick={() =>
          editor.chain().focus().toggleHeading({ level: 3 }).run()
        }
      >
        H3
      </IconButton>

      {/* IMAGE */}
      <IconButton  onClick={handleInsertImage}>
        <ImageIcon />
      </IconButton>
<IconButton
  sx={iconBtnSx(editor.isActive({ textAlign: "left" }))}
  onClick={() => editor.chain().focus().setTextAlign("left").run()}
>
  <FormatAlignLeftIcon />
</IconButton>

<IconButton
  sx={iconBtnSx(editor.isActive({ textAlign: "center" }))}
  onClick={() => editor.chain().focus().setTextAlign("center").run()}
>
  <FormatAlignCenterIcon />
</IconButton>

<IconButton
  sx={iconBtnSx(editor.isActive({ textAlign: "right" }))}
  onClick={() => editor.chain().focus().setTextAlign("right").run()}
>
  <FormatAlignRightIcon />
</IconButton>

<IconButton
  sx={iconBtnSx(editor.isActive({ textAlign: "justify" }))}
  onClick={() => editor.chain().focus().setTextAlign("justify").run()}
>
  <FormatAlignJustifyIcon />
</IconButton>
      {/* UNDO */}
      <IconButton
        
        onClick={() => editor.chain().focus().undo().run()}
      >
        <Undo />
      </IconButton>

      {/* REDO */}
      <IconButton
        
        onClick={() => editor.chain().focus().redo().run()}
      >
        <Redo/>
      </IconButton>

      <input
        type="file"
        hidden
        ref={fileRef}
        accept="image/*"
        onChange={handleFileChange}
      />
    </Box>
  );
};
export default Toolbar;