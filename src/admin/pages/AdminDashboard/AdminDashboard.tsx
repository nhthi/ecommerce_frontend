import React, { useEffect, useMemo, useState } from "react";
import { Box, Stack } from "@mui/material";
import DashboardHero from "./components/DashboardHero";
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

  return (
    <Box sx={{  }}>
      <Stack spacing={3}>
        <DashboardHero />
        <DashboardQuickFilters
          overviewFilter={overviewFilter}
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          onOverviewFilterChange={setOverviewFilter}
          onSelectedMonthChange={setSelectedMonth}
          onSelectedYearChange={setSelectedYear}
        />
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
    </Box>
  );
};

export default AdminDashboardPage;
