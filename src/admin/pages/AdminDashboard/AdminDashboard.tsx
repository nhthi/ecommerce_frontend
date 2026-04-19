import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  FormGroup,
  Stack,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import * as XLSX from "xlsx";
import { format } from "date-fns";

import DashboardQuickFilters from "./components/DashboardQuickFilters";
import DashboardTabPanel from "./components/DashboardTabPanel";
import DashboardTabsNav from "./components/DashboardTabsNav";
import { getDashboardPageBg, primary } from "./dashboardData";
import OverviewTab from "./tabs/OverviewTab";
import OrdersTab from "./tabs/OrdersTab";
import ProductsTab from "./tabs/ProductsTab";
import ContentTab from "./tabs/ContentTab";
import ReportsTab from "./tabs/ReportsTab";
import { useAppDispatch, useAppSelector } from "../../../state/Store";
import {
  DashboardFilter,
  fetchAdminDashboard,
  fetchDashboardContentSection,
  fetchDashboardOrderSection,
  fetchDashboardProductSection,
  setDashboardFilter,
} from "../../../state/admin/adminDashboardSlice";
import { useSiteThemeMode } from "../../../Theme/SiteThemeProvider";

const EXPORT_OPTIONS = [
  { key: "summary", label: "Thông tin báo cáo + tổng quan" },
  { key: "revenue", label: "Doanh thu" },
  { key: "payment", label: "Thanh toán" },
  { key: "orders", label: "Đơn hàng" },
  { key: "products", label: "Sản phẩm" },
  { key: "content", label: "Nội dung" },
] as const;

type ExportOptionKey = (typeof EXPORT_OPTIONS)[number]["key"];

const AdminDashboardPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    data,
    loading,
    error,
    currentFilter,
    orderSection,
    orderSectionLoading,
    orderSectionError,
    productSection,
    productSectionLoading,
    productSectionError,
    contentSection,
    contentSectionLoading,
    contentSectionError,
  } = useAppSelector((store) => store.adminDashboard);

  const { isDark } = useSiteThemeMode();

  const [overviewFilter, setOverviewFilter] = useState<"month" | "year">(
    currentFilter.filterType
  );
  const [selectedMonth, setSelectedMonth] = useState(
    String(currentFilter.month ?? new Date().getMonth() + 1).padStart(2, "0")
  );
  const [selectedYear, setSelectedYear] = useState(String(currentFilter.year));
  const [tab, setTab] = useState(0);

  const [openExportDialog, setOpenExportDialog] = useState(false);
  const [selectedExportOptions, setSelectedExportOptions] = useState<
    ExportOptionKey[]
  >(["summary", "revenue", "payment", "orders", "products", "content"]);

  useEffect(() => {
    const nextFilter: DashboardFilter = {
      filterType: overviewFilter,
      year: Number(selectedYear),
      ...(overviewFilter === "month" ? { month: Number(selectedMonth) } : {}),
    };

    dispatch(setDashboardFilter(nextFilter));
    dispatch(fetchAdminDashboard(nextFilter));
    dispatch(fetchDashboardOrderSection({ ...nextFilter, limit: 8 }));
    dispatch(fetchDashboardProductSection(nextFilter));
    dispatch(fetchDashboardContentSection(nextFilter));
  }, [dispatch, overviewFilter, selectedMonth, selectedYear]);

  const filteredOrders = useMemo(() => {
    return orderSection?.recentOrders ?? [];
  }, [orderSection]);

  const handleToggleExportOption = (key: ExportOptionKey) => {
    setSelectedExportOptions((prev) =>
      prev.includes(key)
        ? prev.filter((item) => item !== key)
        : [...prev, key]
    );
  };

  const handleSelectAllExportOptions = () => {
    setSelectedExportOptions(EXPORT_OPTIONS.map((item) => item.key));
  };

  const handleClearAllExportOptions = () => {
    setSelectedExportOptions([]);
  };

  const handleExportReport = () => {
    if (!selectedExportOptions.length) {
      alert("Vui lòng chọn ít nhất một nội dung để xuất");
      return;
    }

    const workbook = XLSX.utils.book_new();

    const reportPeriod =
      overviewFilter === "month"
        ? `Tháng ${selectedMonth}/${selectedYear}`
        : `Năm ${selectedYear}`;

    const appendSheet = (rows: Record<string, any>[], sheetName: string) => {
      const safeRows = rows.length > 0 ? rows : [{ "Không có dữ liệu": "" }];
      const worksheet = XLSX.utils.json_to_sheet(safeRows);
      XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    };

    if (selectedExportOptions.includes("summary")) {
      appendSheet(
        [
          {
            "Loại báo cáo": "Dashboard Admin",
            "Kỳ báo cáo": reportPeriod,
            "Ngày xuất": format(new Date(), "dd/MM/yyyy HH:mm:ss"),
            "Kiểu lọc": overviewFilter,
            "Tháng": overviewFilter === "month" ? selectedMonth : "",
            "Năm": selectedYear,
          },
        ],
        "ThongTinBaoCao"
      );

      appendSheet(
        data?.summary
          ? [
              {
                "Tổng doanh thu": data.summary.revenue ?? 0,
                "Tổng đơn hàng": data.summary.totalOrders ?? 0,
                "Tổng sản phẩm bán": data.summary.totalProductsSold ?? 0,
                "Tổng người dùng": data.summary.totalUsers ?? 0,
              },
            ]
          : [],
        "Summary"
      );

      appendSheet(
        (data?.topCategories ?? []).map((item: any) => ({
          "Danh mục": item.label ?? "",
          "Số lượng": item.value ?? 0,
        })),
        "TopCategoriesOverview"
      );

      appendSheet(
        (data?.topAddresses ?? []).map((item: any) => ({
          "Địa chỉ": item.label ?? "",
          "Số lượng": item.value ?? 0,
        })),
        "TopAddresses"
      );

      appendSheet(
        (data?.orderStatusChart ?? []).map((item: any) => ({
          "Ngày": item.date ?? "",
          "Đã thanh toán": item.paid ?? 0,
          "Chưa thanh toán": item.unpaid ?? 0,
        })),
        "OrderStatusChart"
      );
    }

    if (selectedExportOptions.includes("revenue")) {
      appendSheet(
        (data?.revenueChart ?? []).map((item: any) => ({
          "Mốc thời gian": item.label ?? "",
          "Doanh thu": item.value ?? 0,
        })),
        "RevenueChart"
      );

      appendSheet(
        (data?.productSoldChart ?? []).map((item: any) => ({
          "Mốc thời gian": item.label ?? "",
          "Sản phẩm đã bán": item.value ?? 0,
        })),
        "ProductSoldChart"
      );
    }

    if (selectedExportOptions.includes("payment")) {
      appendSheet(
        (data?.paymentMethodChart ?? []).map((item: any) => ({
          "Phương thức thanh toán": item.label ?? "",
          "Giá trị": item.value ?? 0,
        })),
        "PaymentMethodChart"
      );
    }

    if (selectedExportOptions.includes("orders")) {
      appendSheet(
        (orderSection?.orderStatusSummary ?? []).map((item: any) => ({
          "Trạng thái": item.label ?? "",
          "Số lượng": item.value ?? 0,
        })),
        "OrderStatusSummary"
      );

      appendSheet(
        (orderSection?.recentOrders ?? []).map((order: any) => ({
          "Mã đơn": order.orderCode ?? "",
          "Khách hàng": order.customerName ?? "",
          "Phương thức thanh toán": order.paymentMethod ?? "",
          "Số tiền": order.amount ?? 0,
          "Trạng thái": order.status ?? "",
          "Ngày đặt": order.orderDate ?? "",
        })),
        "RecentOrders"
      );
    }

    if (selectedExportOptions.includes("products")) {
      appendSheet(
        (productSection?.topCategories ?? []).map((item: any) => ({
          "Danh mục": item.label ?? "",
          "Số lượng": item.value ?? 0,
        })),
        "ProductTopCategories"
      );

      appendSheet(
        (productSection?.inventoryTrend ?? []).map((item: any) => ({
          "Mốc thời gian": item.label ?? "",
          "Còn hàng": item.inStock ?? 0,
          "Hết hàng": item.outOfStock ?? 0,
          "Sắp hết hàng": item.lowStock ?? 0,
        })),
        "InventoryTrend"
      );

      appendSheet(
        (productSection?.lowStockAlerts ?? []).map((item: any) => ({
          "Mã sản phẩm": item.productId ?? "",
          "Tên sản phẩm": item.productName ?? "",
          SKU: item.sku ?? "",
          "Số lượng": item.quantity ?? 0,
          "Danh mục": item.categoryName ?? "",
        })),
        "LowStockAlerts"
      );
    }

    if (selectedExportOptions.includes("content")) {
      appendSheet(
        contentSection?.contentSummary
          ? [
              {
                "Blog đã xuất bản":
                  contentSection.contentSummary.publishedBlogs ?? 0,
                "Lịch tập": contentSection.contentSummary.workoutPlans ?? 0,
                "Danh mục": contentSection.contentSummary.categories ?? 0,
                "Đơn chờ xử lý":
                  contentSection.contentSummary.pendingOrders ?? 0,
              },
            ]
          : [],
        "ContentSummary"
      );

      appendSheet(
        (contentSection?.blogPerformance ?? []).map((item: any) => ({
          "Nhãn": item.label ?? "",
          "Số bài viết": item.posts ?? 0,
          "Lượt xem": item.views ?? 0,
        })),
        "BlogPerformance"
      );
    }

    const fileName =
      overviewFilter === "month"
        ? `bao_cao_dashboard_${selectedMonth}_${selectedYear}.xlsx`
        : `bao_cao_dashboard_${selectedYear}.xlsx`;

    XLSX.writeFile(workbook, fileName);
    setOpenExportDialog(false);
  };

  return (
    <Box
      sx={{
        minHeight: "100%",
        background: getDashboardPageBg(isDark),
      }}
    >
      <Stack spacing={3}>

        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "stretch", md: "center" }}
          spacing={1.5}
        >
          <DashboardQuickFilters
            overviewFilter={overviewFilter}
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            onOverviewFilterChange={setOverviewFilter}
            onSelectedMonthChange={setSelectedMonth}
            onSelectedYearChange={setSelectedYear}
          />

          <Button
            variant="contained"
            onClick={() => setOpenExportDialog(true)}
            disabled={
              loading ||
              orderSectionLoading ||
              productSectionLoading ||
              contentSectionLoading
            }
            sx={{
              borderRadius: 999,
              textTransform: "none",
              px: 2.5,
              minWidth: 180,
              background: primary,
              boxShadow: "none",
              "&:hover": {
                background: primary,
                opacity: 0.92,
                boxShadow: "none",
              },
            }}
          >
            <span className="text-slate-100 flex items-center gap-2">
              <DownloadIcon fontSize="small" />
              Xuất báo cáo
            </span>
          </Button>
        </Stack>

        <DashboardTabsNav tab={tab} onChange={setTab} />

        <DashboardTabPanel value={tab} index={0}>
          <OverviewTab
            overviewFilter={overviewFilter}
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            data={data}
            loading={loading}
            error={error}
          />
        </DashboardTabPanel>

        <DashboardTabPanel value={tab} index={1}>
          <OrdersTab
            filteredOrders={filteredOrders}
            primary={primary}
            orderStatusSummary={orderSection?.orderStatusSummary ?? []}
            loading={orderSectionLoading}
            error={orderSectionError}
          />
        </DashboardTabPanel>

        <DashboardTabPanel value={tab} index={2}>
          <ProductsTab
            overviewFilter={overviewFilter}
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            data={productSection}
            loading={productSectionLoading}
            error={productSectionError}
          />
        </DashboardTabPanel>

        <DashboardTabPanel value={tab} index={3}>
          <ContentTab
            overviewFilter={overviewFilter}
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            data={contentSection}
            loading={contentSectionLoading}
            error={contentSectionError}
          />
        </DashboardTabPanel>

        <DashboardTabPanel value={tab} index={4}>
          <ReportsTab />
        </DashboardTabPanel>
      </Stack>

      <Dialog
        open={openExportDialog}
        onClose={() => setOpenExportDialog(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: "24px",
            background: isDark
              ? "linear-gradient(180deg, rgba(20,20,20,0.98), rgba(10,10,10,0.99))"
              : "linear-gradient(180deg, #ffffff, #fff7ed)",
            color: isDark ? "#fff" : "#111827",
            border: isDark
              ? "1px solid rgba(255,255,255,0.08)"
              : "1px solid rgba(15,23,42,0.08)",
            boxShadow: isDark
              ? "0 24px 60px rgba(0,0,0,0.28)"
              : "0 18px 45px rgba(15,23,42,0.08)",
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: 800,
            pb: 1,
          }}
        >
          Chọn nội dung muốn xuất
        </DialogTitle>

        <DialogContent sx={{ pt: "8px !important" }}>
          <Stack direction="row" spacing={1} sx={{ mb: 1.8, flexWrap: "wrap" }}>
            <Button
              variant="outlined"
              onClick={handleSelectAllExportOptions}
              sx={{
                borderRadius: 999,
                textTransform: "none",
              }}
            >
              Chọn tất cả
            </Button>

            <Button
              variant="outlined"
              onClick={handleClearAllExportOptions}
              sx={{
                borderRadius: 999,
                textTransform: "none",
              }}
            >
              Bỏ chọn tất cả
            </Button>
          </Stack>

          <FormGroup>
            {EXPORT_OPTIONS.map((option) => (
              <FormControlLabel
                key={option.key}
                control={
                  <Checkbox
                    checked={selectedExportOptions.includes(option.key)}
                    onChange={() => handleToggleExportOption(option.key)}
                    sx={{
                      color: "rgba(249,115,22,0.6)",
                      "&.Mui-checked": {
                        color: "#f97316",
                      },
                    }}
                  />
                }
                label={option.label}
                sx={{
                  ".MuiFormControlLabel-label": {
                    fontSize: 14.5,
                  },
                }}
              />
            ))}
          </FormGroup>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={() => setOpenExportDialog(false)}
            sx={{
              textTransform: "none",
              borderRadius: 999,
            }}
          >
            Hủy
          </Button>

          <Button
            onClick={handleExportReport}
            variant="contained"
            sx={{
              borderRadius: 999,
              textTransform: "none",
              px: 2.8,
              background: primary,
              boxShadow: "none",
              "&:hover": {
                background: primary,
                opacity: 0.92,
                boxShadow: "none",
              },
            }}
          >

            <span className="text-slate-100"><DownloadIcon /> Xuất file</span>
            
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminDashboardPage;