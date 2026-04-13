import { AttachMoney, Category, FitnessCenter, Groups, Inventory2, MenuBook, PendingActions, ShoppingBag, Timeline, WarningAmber } from "@mui/icons-material";
import { PieChart } from "recharts";

export const primary = "#f97316";
export const primarySoft = "rgba(249,115,22,0.12)";
export const success = "#16a34a";
export const danger = "#ef4444";
export const warning = "#f59e0b";
export const info = "#3b82f6";
export const violet = "#8b5cf6";

export const getDashboardPageBg = (isDark: boolean) =>
  isDark ? "#0b0b0b" : "#f7f8fc";

export const getCardSx = (isDark: boolean) => ({
  borderRadius: "24px",
  border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(15, 23, 42, 0.06)",
  boxShadow: isDark ? "0 16px 40px rgba(0,0,0,0.24)" : "0 10px 30px rgba(15, 23, 42, 0.06)",
  backgroundColor: isDark ? "#141414" : "#ffffff",
  color: isDark ? "#ffffff" : "#0f172a",
});

export const getSectionTitleSx = (isDark: boolean) => ({
  fontSize: 20,
  fontWeight: 800,
  color: isDark ? "#ffffff" : "#0f172a",
});

export const pageBg = "#f7f8fc";
export const cardBorder = "1px solid rgba(15, 23, 42, 0.06)";
export const cardShadow = "0 10px 30px rgba(15, 23, 42, 0.06)";






























export const recentActivities = [
  {
    title: "Khách hàng mới đăng ký",
    desc: "12 tài khoản mới trong 2 giờ gần đây.",
    time: "5 phút trước",
    icon: Groups,
    color: success,
    bg: "rgba(22,163,74,0.12)",
  },
  {
    title: "Sản phẩm gần hết hàng",
    desc: "5 sản phẩm cần nhập thêm trong hôm nay.",
    time: "18 phút trước",
    icon: WarningAmber,
    color: warning,
    bg: "rgba(245,158,11,0.12)",
  },
  {
    title: "Bài blog mới được duyệt",
    desc: "“Lịch tập gym 6 buổi cho người mới” đã được xuất bản.",
    time: "42 phút trước",
    icon: MenuBook,
    color: info,
    bg: "rgba(59,130,246,0.12)",
  },
  {
    title: "Lịch tập mới được tạo",
    desc: "Kế hoạch tăng cơ 8 tuần đã được thêm vào hệ thống.",
    time: "1 giờ trước",
    icon: FitnessCenter,
    color: primary,
    bg: "rgba(249,115,22,0.12)",
  },
];

export const contentStats = [
  { label: "Bài blog đã đăng", value: 86, icon: MenuBook },
  { label: "Kế hoạch tập luyện", value: 24, icon: FitnessCenter },
  { label: "Danh mục", value: 18, icon: Category },
  { label: "Đơn chờ xử lý", value: 37, icon: PendingActions },
];

export const reportCards = [
  {
    title: "Báo cáo doanh thu",
    desc: "Tổng hợp doanh thu, lợi nhuận và tăng trưởng theo kỳ.",
    icon: Timeline,
  },
  {
    title: "Báo cáo đơn hàng",
    desc: "Phân tích đơn theo trạng thái, kênh bán và tỷ lệ hoàn đơn.",
    icon: ShoppingBag,
  },
  {
    title: "Báo cáo tồn kho",
    desc: "Theo dõi nhập xuất tồn và nhóm sản phẩm cần chú ý.",
    icon: Inventory2,
  },
  {
    title: "Báo cáo nội dung",
    desc: "Hiệu quả blog, kế hoạch tập luyện và mức độ quan tâm của người dùng.",
    icon: PieChart,
  },
];

export const getStatusChip = (status: string) => {
  switch (status) {
    case "Completed":
    case "Delivered":
      return { color: "#166534", bg: "rgba(22,163,74,0.14)" };
    case "Shipping":
      return { color: "#6d28d9", bg: "rgba(139,92,246,0.14)" };
    case "Confirmed":
      return { color: "#1d4ed8", bg: "rgba(59,130,246,0.14)" };
    case "Pending":
      return { color: "#b45309", bg: "rgba(245,158,11,0.14)" };
    case "Cancelled":
      return { color: "#b91c1c", bg: "rgba(239,68,68,0.14)" };
    default:
      return { color: "#475569", bg: "rgba(148,163,184,0.18)" };
  }
};
