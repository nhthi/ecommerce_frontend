import { CheckCircle, LocalShipping } from "@mui/icons-material";
import { Button, Divider } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useSiteThemeMode } from "../../../Theme/SiteThemeProvider";

const OrderSuccess = () => {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const { isDark } = useSiteThemeMode();

  return (
    <div
      className={`min-h-screen px-4 py-10 transition-colors duration-300 ${
        isDark
          ? "bg-[#0b0b0b]"
          : "bg-[linear-gradient(180deg,#fffaf5_0%,#ffffff_45%,#f8fafc_100%)]"
      }`}
    >
      <div className="mx-auto flex min-h-[80vh] max-w-3xl items-center justify-center">
        <div
          className={`w-full overflow-hidden rounded-[2rem] border shadow-[0_28px_80px_rgba(0,0,0,0.12)] transition-colors duration-300 ${
            isDark
              ? "border-orange-500/15 bg-[radial-gradient(circle_at_top,_rgba(249,115,22,0.18),_transparent_32%),linear-gradient(180deg,_#171717_0%,_#101010_100%)] shadow-[0_28px_80px_rgba(0,0,0,0.45)]"
              : "border-black/8 bg-[radial-gradient(circle_at_top,_rgba(249,115,22,0.12),_transparent_30%),linear-gradient(180deg,_#ffffff_0%,_#fffaf5_100%)]"
          }`}
        >
          <div className="px-6 pb-8 pt-10 text-center sm:px-10">
            <div
              className={`mx-auto flex h-24 w-24 items-center justify-center rounded-full border ${
                isDark
                  ? "border-orange-500/20 bg-orange-500/10 shadow-[0_20px_40px_rgba(249,115,22,0.15)]"
                  : "border-orange-200 bg-orange-50 shadow-[0_16px_30px_rgba(249,115,22,0.12)]"
              }`}
            >
              <CheckCircle sx={{ fontSize: 54, color: "#f97316" }} />
            </div>

            <p
              className={`mt-6 text-[11px] font-bold uppercase tracking-[0.28em] ${
                isDark ? "text-orange-300" : "text-orange-600"
              }`}
            >
              Đơn hàng đã xác nhận
            </p>

            <h1
              className={`mt-3 text-3xl font-black uppercase tracking-tight sm:text-4xl ${
                isDark ? "text-white" : "text-slate-900"
              }`}
            >
              Đặt hàng thành công
            </h1>

            <p
              className={`mx-auto mt-3 max-w-xl text-sm leading-7 sm:text-base ${
                isDark ? "text-neutral-400" : "text-slate-600"
              }`}
            >
              Đơn hàng của bạn đã được ghi nhận. Hệ thống đang chuẩn bị xử lý và
              bạn có thể theo dõi trạng thái trong tài khoản.
            </p>

            {orderId && (
              <div
                className={`mx-auto mt-6 max-w-sm rounded-[1.5rem] border px-5 py-4 ${
                  isDark
                    ? "border-white/10 bg-white/[0.04]"
                    : "border-black/10 bg-white"
                }`}
              >
                <p
                  className={`text-[11px] uppercase tracking-[0.2em] ${
                    isDark ? "text-neutral-500" : "text-slate-500"
                  }`}
                >
                  Mã đơn hàng
                </p>
                <p className="mt-2 text-2xl font-black text-orange-500">
                  #{orderId}
                </p>
              </div>
            )}

            <div
              className={`mx-auto mt-6 flex max-w-xl items-center justify-center gap-3 rounded-[1.5rem] border px-4 py-4 text-left ${
                isDark
                  ? "border-white/8 bg-black/20"
                  : "border-orange-100 bg-orange-50/80"
              }`}
            >
              <LocalShipping sx={{ color: "#f97316" }} />
              <span
                className={`text-sm leading-6 sm:text-base ${
                  isDark ? "text-neutral-300" : "text-slate-700"
                }`}
              >
                Đơn hàng đang được xác nhận và sẽ được bàn giao cho đơn vị vận
                chuyển trong bước tiếp theo.
              </span>
            </div>

            <p
              className={`mt-4 text-sm ${
                isDark ? "text-neutral-500" : "text-slate-500"
              }`}
            >
              Nếu cần xem lại chi tiết, vào mục đơn hàng trong tài khoản của
              bạn.
            </p>

            <Divider
              sx={{
                my: 4,
                borderColor: isDark
                  ? "rgba(255,255,255,0.08)"
                  : "rgba(0,0,0,0.08)",
              }}
            />

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                fullWidth
                variant="contained"
                onClick={() => navigate(`/account/orders`)}
                sx={{
                  textTransform: "none",
                  borderRadius: "999px",
                  py: 1.35,
                  fontWeight: 800,
                  fontSize: "0.96rem",
                  color: "#111111",
                  background:
                    "linear-gradient(135deg, #fb923c 0%, #f97316 100%)",
                  boxShadow: "0 16px 35px rgba(249,115,22,0.28)",
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #fdba74 0%, #ea580c 100%)",
                  },
                }}
              >
                Xem đơn hàng
              </Button>

              <Button
                fullWidth
                variant="outlined"
                onClick={() => navigate("/")}
                sx={{
                  textTransform: "none",
                  borderRadius: "999px",
                  py: 1.35,
                  fontWeight: 700,
                  color: isDark ? "#fdba74" : "#111827",
                  borderColor: isDark
                    ? "rgba(249,115,22,0.35)"
                    : "rgba(0,0,0,0.14)",
                  backgroundColor: isDark ? "transparent" : "#ffffff",
                  "&:hover": {
                    borderColor: isDark ? "#f97316" : "rgba(0,0,0,0.28)",
                    backgroundColor: isDark
                      ? "rgba(249,115,22,0.08)"
                      : "rgba(0,0,0,0.03)",
                  },
                }}
              >
                Tiếp tục mua hàng
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;