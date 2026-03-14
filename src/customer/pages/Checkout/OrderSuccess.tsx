import { CheckCircle, LocalShipping } from "@mui/icons-material";
import { Button, Divider } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

const OrderSuccess = () => {
  const navigate = useNavigate();
  const { orderId } = useParams();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 via-blue-50 to-slate-100 px-4">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div
          className="p-6 text-center text-white"
          style={{
            background: "linear-gradient(135deg, #0097e6, #4fc3f7)",
          }}
        >
          <div className="w-20 h-20 mx-auto rounded-full bg-white flex items-center justify-center shadow-lg">
            <CheckCircle sx={{ fontSize: 48, color: "#0097e6" }} />
          </div>

          <h1 className="text-2xl font-semibold mt-4">Đặt hàng thành công</h1>
          <p className="text-sm opacity-90 mt-1">
            Cảm ơn bạn đã mua sắm tại MyShop 💙
          </p>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-4 text-center">
          {orderId && (
            <div className="bg-sky-50 border border-sky-200 rounded-xl py-3">
              <p className="text-xs text-slate-500">Mã đơn hàng</p>
              <p className="text-lg font-semibold text-slate-800">#{orderId}</p>
            </div>
          )}

          <div className="flex items-center justify-center gap-2 text-slate-600 text-sm">
            <LocalShipping sx={{ color: "#0097e6" }} />
            <span>Đơn hàng của bạn đang được xử lý và chuẩn bị giao</span>
          </div>

          <p className="text-xs text-slate-400">
            Email xác nhận đã được gửi. Vui lòng kiểm tra hộp thư của bạn.
          </p>

          <Divider />

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Button
              fullWidth
              variant="contained"
              onClick={() => navigate(`/account/orders`)}
              sx={{
                textTransform: "none",
                borderRadius: "999px",
                py: 1.2,
                fontWeight: 600,
                background: "linear-gradient(135deg, #0097e6, #4fc3f7)",
                boxShadow: "0 12px 30px rgba(0,151,230,0.35)",
                "&:hover": {
                  background: "linear-gradient(135deg, #007acc, #29b6f6)",
                },
              }}
            >
              Quản lý đơn hàng
            </Button>

            <Button
              fullWidth
              variant="outlined"
              onClick={() => navigate("/")}
              sx={{
                textTransform: "none",
                borderRadius: "999px",
                py: 1.2,
                fontWeight: 500,
                borderColor: "#0097e6",
                color: "#0097e6",
                "&:hover": {
                  borderColor: "#007acc",
                  backgroundColor: "rgba(0,151,230,0.05)",
                },
              }}
            >
              Tiếp tục mua sắm
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
