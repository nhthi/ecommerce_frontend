import React, { useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { AttachFile, ImageOutlined, SmartDisplay } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../state/Store";
import {
  createSupportConversation,
  sendMySupportMessage,
} from "../../../state/customer/supportSlice";
import { uploadToCloundinary } from "../../../utils/uploadToCloudinary";
import { useSiteThemeMode } from "../../../Theme/SiteThemeProvider";

const CreateSupportPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isDark } = useSiteThemeMode();

  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const pageBg = isDark ? "#0b0b0b" : "#f7f8fc";
  const cardBg = isDark ? "#141414" : "#ffffff";
  const softBg = isDark ? "rgba(255,255,255,0.03)" : "#ffffff";
  const border = isDark ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.08)";
  const strongText = isDark ? "#ffffff" : "#0f172a";
  const mutedText = isDark ? "#94a3b8" : "#64748b";

  const previewUrl = useMemo(() => {
    if (!attachmentFile) return "";
    return URL.createObjectURL(attachmentFile);
  }, [attachmentFile]);

  const isVideo = attachmentFile?.type?.startsWith("video/");
  const isImage = attachmentFile?.type?.startsWith("image/");

  const handleSelectFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setAttachmentFile(file);
  };

  const handleSubmit = async () => {
    if (!subject.trim() || !content.trim()) return;

    setSubmitting(true);
    setError("");

    try {
      const res: any = await dispatch(
        createSupportConversation({
          subject: subject.trim(),
          content: content.trim(),
        })
      );

      const conversationId = res?.payload?.id;
      if (!conversationId) {
        throw new Error("Không tạo được yêu cầu");
      }

      if (attachmentFile) {
        setUploading(true);
        const cloudType = attachmentFile.type.startsWith("video/") ? "video" : "image";
        const url = await uploadToCloundinary(attachmentFile, cloudType);

        await dispatch(
          sendMySupportMessage({
            conversationId,
            content: attachmentFile.name,
            messageType: attachmentFile.type.startsWith("image/") ? "IMAGE" : "FILE",
            attachmentUrl: url,
            attachmentName: attachmentFile.name,
            attachmentType: attachmentFile.type,
          })
        );
        setUploading(false);
      }

      navigate(`/support/${conversationId}`);
    } catch (err: any) {
      setError(err?.message || "Không gửi được yêu cầu hỗ trợ");
      setUploading(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ p: { xs: 1.5, md: 2.5 }, bgcolor: pageBg, minHeight: "100vh" }}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, md: 3 },
          maxWidth: 760,
          mx: "auto",
          border: `1px solid ${border}`,
          backgroundColor: cardBg,
          color: strongText,
        }}
      >
        <Typography sx={{ fontSize: { xs: 24, md: 30 }, fontWeight: 900 }}>
          Tao yeu cau ho tro
        </Typography>
        <Typography sx={{ mt: 0.7, color: mutedText, maxWidth: 620 }}>
          Mô tả vấn đề của bạn và có thể đính kèm ảnh hoặc video để đội hỗ trợ xử lý nhanh hơn.
        </Typography>

        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        {(submitting || uploading) && <Alert severity="info" sx={{ mt: 2 }}>{uploading ? "Đang tải tệp đính kèm..." : "Đang tạo cuộc trò chuyện..."}</Alert>}

        <Stack spacing={2} sx={{ mt: 2.5 }}>
          <TextField
            label="Tiêu đề"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            fullWidth
          />

          <TextField
            label="Nội dung"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            multiline
            rows={5}
            fullWidth
          />

          <Paper elevation={0} sx={{ p: 1.5, border: `1px solid ${border}`, backgroundColor: softBg }}>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.2} alignItems={{ xs: "stretch", sm: "center" }} justifyContent="space-between">
              <Box>
                <Typography fontWeight={800}>Ảnh hoặc video đính kèm</Typography>
                <Typography sx={{ color: mutedText, fontSize: 13 }}>
                  Thêm 1 tệp để minh họa vấn đề.
                </Typography>
              </Box>
              <Button component="label" variant="outlined" startIcon={<AttachFile />}>
                Chọn tệp
                <input hidden type="file" accept="image/*,video/*" onChange={handleSelectFile} />
              </Button>
            </Stack>

            {attachmentFile && (
              <Box sx={{ mt: 1.5 }}>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                  {isVideo ? <SmartDisplay sx={{ color: "#f97316" }} /> : <ImageOutlined sx={{ color: "#f97316" }} />}
                  <Typography fontWeight={700}>{attachmentFile.name}</Typography>
                  <Typography sx={{ color: mutedText, fontSize: 13 }}>
                    ({Math.round(attachmentFile.size / 1024)} KB)
                  </Typography>
                </Stack>

                {isImage && previewUrl && (
                  <Box component="img" src={previewUrl} alt="preview" sx={{ width: "100%", maxHeight: 280, objectFit: "cover", border: `1px solid ${border}` }} />
                )}

                {isVideo && previewUrl && (
                  <Box component="video" src={previewUrl} controls sx={{ width: "100%", maxHeight: 280, border: `1px solid ${border}` }} />
                )}

                <Button size="small" color="inherit" sx={{ mt: 1 }} onClick={() => setAttachmentFile(null)}>
                  Bỏ tệp đính kèm
                </Button>
              </Box>
            )}
          </Paper>

          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!subject.trim() || !content.trim() || submitting || uploading}
            sx={{ alignSelf: "flex-start", minWidth: 180 }}
          >
            {submitting || uploading ? <CircularProgress size={20} color="inherit" /> : "Gửi yêu cầu"}
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
};

export default CreateSupportPage;
