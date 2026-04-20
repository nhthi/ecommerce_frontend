import React, { useEffect, useMemo, useState } from "react";
import CartItem from "./CartItem";
import { Close, Favorite, LocalOffer, ShoppingCart } from "@mui/icons-material";
import { Button, IconButton, TextField, Typography, Checkbox } from "@mui/material";
import PricingCart from "./PricingCart";
import { useNavigate } from "react-router-dom";
import { fetchUserCart } from "../../../state/customer/cartSlice";
import { useAppDispatch, useAppSelector } from "../../../state/Store";
import CustomLoading from "../../components/CustomLoading/CustomLoading";
import { useSiteThemeMode } from "../../../Theme/SiteThemeProvider";
import { api } from "../../../config/Api";

const Cart = () => {
  const [couponCodeInput, setCouponCodeInput] = useState<string>("");
  const [appliedCouponCode, setAppliedCouponCode] = useState<string | null>(null);
  const [couponDiscount, setCouponDiscount] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [selectedCartItemIds, setSelectedCartItemIds] = useState<number[]>([]);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { cart } = useAppSelector((store) => store);
  const { isDark } = useSiteThemeMode();

  useEffect(() => {
    dispatch(fetchUserCart());
  }, [dispatch]);

  useEffect(() => {
    const ids =
      cart.cart?.cartItems
        ?.map((item: any) => item.id)
        .filter((id: number | undefined) => typeof id === "number") || [];
    setSelectedCartItemIds(ids);
  }, [cart.cart?.cartItems]);

  const handleChangeCouponCode = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCouponCodeInput(e.target.value);
    setErrorMessage("");
  };

  const selectedItems = useMemo(() => {
    return (
      cart.cart?.cartItems?.filter((item: any) =>
        selectedCartItemIds.includes(item.id)
      ) || []
    );
  }, [cart.cart?.cartItems, selectedCartItemIds]);

  const selectedSubtotal = useMemo(() => {
    return selectedItems.reduce(
      (sum: number, item: any) => sum + Number(item.sellingPrice || 0) * Number(item.quantity || 0),
      0
    );
  }, [selectedItems]);

  const handleApplyCoupon = async () => {
    if (!couponCodeInput.trim()) {
      setErrorMessage("Vui lòng nhập mã giảm giá.");
      return;
    }

    if (selectedItems.length === 0) {
      setErrorMessage("Vui lòng chọn ít nhất 1 sản phẩm trước khi áp mã.");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/api/coupons/preview", {
        code: couponCodeInput.trim(),
        subtotalPrice: selectedSubtotal,
      });

      setAppliedCouponCode(res.data?.couponCode || couponCodeInput.trim());
      setCouponDiscount(Number(res.data?.discountAmount || 0));
      setErrorMessage("");
    } catch (error: any) {
      setAppliedCouponCode(null);
      setCouponDiscount(0);
      setErrorMessage(
        error?.response?.data?.message ||
          error?.response?.data ||
          error?.message ||
          "Không thể áp dụng mã giảm giá."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCouponCode(null);
    setCouponDiscount(0);
    setCouponCodeInput("");
    setErrorMessage("");
  };

  const handleToggleCartItem = (cartItemId: number) => {
    setSelectedCartItemIds((prev) =>
      prev.includes(cartItemId)
        ? prev.filter((id) => id !== cartItemId)
        : [...prev, cartItemId]
    );
  };

  const handleSelectAll = () => {
    const allIds =
      cart.cart?.cartItems
        ?.map((item: any) => item.id)
        .filter((id: number | undefined) => typeof id === "number") || [];

    const isAllSelected =
      allIds.length > 0 && allIds.every((id: number) => selectedCartItemIds.includes(id));

    if (isAllSelected) {
      setSelectedCartItemIds([]);
    } else {
      setSelectedCartItemIds(allIds);
    }
  };

  const isEmpty = !cart.cart?.cartItems || cart.cart.cartItems.length === 0;

  const hasOutOfStock = selectedItems.some(
    (item: any) =>
      Number(item.size?.quantity || 0) === 0 ||
      Number(item.size?.quantity || 0) < item.quantity
  );

  const handleGoCheckout = () => {
    if (selectedCartItemIds.length === 0) {
      setErrorMessage("Vui lòng chọn ít nhất 1 sản phẩm để thanh toán.");
      return;
    }

    navigate("/checkout", {
      state: {
        couponCode: appliedCouponCode,
        couponDiscount,
        selectedCartItemIds,
      },
    });
  };

  return (
    <div
      className={`min-h-screen px-4 pb-16 pt-8 sm:px-8 lg:px-16 xl:px-24 ${
        isDark ? "bg-[#0f0f0f]" : "bg-[#f6f6f6]"
      }`}
    >
      {loading && <CustomLoading message="Đang kiểm tra mã giảm giá..." />}

      <div className="mx-auto max-w-7xl">
        <div
          className={`overflow-hidden rounded-[2rem] border px-6 py-8 shadow-sm sm:px-8 lg:px-10 ${
            isDark ? "border-white/10 bg-[#111111]" : "border-black/10 bg-white"
          }`}
        >
          <div className="mb-6 flex items-center justify-between">
            <div>
              <Typography variant="h5" fontWeight={800}>
                Giỏ hàng của bạn
              </Typography>
              <Typography
                sx={{ mt: 1, color: isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.65)" }}
              >
                Chọn các sản phẩm bạn muốn đặt hàng.
              </Typography>
            </div>

            {!isEmpty && (
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={
                    (cart.cart?.cartItems?.length || 0) > 0 &&
                    cart.cart?.cartItems.every((item: any) =>
                      selectedCartItemIds.includes(item.id)
                    )
                  }
                  indeterminate={
                    selectedCartItemIds.length > 0 &&
                    selectedCartItemIds.length < (cart.cart?.cartItems?.length || 0)
                  }
                  onChange={handleSelectAll}
                />
                <span className={isDark ? "text-white" : "text-black"}>Chọn tất cả</span>
              </div>
            )}
          </div>

          {isEmpty ? (
            <div className="py-16 text-center">
              <ShoppingCart sx={{ fontSize: 56, opacity: 0.5 }} />
              <Typography sx={{ mt: 2 }}>Giỏ hàng đang trống</Typography>
            </div>
          ) : (
            <div className="grid gap-8 lg:grid-cols-[1.35fr_0.65fr]">
              <div className="space-y-4">
                {cart.cart?.cartItems?.map((item: any) => (
                  <div key={item.id} className="flex items-start gap-3">
                    <Checkbox
                      checked={selectedCartItemIds.includes(item.id)}
                      onChange={() => handleToggleCartItem(item.id)}
                      sx={{ mt: 1 }}
                    />
                    <div className="flex-1">
                      <CartItem item={item} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <div
                  className={`rounded-[1.5rem] border p-4 ${
                    isDark ? "border-white/10 bg-[#111111]" : "border-black/10 bg-white"
                  }`}
                >
                  <div className="mb-3 flex items-center gap-2">
                    <LocalOffer />
                    <Typography fontWeight={700}>Mã giảm giá</Typography>
                  </div>

<div className="flex gap-2">
  <TextField
    fullWidth
    size="small"
    value={couponCodeInput}
    onChange={handleChangeCouponCode}
    placeholder="Nhập mã giảm giá"
  />
  <Button
    variant="contained"
    onClick={handleApplyCoupon}
    sx={{
      textTransform: "none",
      whiteSpace: "nowrap",
      minWidth: "fit-content",
      borderRadius: "999px",
      px: 3,
      py: 1.1,
      fontWeight: 800,
      backgroundColor: "#f97316",
      boxShadow: "none",
      "&:hover": {
        backgroundColor: "#ea580c",
        boxShadow: "none",
      },
    }}
  >
    <span className="text-slate-100 text-sm whitespace-nowrap">Áp dụng</span>
  </Button>
</div>

                  {appliedCouponCode && (
                    <div className="mt-3 flex items-center justify-between">
                      <span>Đã áp dụng: {appliedCouponCode}</span>
                      <IconButton onClick={handleRemoveCoupon}>
                        <Close />
                      </IconButton>
                    </div>
                  )}

                  {errorMessage && (
                    <Typography color="error" sx={{ mt: 2 }}>
                      {errorMessage}
                    </Typography>
                  )}
                </div>

                <PricingCart
                  couponCode={appliedCouponCode}
                  couponDiscount={couponDiscount}
                  selectedCartItemIds={selectedCartItemIds}
                />

                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={selectedCartItemIds.length === 0 || hasOutOfStock}
                  onClick={handleGoCheckout}
                >
                  <span className="text-slate-100">Sang bước thanh toán</span>
                  
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;