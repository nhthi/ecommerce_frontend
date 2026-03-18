import { CheckCircle, LocalShipping } from "@mui/icons-material";
import { Button, Divider } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

const OrderSuccess = () => {
  const navigate = useNavigate();
  const { orderId } = useParams();

  return (
    <div className="min-h-screen bg-[#0b0b0b] px-4 py-10">
      <div className="mx-auto flex min-h-[80vh] max-w-3xl items-center justify-center">
        <div className="w-full overflow-hidden rounded-[2rem] border border-orange-500/16 bg-[radial-gradient(circle_at_top,_rgba(249,115,22,0.18),_transparent_32%),linear-gradient(180deg,_#171717_0%,_#101010_100%)] shadow-[0_28px_80px_rgba(0,0,0,0.45)]">
          <div className="px-6 pb-8 pt-10 text-center sm:px-10">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border border-orange-500/20 bg-orange-500/10 shadow-[0_20px_40px_rgba(249,115,22,0.15)]">
              <CheckCircle sx={{ fontSize: 54, color: "#fb923c" }} />
            </div>

            <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.28em] text-orange-300">
              Ðon hàng dã xác nh?n
            </p>
            <h1 className="mt-3 text-3xl font-black uppercase tracking-tight text-white sm:text-4xl">
              Ð?t hàng thành công
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-neutral-400 sm:text-base">
              Don hang cua ban da duoc ghi nhan. He thong dang chuan bi xu ly va
              ban co the theo doi trang thai trong tai khoan.
            </p>

            {orderId && (
              <div className="mx-auto mt-6 max-w-sm rounded-[1.5rem] border border-white/10 bg-white/[0.04] px-5 py-4">
                <p className="text-[11px] uppercase tracking-[0.2em] text-neutral-500">
                  Mã don hàng
                </p>
                <p className="mt-2 text-2xl font-black text-orange-400">#{orderId}</p>
              </div>
            )}

            <div className="mx-auto mt-6 flex max-w-xl items-center justify-center gap-3 rounded-[1.5rem] border border-white/8 bg-black/20 px-4 py-4 text-left">
              <LocalShipping sx={{ color: "#fb923c" }} />
              <span className="text-sm leading-6 text-neutral-300 sm:text-base">
                Don hang dang duoc xac nhan va se duoc ban giao cho don vi van
                chuyen trong buoc tiep theo.
              </span>
            </div>

            <p className="mt-4 text-sm text-neutral-500">
              N?u c?n xem l?i chi ti?t, vào m?c don hàng trong tài kho?n c?a b?n.
            </p>

            <Divider sx={{ my: 4, borderColor: "rgba(255,255,255,0.08)" }} />

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
                  background: "linear-gradient(135deg, #fb923c 0%, #f97316 100%)",
                  boxShadow: "0 16px 35px rgba(249,115,22,0.35)",
                  "&:hover": {
                    background: "linear-gradient(135deg, #fdba74 0%, #ea580c 100%)",
                  },
                }}
              >
                Xem don hàng
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
                  color: "#fdba74",
                  borderColor: "rgba(249,115,22,0.35)",
                  "&:hover": {
                    borderColor: "#f97316",
                    backgroundColor: "rgba(249,115,22,0.08)",
                  },
                }}
              >
                Ti?p t?c mua hàng
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;

