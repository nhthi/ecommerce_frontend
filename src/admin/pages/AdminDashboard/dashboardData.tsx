import {
  AttachMoney,
  Category,
  FitnessCenter,
  Groups,
  Inventory2,
  MenuBook,
  PendingActions,
  PieChart as PieChartIcon,
  ShoppingBag,
  Timeline,
  WarningAmber,
} from "@mui/icons-material";

export const pageBg = "#f7f8fc";
export const cardBorder = "1px solid rgba(15, 23, 42, 0.06)";
export const cardShadow = "0 10px 30px rgba(15, 23, 42, 0.06)";
export const primary = "#f97316";
export const primarySoft = "rgba(249,115,22,0.12)";
export const success = "#16a34a";
export const danger = "#ef4444";
export const warning = "#f59e0b";
export const info = "#3b82f6";
export const violet = "#8b5cf6";

export const dashboardStats = [
  { key: "revenue", title: "Doanh thu", value: "7.865.700đ", icon: AttachMoney, accent: success, bg: "rgba(22,163,74,0.10)" },
  { key: "orders", title: "Số đơn hàng", value: "19", icon: ShoppingBag, accent: info, bg: "rgba(59,130,246,0.10)" },
  { key: "sold", title: "Sản phẩm đã bán", value: "30", icon: Inventory2, accent: violet, bg: "rgba(139,92,246,0.10)" },
  { key: "users", title: "Số người dùng", value: "3", icon: Groups, accent: danger, bg: "rgba(239,68,68,0.10)" },
];

export const monthlyRevenueData = [
  { name: "03/11", revenue: 0 },
  { name: "06/11", revenue: 0 },
  { name: "09/11", revenue: 0 },
  { name: "12/11", revenue: 0 },
  { name: "15/11", revenue: 4200000 },
  { name: "18/11", revenue: 900000 },
  { name: "21/11", revenue: 300000 },
  { name: "24/11", revenue: 0 },
  { name: "27/11", revenue: 0 },
  { name: "01/12", revenue: 0 },
];

export const yearlyRevenueData = [
  { name: "T1", revenue: 6100000 },
  { name: "T2", revenue: 5200000 },
  { name: "T3", revenue: 6800000 },
  { name: "T4", revenue: 5900000 },
  { name: "T5", revenue: 7100000 },
  { name: "T6", revenue: 7600000 },
  { name: "T7", revenue: 6900000 },
  { name: "T8", revenue: 8200000 },
  { name: "T9", revenue: 7800000 },
  { name: "T10", revenue: 8650000 },
  { name: "T11", revenue: 7865700 },
  { name: "T12", revenue: 9050000 },
];

export const paymentMethodMonthData = [
  { name: "COD", value: 89.47, color: "#4ade80" },
  { name: "VNPAY", value: 10.53, color: "#60a5fa" },
];

export const paymentMethodYearData = [
  { name: "COD", value: 72, color: "#4ade80" },
  { name: "VNPAY", value: 18, color: "#60a5fa" },
  { name: "MOMO", value: 10, color: "#f472b6" },
];

export const topCategoriesMonth = [
  { name: "Thức ăn hạt cho chó", sales: 46.67 },
  { name: "Thức ăn hạt cho mèo", sales: 13.33 },
  { name: "Bánh thưởng", sales: 13.33 },
  { name: "Khác", sales: 26.67 },
];

export const topCategoriesYear = [
  { name: "Thức ăn hạt cho chó", sales: 38.2 },
  { name: "Thức ăn hạt cho mèo", sales: 22.4 },
  { name: "Bánh thưởng", sales: 17.8 },
  { name: "Khác", sales: 21.6 },
];

export const productSoldMonthData = [
  { name: "03/11", sold: 0 },
  { name: "09/11", sold: 0 },
  { name: "15/11", sold: 8 },
  { name: "17/11", sold: 2 },
  { name: "19/11", sold: 7 },
  { name: "24/11", sold: 8 },
  { name: "30/11", sold: 0 },
];

export const productSoldYearData = [
  { name: "T1", sold: 42 },
  { name: "T2", sold: 38 },
  { name: "T3", sold: 51 },
  { name: "T4", sold: 49 },
  { name: "T5", sold: 60 },
  { name: "T6", sold: 66 },
  { name: "T7", sold: 71 },
  { name: "T8", sold: 58 },
  { name: "T9", sold: 76 },
  { name: "T10", sold: 81 },
  { name: "T11", sold: 87 },
  { name: "T12", sold: 92 },
];

export const orderCountMonthData = [
  { name: "02/11", paid: 0, unpaid: 0 },
  { name: "10/11", paid: 0, unpaid: 0 },
  { name: "14/11", paid: 4, unpaid: 3 },
  { name: "16/11", paid: 1, unpaid: 2 },
  { name: "18/11", paid: 2, unpaid: 1 },
  { name: "22/11", paid: 1, unpaid: 4 },
  { name: "25/11", paid: 0, unpaid: 1 },
  { name: "01/12", paid: 0, unpaid: 0 },
];

export const orderCountYearData = [
  { name: "T1", paid: 44, unpaid: 12 },
  { name: "T2", paid: 38, unpaid: 11 },
  { name: "T3", paid: 52, unpaid: 15 },
  { name: "T4", paid: 49, unpaid: 14 },
  { name: "T5", paid: 61, unpaid: 17 },
  { name: "T6", paid: 68, unpaid: 19 },
  { name: "T7", paid: 73, unpaid: 18 },
  { name: "T8", paid: 59, unpaid: 13 },
  { name: "T9", paid: 79, unpaid: 22 },
  { name: "T10", paid: 82, unpaid: 20 },
  { name: "T11", paid: 88, unpaid: 24 },
  { name: "T12", paid: 94, unpaid: 25 },
];

export const topAddressMonthData = [
  { name: "Cần Thơ", value: 66.67, color: "#4ec1c1" },
  { name: "Cà Mau", value: 20, color: "#4a90e2" },
  { name: "Hồ Chí Minh", value: 13.33, color: "#ff6b9a" },
];

export const topAddressYearData = [
  { name: "Hồ Chí Minh", value: 32, color: "#ff6b9a" },
  { name: "Hà Nội", value: 24, color: "#4a90e2" },
  { name: "Cần Thơ", value: 18, color: "#4ec1c1" },
  { name: "Đà Nẵng", value: 14, color: "#fbbf24" },
  { name: "Khác", value: 12, color: "#a78bfa" },
];

export const inventoryTrend = [
  { month: "T7", inStock: 820, lowStock: 34, outStock: 12 },
  { month: "T8", inStock: 840, lowStock: 38, outStock: 11 },
  { month: "T9", inStock: 852, lowStock: 35, outStock: 10 },
  { month: "T10", inStock: 844, lowStock: 42, outStock: 15 },
  { month: "T11", inStock: 861, lowStock: 44, outStock: 13 },
  { month: "T12", inStock: 875, lowStock: 48, outStock: 9 },
];

export const blogTrend = [
  { month: "T7", posts: 6, views: 24 },
  { month: "T8", posts: 8, views: 31 },
  { month: "T9", posts: 7, views: 28 },
  { month: "T10", posts: 9, views: 39 },
  { month: "T11", posts: 11, views: 46 },
  { month: "T12", posts: 10, views: 52 },
];

export const workoutTrend = [
  { month: "T7", plans: 10, enrollments: 96 },
  { month: "T8", plans: 12, enrollments: 110 },
  { month: "T9", plans: 15, enrollments: 134 },
  { month: "T10", plans: 18, enrollments: 151 },
  { month: "T11", plans: 21, enrollments: 174 },
  { month: "T12", plans: 24, enrollments: 198 },
];

export const lowStockProducts = [
  { name: "Áo tank top nam Pro Fit", stock: 3, sku: "SKU-ATN-204" },
  { name: "Whey isolate 2lbs Vanilla", stock: 4, sku: "SKU-WHEY-891" },
  { name: "Dây kháng lực set 5 mức", stock: 5, sku: "SKU-RES-128" },
  { name: "Găng tay tập gym FlexGrip", stock: 2, sku: "SKU-GLO-018" },
  { name: "Bình nước thể thao 2L", stock: 4, sku: "SKU-BOT-672" },
];

export const recentOrders = [
  { id: "ORD-2301", customer: "Lê Minh An", amount: "1.290.000đ", status: "Pending", channel: "Website" },
  { id: "ORD-2302", customer: "Trần Gia Hân", amount: "2.480.000đ", status: "Shipping", channel: "Chatbot" },
  { id: "ORD-2303", customer: "Nguyễn Tuấn Kiệt", amount: "890.000đ", status: "Completed", channel: "Facebook" },
  { id: "ORD-2304", customer: "Phạm Bảo Ngọc", amount: "1.760.000đ", status: "Confirmed", channel: "Website" },
  { id: "ORD-2305", customer: "Hoàng Minh Đạt", amount: "3.240.000đ", status: "Pending", channel: "Website" },
  { id: "ORD-2306", customer: "Đặng Khánh Vy", amount: "540.000đ", status: "Cancelled", channel: "Chatbot" },
];

export const orderStatusData = [
  { name: "Pending", value: 28, color: "#f59e0b" },
  { name: "Confirmed", value: 22, color: "#3b82f6" },
  { name: "Shipping", value: 34, color: "#8b5cf6" },
  { name: "Completed", value: 12, color: "#16a34a" },
  { name: "Cancelled", value: 4, color: "#ef4444" },
];

export const recentActivities = [
  { title: "Khách hàng mới đăng ký", desc: "12 tài khoản mới trong 2 giờ gần đây.", time: "5 phút trước", icon: Groups, color: success, bg: "rgba(22,163,74,0.12)" },
  { title: "Sản phẩm gần hết hàng", desc: "5 sản phẩm cần nhập thêm trong hôm nay.", time: "18 phút trước", icon: WarningAmber, color: warning, bg: "rgba(245,158,11,0.12)" },
  { title: "Bài blog mới được duyệt", desc: "‘Lịch tập gym 6 buổi cho người mới’ đã publish.", time: "42 phút trước", icon: MenuBook, color: info, bg: "rgba(59,130,246,0.12)" },
  { title: "Lịch tập mới được tạo", desc: "Plan tăng cơ 8 tuần đã được thêm vào hệ thống.", time: "1 giờ trước", icon: FitnessCenter, color: primary, bg: "rgba(249,115,22,0.12)" },
];

export const contentStats = [
  { label: "Bài blog đã đăng", value: 86, icon: MenuBook },
  { label: "Workout plans", value: 24, icon: FitnessCenter },
  { label: "Danh mục", value: 18, icon: Category },
  { label: "Đơn chờ xử lý", value: 37, icon: PendingActions },
];

export const reportCards = [
  { title: "Báo cáo doanh thu", desc: "Tổng hợp doanh thu, lợi nhuận, tăng trưởng theo kỳ.", icon: Timeline },
  { title: "Báo cáo đơn hàng", desc: "Phân tích đơn theo trạng thái, kênh bán, tỷ lệ hoàn đơn.", icon: ShoppingBag },
  { title: "Báo cáo tồn kho", desc: "Theo dõi nhập xuất tồn và nhóm sản phẩm rủi ro.", icon: Inventory2 },
  { title: "Báo cáo nội dung", desc: "Hiệu quả blog, workout plan và lượt quan tâm người dùng.", icon: PieChartIcon },
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

