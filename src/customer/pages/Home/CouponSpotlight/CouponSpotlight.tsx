import React, { useMemo, useState } from "react";
import { Button, Chip } from "@mui/material";
import DiscountIcon from "@mui/icons-material/Discount";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckIcon from "@mui/icons-material/Check";
import { useNavigate } from "react-router-dom";
import { Coupon } from "../../../../types/CouponType";
import { useSiteThemeMode } from "../../../../Theme/SiteThemeProvider";

const formatCurrency = (value?: number) => {
  if (!value || value <= 0) return "Khong yeu cau";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);
};

const formatDate = (value?: string | null) => {
  if (!value) return "Chua cap nhat";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
};

const isCouponActiveNow = (coupon: Coupon, now: number) => {
  if (coupon.active === false) return false;

  const start = coupon.validityStartDate
    ? new Date(coupon.validityStartDate).getTime()
    : Number.NEGATIVE_INFINITY;
  const end = coupon.validityEndDate
    ? new Date(coupon.validityEndDate).getTime()
    : Number.POSITIVE_INFINITY;

  return start <= now && now <= end;
};

const isCouponUpcoming = (coupon: Coupon, now: number) => {
  if (coupon.active === false || !coupon.validityStartDate) return false;
  const start = new Date(coupon.validityStartDate).getTime();
  return !Number.isNaN(start) && start > now;
};

const CouponRowCard = ({
  coupon,
  badge,
  badgeColor,
}: {
  coupon: Coupon;
  badge: string;
  badgeColor: string;
}) => {
  const { isDark } = useSiteThemeMode();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(coupon.code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch (error) {
      setCopied(false);
    }
  };

  return (
    <div
      className={
        isDark
          ? "flex flex-col gap-4 rounded-[1.35rem] border border-orange-500/15 bg-[#121212] p-4 md:flex-row md:items-center"
          : "flex flex-col gap-4 rounded-[1.35rem] border border-slate-200 bg-white p-4 shadow-[0_14px_34px_rgba(15,23,42,0.06)] md:flex-row md:items-center"
      }
    >
      <div className="flex items-center gap-3 md:min-w-[220px]">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-orange-500 text-black">
          <DiscountIcon />
        </div>
        <div>
          <Chip
            label={badge}
            size="small"
            sx={{
              mb: 1,
              backgroundColor: badgeColor,
              color: "#050505",
              fontWeight: 800,
            }}
          />
          <h3
            className={
              isDark
                ? "text-xl font-black text-white"
                : "text-xl font-black text-slate-900"
            }
          >
            {coupon.code}
          </h3>
        </div>
      </div>

      <div className="grid flex-1 gap-3 md:grid-cols-[1.1fr_1fr_1fr_auto] md:items-center">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-orange-400">
            Uu dai
          </p>
          <p className={isDark ? "mt-1 text-sm text-slate-200" : "mt-1 text-sm text-slate-700"}>
            Giam {coupon.discountPercentage}%
            {coupon.name ? ` / ${coupon.name}` : ""}
          </p>
        </div>

        <div className="flex items-start gap-2">
          <AccessTimeIcon sx={{ fontSize: 18, color: "#fb923c", marginTop: "2px" }} />
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-orange-400">
              Thoi gian
            </p>
            <p className={isDark ? "mt-1 text-sm text-slate-200" : "mt-1 text-sm text-slate-700"}>
              {formatDate(coupon.validityStartDate)} - {formatDate(coupon.validityEndDate)}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <ShoppingBagOutlinedIcon sx={{ fontSize: 18, color: "#fb923c", marginTop: "2px" }} />
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-orange-400">
              Don toi thieu
            </p>
            <p className={isDark ? "mt-1 text-sm text-slate-200" : "mt-1 text-sm text-slate-700"}>
              {formatCurrency(coupon.minimumOrderValue)}
            </p>
          </div>
        </div>

        <div className="md:justify-self-end">
          <Button
            variant={copied ? "contained" : "outlined"}
            size="small"
            startIcon={copied ? <CheckIcon /> : <ContentCopyIcon />}
            onClick={handleCopy}
            sx={{
              minWidth: 132,
              borderRadius: "999px",
              textTransform: "none",
              fontWeight: 700,
              borderColor: "#f97316",
              color: copied ? "#050505" : isDark ? "#fb923c" : "#ea580c",
              backgroundColor: copied ? "#f97316" : "transparent",
              "&:hover": {
                borderColor: "#fb923c",
                backgroundColor: copied ? "#fb923c" : "rgba(249,115,22,0.08)",
              },
            }}
          >
            {copied ? "Da sao chep" : "Sao chep"}
          </Button>
        </div>
      </div>
    </div>
  );
};

const CouponSpotlight = ({ coupons, loading }: { coupons: Coupon[]; loading: boolean }) => {
  const navigate = useNavigate();
  const { isDark } = useSiteThemeMode();

  const { visibleCoupons } = useMemo(() => {
    const now = Date.now();

    const sorted = [...coupons].sort((a, b) => {
      const aStart = a.validityStartDate ? new Date(a.validityStartDate).getTime() : 0;
      const bStart = b.validityStartDate ? new Date(b.validityStartDate).getTime() : 0;
      return aStart - bStart;
    });

    const activeCoupons = sorted
      .filter((coupon) => isCouponActiveNow(coupon, now))
      .map((coupon) => ({ coupon, badge: "Dang ap dung", badgeColor: "#f97316" }));

    const upcomingCoupons = sorted
      .filter((coupon) => isCouponUpcoming(coupon, now))
      .map((coupon) => ({ coupon, badge: "Sap mo", badgeColor: "#fdba74" }));

    return {
      visibleCoupons: [...activeCoupons, ...upcomingCoupons].slice(0, 6),
    };
  }, [coupons]);

  if (!loading && visibleCoupons.length === 0) {
    return null;
  }

  return (
    <section className={isDark ? "bg-[#0d0d0d] px-5 py-14 lg:px-16" : "bg-white px-5 py-14 lg:px-16"}>
      <div className="mx-auto max-w-[1280px]">
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-orange-400">
              Coupon dang co
            </p>
            <h2 className={isDark ? "mt-2 text-3xl font-black text-white md:text-4xl" : "mt-2 text-3xl font-black text-slate-900 md:text-4xl"}>
              Ma giam gia hien tai va sap ap dung
            </h2>
          </div>
          <Button
            variant="outlined"
            onClick={() => navigate("/cart")}
            sx={{
              alignSelf: "flex-start",
              borderRadius: "999px",
              borderColor: "#f97316",
              color: isDark ? "#fb923c" : "#ea580c",
              textTransform: "none",
              fontWeight: 700,
            }}
          >
            Den gio hang de ap dung
          </Button>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[0, 1, 2].map((item) => (
              <div
                key={item}
                className={
                  isDark
                    ? "h-[112px] animate-pulse rounded-[1.35rem] border border-orange-500/15 bg-white/[0.03]"
                    : "h-[112px] animate-pulse rounded-[1.35rem] border border-slate-200 bg-slate-100"
                }
              />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {visibleCoupons.map((item) => (
              <CouponRowCard
                key={`${item.badge}-${item.coupon.id ?? item.coupon.code}`}
                coupon={item.coupon}
                badge={item.badge}
                badgeColor={item.badgeColor}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default CouponSpotlight;
