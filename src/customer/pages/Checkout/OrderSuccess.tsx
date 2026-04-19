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
        isDark ? "bg-[#0f0f0f]" : "bg-[#f6f6f6]"
      }`}
    >
      <div className="mx-auto flex min-h-[80vh] max-w-3xl items-center justify-center">
        <div
          className={`w-full overflow-hidden rounded-[2rem] border transition-colors duration-300 ${
            isDark
              ? "border-white/10 bg-[#111111] shadow-[0_28px_80px_rgba(0,0,0,0.45)]"
              : "border-black/8 bg-white shadow-[0_28px_80px_rgba(0,0,0,0.10)]"
          }`}
        >
          <div className="px-6 pb-8 pt-10 text-center sm:px-10">
            <div
              className={`mx-auto flex h-24 w-24 items-center justify-center rounded-full border ${
                isDark
                  ? "border-white/12 bg-white/[0.05] shadow-[0_16px_36px_rgba(0,0,0,0.28)]"
                  : "border-black/10 bg-black/[0.04] shadow-[0_12px_26px_rgba(0,0,0,0.08)]"
              }`}
            >
              <CheckCircle
                sx={{
                  fontSize: 54,
                  color: isDark ? "#ffffff" : "#000000",
                }}
              />
            </div>

            <p
              className={`mt-6 text-[11px] font-bold uppercase tracking-[0.28em] ${
                isDark ? "text-white/50" : "text-black/50"
              }`}
            >
              Đơn hàng đã xác nhận
            </p>

            <h1
              className={`mt-3 text-3xl font-black uppercase tracking-tight sm:text-4xl ${
                isDark ? "text-white" : "text-black"
              }`}
            >
              Đặt hàng thành công
            </h1>

            <p
              className={`mx-auto mt-3 max-w-xl text-sm leading-7 sm:text-base ${
                isDark ? "text-white/65" : "text-black/60"
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
                    : "border-black/10 bg-black/[0.02]"
                }`}
              >
                <p
                  className={`text-[11px] uppercase tracking-[0.2em] ${
                    isDark ? "text-white/45" : "text-black/45"
                  }`}
                >
                  Mã đơn hàng
                </p>
                <p
                  className={`mt-2 text-2xl font-black ${
                    isDark ? "text-white" : "text-black"
                  }`}
                >
                  #{orderId}
                </p>
              </div>
            )}

            <div
              className={`mx-auto mt-6 flex max-w-xl items-center justify-center gap-3 rounded-[1.5rem] border px-4 py-4 text-left ${
                isDark
                  ? "border-white/10 bg-white/[0.04]"
                  : "border-black/10 bg-black/[0.03]"
              }`}
            >
              <LocalShipping
                sx={{ color: isDark ? "#ffffff" : "#000000" }}
              />
              <span
                className={`text-sm leading-6 sm:text-base ${
                  isDark ? "text-white/72" : "text-black/72"
                }`}
              >
                Đơn hàng đang được xác nhận và sẽ được bàn giao cho đơn vị vận
                chuyển trong bước tiếp theo.
              </span>
            </div>

            <p
              className={`mt-4 text-sm ${
                isDark ? "text-white/50" : "text-black/50"
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
                variant="outlined"
                onClick={() => navigate(`/account/orders`)}
                sx={{
                  textTransform: "none",
                  borderRadius: "999px",
                  py: 1.35,
                  fontWeight: 800,
                  fontSize: "0.96rem",
background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
                      color: "#fff",
                      "&:hover": {
                        background: "linear-gradient(135deg, #fb923c 0%, #f97316 100%)",
                        boxShadow: "none",
                      },
                  borderColor: isDark
                    ? "rgba(255,255,255,0.16)"
                    : "rgba(0,0,0,0.14)",
    
                  boxShadow: "none",

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
                  color: isDark ? "#fff" : "#000",
                  borderColor: isDark
                    ? "rgba(255,255,255,0.16)"
                    : "rgba(0,0,0,0.14)",
                  backgroundColor: "transparent",
                  "&:hover": {
                    borderColor: isDark
                      ? "rgba(255,255,255,0.28)"
                      : "rgba(0,0,0,0.28)",
                    backgroundColor: isDark
                      ? "rgba(255,255,255,0.04)"
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