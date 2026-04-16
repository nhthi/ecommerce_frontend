import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  IconButton,
  TextField,
  Paper,
  CircularProgress,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { useNavigate } from "react-router-dom";
import { api } from "../../../config/Api";
import { useAppDispatch, useAppSelector } from "../../../state/Store";
import {
  addUserMessage,
  sendChatMessage,
  resetChat,
  addBotMessage,
  ChatMessage,
  ProductSuggestion,
} from "../../../state/customer/chatbotSlice";
import { SmartToy, Bolt, FitnessCenter } from "@mui/icons-material";
import { useSiteThemeMode } from "../../../Theme/SiteThemeProvider";

interface Props {
  productId?: number;
}

type ChatbotAction = {
  label: string;
  action: string;
  target?: string;
  refId?: number | string;
};

type ProductSize = {
  id: number;
  name: string;
  quantity: number;
  deletedAt?: string | null;
};

type ProductItem = {
  itemType: "product";
  title: string;
  subtitle?: string;
  description?: string;
  imageUrl?: string;
  data?: {
    sold?: number;
    discountPercent?: number;
    quantity?: number;
    productId?: number;
    color?: string;
    price?: number;
    mrpPrice?: number;
    category?: string;
    brand?: string | null;
    numRatings?: number;
    status?: string;
    sizes?: ProductSize[];
  };
  actions?: ChatbotAction[];
};

type OrderItem = {
  itemType: "order";
  title: string;
  subtitle?: string;
  description?: string;
  imageUrl?: string;
  data?: {
    createdAt?: string;
    orderId?: number;
    totalPrice?: number;
    orderStatus?: string;
    orderCode?: string;
    paymentStatus?: string;
    itemCount?: number;
  };
  actions?: ChatbotAction[];
};

type ChatbotStructuredItem = ProductItem | OrderItem;

type ExtendedChatMessage = ChatMessage & {
  type?: "text" | "product_list" | "order_list" | "order_detail";
  items?: ChatbotStructuredItem[];
  actions?: ChatbotAction[];
  metadata?: any;
};

const formatPrice = (value?: number) => {
  if (typeof value !== "number") return null;
  return `${value.toLocaleString("vi-VN")} đ`;
};

const formatDateTime = (value?: string) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const getOrderStatusLabel = (status?: string) => {
  switch (status) {
    case "PENDING":
      return "Chờ xác nhận";
    case "CONFIRMED":
      return "Đã xác nhận";
    case "SHIPPED":
      return "Đang giao";
    case "DELIVERED":
      return "Đã giao";
    case "CANCELLED":
      return "Đã hủy";
    default:
      return status || "Không rõ";
  }
};

const getPaymentStatusLabel = (status?: string) => {
  switch (status) {
    case "PENDING":
      return "Chờ thanh toán";
    case "SUCCESS":
      return "Đã thanh toán";
    case "UNPAID":
      return "Chưa thanh toán";
    case "FAILED":
      return "Thanh toán thất bại";
    default:
      return status || "Không rõ";
  }
};

const getOrderStatusStyles = (status?: string) => {
  switch (status) {
    case "PENDING":
      return {
        text: "#fbbf24",
        bg: "rgba(251,191,36,0.12)",
        border: "rgba(251,191,36,0.24)",
      };
    case "DELIVERED":
      return {
        text: "#4ade80",
        bg: "rgba(74,222,128,0.12)",
        border: "rgba(74,222,128,0.24)",
      };
    case "CANCELLED":
      return {
        text: "#f87171",
        bg: "rgba(248,113,113,0.12)",
        border: "rgba(248,113,113,0.24)",
      };
    case "SHIPPED":
      return {
        text: "#60a5fa",
        bg: "rgba(96,165,250,0.12)",
        border: "rgba(96,165,250,0.24)",
      };
    default:
      return {
        text: "#d4d4d8",
        bg: "rgba(255,255,255,0.06)",
        border: "rgba(255,255,255,0.12)",
      };
  }
};

const getPaymentStatusStyles = (status?: string) => {
  switch (status) {
    case "PENDING":
      return {
        text: "#fbbf24",
        bg: "rgba(251,191,36,0.12)",
        border: "rgba(251,191,36,0.24)",
      };
    case "SUCCESS":
      return {
        text: "#4ade80",
        bg: "rgba(74,222,128,0.12)",
        border: "rgba(74,222,128,0.24)",
      };
    case "UNPAID":
      return {
        text: "#f87171",
        bg: "rgba(248,113,113,0.12)",
        border: "rgba(248,113,113,0.24)",
      };
    default:
      return {
        text: "#d4d4d8",
        bg: "rgba(255,255,255,0.06)",
        border: "rgba(255,255,255,0.12)",
      };
  }
};

const ChatBotWidget: React.FC<Props> = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [selectedSizes, setSelectedSizes] = useState<Record<number, string>>({});
  const [selectedQuantities, setSelectedQuantities] = useState<
    Record<number, number>
  >({});
  const { isDark } = useSiteThemeMode();
  const [addingProductId, setAddingProductId] = useState<number | null>(null);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { messages, loading, sessionId } = useAppSelector(
    (state) => state.chatbot
  );

  const user = useAppSelector((state: any) => state.auth?.user);
  const userId = user?.id;

  const scrollRef = useRef<HTMLDivElement>(null);

  const suggestionMessages = useMemo(
    () => [
      "Quần tập nam dưới 200k",
      "Chính sách giao hàng",
      "Đơn của tôi đang ở đâu?",
      "Có hỗ trợ đổi trả không?",
    ],
    []
  );

  const toggleOpen = () => setOpen((prev) => !prev);

  const submitMessage = (message: string) => {
    const trimmed = message.trim();
    if (!trimmed) return;

    dispatch(addUserMessage(trimmed));
    setInput("");

    dispatch(
      sendChatMessage({
        message: trimmed,
        userId,
        sessionId: sessionId || undefined,
      })
    );
  };

  const handleSend = () => {
    submitMessage(input);
  };

  const handleSuggestionClick = (message: string) => {
    submitMessage(message);
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleProductClick = (product: ProductSuggestion) => {
    if (product.productUrl) {
      navigate(product.productUrl);
      return;
    }

    if (product.id) {
      navigate(`/products/${product.id}`);
    }
  };

  const handleActionClick = (action?: ChatbotAction) => {
  if (!action) return;

  if (action.action === "ADD_TO_CART") {
    return;
  }

  if (action.action === "LOGIN") {
    navigate("/login");
    return;
  }

  if (action.target) {
    navigate(action.target);
    return;
  }

  if (action.action === "VIEW_PRODUCT" && action.refId) {
    navigate(`/products/${action.refId}`);
    return;
  }

  if (action.action === "VIEW_ORDER" && action.refId) {
    navigate(`/account/orders/${action.refId}`);
    return;
  }
};

  const getSelectedSizeObject = (item: ProductItem) => {
    const productId = item.data?.productId;
    const sizeName = productId ? selectedSizes[productId] : undefined;
    return item.data?.sizes?.find((s) => s.name === sizeName);
  };

  const handleSelectSize = (productId: number, sizeName: string) => {
    setSelectedSizes((prev) => ({
      ...prev,
      [productId]: sizeName,
    }));

    setSelectedQuantities((prev) => ({
      ...prev,
      [productId]: prev[productId] && prev[productId] > 0 ? prev[productId] : 1,
    }));
  };

  const handleDecreaseQty = (productId: number) => {
    setSelectedQuantities((prev) => ({
      ...prev,
      [productId]: Math.max(1, (prev[productId] || 1) - 1),
    }));
  };

  const handleIncreaseQty = (item: ProductItem) => {
    const productId = item.data?.productId;
    if (!productId) return;

    const selectedSize = getSelectedSizeObject(item);
    const maxQty = selectedSize?.quantity || 1;

    setSelectedQuantities((prev) => ({
      ...prev,
      [productId]: Math.min(maxQty, (prev[productId] || 1) + 1),
    }));
  };

  const handleAddToCart = async (item: ProductItem) => {
    if (!userId) {
  dispatch(
    addBotMessage({
      text: "Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng.",
      type: "text",
      items: [],
      actions: [
        {
          label: "Đăng nhập ngay",
          action: "LOGIN",
          target: "/login",
        },
      ],
      metadata: null,
    })
  );
  return;
}
    const productId = item.data?.productId;
    if (!productId) return;

    const selectedSizeName = selectedSizes[productId];
    const selectedSize = item.data?.sizes?.find(
      (s) => s.name === selectedSizeName
    );

    if (!selectedSize) {
      dispatch(
        addBotMessage({
          text: `Vui lòng chọn size cho sản phẩm "${item.title}" trước khi thêm vào giỏ.`,
          type: "text",
          items: [],
          actions: [],
          metadata: null,
        })
      );
      return;
    }

    const quantity = selectedQuantities[productId] || 1;

    if (quantity > selectedSize.quantity) {
      dispatch(
        addBotMessage({
          text: `Số lượng vượt quá tồn kho của size ${selectedSize.name}. Hiện chỉ còn ${selectedSize.quantity} sản phẩm.`,
          type: "text",
          items: [],
          actions: [],
          metadata: null,
        })
      );
      return;
    }

    try {
      setAddingProductId(productId);

      await api.put("/api/cart/add", {
        productId,
        sizeId: selectedSize.id,
        quantity,
      });

      dispatch(
        addBotMessage({
          text: `Đã thêm ${quantity} sản phẩm "${item.title}" - size ${selectedSize.name} vào giỏ hàng.`,
          type: "text",
          items: [],
          actions: [],
          metadata: null,
        })
      );
    } catch (error: any) {
    const status = error?.response?.status;
    const message = error?.response?.data?.message;

    if (status === 401 || status === 403) {
      dispatch(
        addBotMessage({
          text: "Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng.",
          type: "text",
          items: [],
          actions: [
            {
              label: "Đăng nhập ngay",
              action: "LOGIN",
              target: "/login",
            },
          ],
          metadata: null,
        })
      );

      return;
    }
      dispatch(
        addBotMessage({
          text:
            error?.response?.data?.message ||
            "Không thể thêm sản phẩm vào giỏ hàng lúc này.",
          type: "text",
          items: [],
          actions: [],
          metadata: null,
        })
      );
    } finally {
      setAddingProductId(null);
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading, open]);

  useEffect(() => {
    if (!open) {
      setInput("");
    }
  }, [open]);

  const showSuggestions = messages.length === 0 && !loading;

  const renderProductCard = (item: ProductItem, index: number) => {
    const price = item.data?.price;
    const mrpPrice = item.data?.mrpPrice;
    const quantity = item.data?.quantity;
    const discountPercent = item.data?.discountPercent;
    const color = item.data?.color;
    const category = item.data?.category;
    const productId = item.data?.productId;
    const sizes = item.data?.sizes || [];

    const selectedSizeName = productId ? selectedSizes[productId] : undefined;
    const selectedSize = sizes.find((s) => s.name === selectedSizeName);
    const selectedQty = productId ? selectedQuantities[productId] || 1 : 1;

    return (
      <div
        key={`${item.data?.productId || item.title}-${index}`}
        className="overflow-hidden rounded-2xl border border-white/10 bg-[#181818] shadow-[0_10px_24px_rgba(0,0,0,0.18)]"
      >
        <div className="flex gap-3 p-3">
          <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-[#242424]">
            {item.imageUrl ? (
              <img
                src={item.imageUrl}
                alt={item.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs text-neutral-500">
                No image
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="line-clamp-2 text-sm font-bold text-white">
              {item.title}
            </div>

            {item.subtitle && (
              <div className="mt-1 text-xs text-orange-300">{item.subtitle}</div>
            )}

            {item.description && (
              <div className="mt-1 line-clamp-3 text-xs leading-5 text-neutral-400">
                {item.description}
              </div>
            )}

            <div className="mt-2 flex flex-wrap gap-2">
              {category && (
                <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] text-neutral-300">
                  {category}
                </span>
              )}
              {color && (
                <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] text-neutral-300">
                  Màu: {color}
                </span>
              )}
              {typeof quantity === "number" && (
                <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] text-neutral-300">
                  Tổng tồn: {quantity}
                </span>
              )}
            </div>

            <div className="mt-3 flex items-end gap-2">
              {typeof price === "number" && (
                <div className="text-base font-black text-orange-300">
                  {formatPrice(price)}
                </div>
              )}

              {typeof mrpPrice === "number" && mrpPrice > (price || 0) && (
                <div className="text-xs text-neutral-500 line-through">
                  {formatPrice(mrpPrice)}
                </div>
              )}

              {typeof discountPercent === "number" && discountPercent > 0 && (
                <div className="rounded-full bg-orange-500/12 px-2 py-0.5 text-[11px] font-semibold text-orange-300">
                  -{discountPercent}%
                </div>
              )}
            </div>

            {!!sizes.length && (
              <div className="mt-3">
                <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-neutral-400">
                  Chọn size
                </div>

                <div className="flex flex-wrap gap-2">
                  {sizes.map((size) => {
                    const isSelected = selectedSizeName === size.name;
                    const isOutOfStock = size.quantity <= 0;

                    return (
                      <button
                        key={size.id}
                        type="button"
                        disabled={isOutOfStock}
                        onClick={() =>
                          productId && handleSelectSize(productId, size.name)
                        }
                        className={`rounded-xl border px-3 py-1.5 text-xs font-semibold transition ${
                          isSelected
                            ? "border-orange-400 bg-orange-500/15 text-orange-300"
                            : "border-white/10 bg-white/5 text-neutral-200 hover:bg-white/10"
                        } ${isOutOfStock ? "cursor-not-allowed opacity-40" : ""}`}
                      >
                        {size.name} ({size.quantity})
                      </button>
                    );
                  })}
                </div>

                {selectedSize && (
                  <div className="mt-2 text-xs text-neutral-400">
                    Tồn kho size{" "}
                    <span className="font-semibold text-white">
                      {selectedSize.name}
                    </span>
                    :{" "}
                    <span className="font-semibold text-orange-300">
                      {selectedSize.quantity}
                    </span>
                  </div>
                )}
              </div>
            )}

            {!!productId && !!selectedSize && (
              <div className="mt-3 flex items-center gap-2">
                <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-neutral-400">
                  Số lượng
                </div>

                <div className="flex items-center overflow-hidden rounded-xl border border-white/10">
                  <button
                    type="button"
                    onClick={() => handleDecreaseQty(productId)}
                    className="px-3 py-1.5 text-white hover:bg-white/10"
                  >
                    -
                  </button>
                  <div className="min-w-[40px] text-center text-sm font-semibold text-white">
                    {selectedQty}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleIncreaseQty(item)}
                    className="px-3 py-1.5 text-white hover:bg-white/10"
                  >
                    +
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {!!item.actions?.length && (
          <div className="flex gap-2 border-t border-white/8 px-3 py-3">
            {item.actions.map((action, idx) => {
              if (action.action === "ADD_TO_CART") {
                return (
                  <button
                    key={`${action.action}-${idx}`}
                    type="button"
                    disabled={!productId || addingProductId === productId}
                    onClick={() => handleAddToCart(item)}
                    className="flex-1 rounded-xl bg-orange-500 px-3 py-2 text-sm font-semibold text-[#111111] transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {addingProductId === productId
                      ? "Đang thêm..."
                      : action.label}
                  </button>
                );
              }

              return (
                <button
                  key={`${action.action}-${idx}`}
                  type="button"
                  onClick={() => handleActionClick(action)}
                  className="flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  {action.label}
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  };

const renderOrderCard = (
  item: OrderItem,
  index: number,
  isDetail = false
) => {
  const orderStatus = item.data?.orderStatus;
  const paymentStatus = item.data?.paymentStatus;
  const orderStatusStyles = getOrderStatusStyles(orderStatus);
  const paymentStatusStyles = getPaymentStatusStyles(paymentStatus);

  return (
    <div
      key={`${item.data?.orderId || item.title}-${index}`}
      className={
        isDark
          ? "overflow-hidden rounded-2xl border border-white/10 bg-[#181818] shadow-[0_10px_24px_rgba(0,0,0,0.18)]"
          : "overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_10px_24px_rgba(15,23,42,0.08)]"
      }
    >
      <div className="flex gap-3 p-3">
        <div
          className={
            isDark
              ? "h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-[#242424]"
              : "h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-slate-100"
          }
        >
          {item.imageUrl ? (
            <img
              src={item.imageUrl}
              alt={item.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div
              className={
                isDark
                  ? "flex h-full w-full items-center justify-center text-xs text-neutral-500"
                  : "flex h-full w-full items-center justify-center text-xs text-slate-400"
              }
            >
              <ShoppingBagOutlinedIcon fontSize="small" />
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div
            className={
              isDark
                ? "line-clamp-2 text-sm font-bold text-white"
                : "line-clamp-2 text-sm font-bold text-slate-900"
            }
          >
            {item.title}
          </div>

          {item.subtitle && (
            <div
              className={
                isDark
                  ? "mt-1 text-xs leading-5 text-neutral-400"
                  : "mt-1 text-xs leading-5 text-slate-500"
              }
            >
              {item.subtitle}
            </div>
          )}

          {item.description && (
            <div
              className={
                isDark
                  ? "mt-1 text-xs leading-5 text-neutral-300"
                  : "mt-1 text-xs leading-5 text-slate-600"
              }
            >
              {item.description}
            </div>
          )}

          <div className="mt-2 flex flex-wrap gap-2">
            <span
              className="rounded-full border px-2 py-0.5 text-[11px] font-semibold"
              style={{
                color: orderStatusStyles.text,
                background: orderStatusStyles.bg,
                borderColor: orderStatusStyles.border,
              }}
            >
              {getOrderStatusLabel(orderStatus)}
            </span>

            <span
              className="rounded-full border px-2 py-0.5 text-[11px] font-semibold"
              style={{
                color: paymentStatusStyles.text,
                background: paymentStatusStyles.bg,
                borderColor: paymentStatusStyles.border,
              }}
            >
              {getPaymentStatusLabel(paymentStatus)}
            </span>
          </div>

          <div
            className={
              isDark
                ? "mt-3 grid grid-cols-1 gap-1 text-xs text-neutral-400"
                : "mt-3 grid grid-cols-1 gap-1 text-xs text-slate-500"
            }
          >
            {item.data?.orderCode && (
              <div>
                Mã đơn:{" "}
                <span
                  className={
                    isDark
                      ? "font-semibold text-neutral-200"
                      : "font-semibold text-slate-800"
                  }
                >
                  {item.data.orderCode}
                </span>
              </div>
            )}

            {item.data?.createdAt && (
              <div>
                Ngày tạo:{" "}
                <span
                  className={
                    isDark
                      ? "font-semibold text-neutral-200"
                      : "font-semibold text-slate-800"
                  }
                >
                  {formatDateTime(item.data.createdAt)}
                </span>
              </div>
            )}

            {typeof item.data?.itemCount === "number" && (
              <div>
                Số sản phẩm:{" "}
                <span
                  className={
                    isDark
                      ? "font-semibold text-neutral-200"
                      : "font-semibold text-slate-800"
                  }
                >
                  {item.data.itemCount}
                </span>
              </div>
            )}

            {typeof item.data?.totalPrice === "number" && (
              <div>
                Tổng tiền:{" "}
                <span className="font-bold text-orange-500">
                  {formatPrice(item.data.totalPrice)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {!!item.actions?.length && (
        <div
          className={
            isDark
              ? "border-t border-white/8 px-3 py-3"
              : "border-t border-slate-200 px-3 py-3"
          }
        >
          <button
            type="button"
            onClick={() => handleActionClick(item.actions?.[0])}
            className={
              isDark
                ? "flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
                : "flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            }
          >
            <VisibilityOutlinedIcon sx={{ fontSize: 18 }} />
            {item.actions?.[0]?.label ||
              (isDetail ? "Xem đơn hàng" : "Xem chi tiết")}
          </button>
        </div>
      )}
    </div>
  );
};

  const renderStructuredContent = (msg: ExtendedChatMessage) => {
    if (msg.sender !== "bot") return null;
    if (!msg.items || msg.items.length === 0) return null;

    if (msg.type === "product_list") {
      return (
        <div className="ml-1 mt-2 space-y-3">
          {msg.items
            .filter((item) => item.itemType === "product")
            .map((item, index) => renderProductCard(item as ProductItem, index))}
        </div>
      );
    }

    if (msg.type === "order_list") {
      return (
        <div className="ml-1 mt-2 space-y-3">
          <div className="flex items-center gap-2 px-1 text-xs font-bold uppercase tracking-[0.16em] text-orange-300">
            <Inventory2OutlinedIcon sx={{ fontSize: 16 }} />
            Danh sách đơn hàng
          </div>

          {msg.items
            .filter((item) => item.itemType === "order")
            .map((item, index) => renderOrderCard(item as OrderItem, index))}
        </div>
      );
    }

    if (msg.type === "order_detail") {
      return (
        <div className="ml-1 mt-2 space-y-3">
          <div className="flex items-center gap-2 px-1 text-xs font-bold uppercase tracking-[0.16em] text-orange-300">
            <ShoppingBagOutlinedIcon sx={{ fontSize: 16 }} />
            Chi tiết đơn hàng
          </div>

          {msg.items
            .filter((item) => item.itemType === "order")
            .map((item, index) =>
              renderOrderCard(item as OrderItem, index, true)
            )}
        </div>
      );
    }

    return null;
  };

  return (
    <>
      <div className="fixed bottom-5 right-5 z-50">
        <button
          type="button"
          onClick={toggleOpen}
          className={[
            "group flex h-14 w-14 items-center justify-center rounded-full border border-orange-400/30",
            "bg-[linear-gradient(135deg,#fb923c_0%,#f97316_100%)] text-[#111111]",
            "shadow-[0_18px_38px_rgba(249,115,22,0.35)] transition-all duration-300",
            open
              ? "scale-95"
              : "hover:-translate-y-1 hover:shadow-[0_22px_46px_rgba(249,115,22,0.42)]",
          ].join(" ")}
          aria-label={open ? "Đóng chatbot" : "Mở chatbot"}
        >
          {open ? (
            <CloseIcon sx={{ fontSize: 24 }} />
          ) : (
            <SmartToy sx={{ fontSize: 26 }} />
          )}
        </button>
      </div>

      <div
  className={[
    "fixed bottom-24 right-5 z-50 w-[calc(100vw-2rem)] max-w-[520px] origin-bottom-right transition-all duration-300",
    open
      ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
      : "pointer-events-none translate-y-4 scale-95 opacity-0",
  ].join(" ")}
>
        <Paper
  elevation={0}
  className="flex h-[680px] flex-col overflow-hidden rounded-[1.8rem] border border-orange-500/16 bg-[radial-gradient(circle_at_top,_rgba(249,115,22,0.16),_transparent_30%),linear-gradient(180deg,_#171717_0%,_#101010_100%)] shadow-[0_30px_80px_rgba(0,0,0,0.45)]"
>
          <div className="flex items-start justify-between border-b border-white/8 px-5 py-4 text-white">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-orange-500/30 bg-orange-500/12 text-orange-300">
                  <FitnessCenter sx={{ fontSize: 20 }} />
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-orange-300">
                    Fitness support
                  </p>
                  <p className="text-lg font-black tracking-tight text-white">
                    Trợ lý mua sắm
                  </p>
                </div>
              </div>
              <p className="text-sm leading-6 text-neutral-400">
                Tư vấn nhanh về sản phẩm, đơn hàng, vận chuyển và cách chọn đồ
                tập.
              </p>
            </div>

            <IconButton
              size="small"
              onClick={() => {
                setOpen(false);
                dispatch(resetChat());
              }}
              sx={{
                color: "rgba(255,255,255,0.76)",
                backgroundColor: "rgba(255,255,255,0.04)",
                "&:hover": {
                  backgroundColor: "rgba(249,115,22,0.12)",
                  color: "#fdba74",
                },
              }}
            >
              <CloseIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </div>

          <div
            ref={scrollRef}
            className="flex-1 space-y-3 overflow-y-auto px-4 py-4"
          >
            {showSuggestions && (
              <div className="space-y-4">
                <div className="rounded-[1.4rem] border border-orange-500/14 bg-[#1a1714] p-4 text-sm leading-6 text-neutral-100 shadow-[0_10px_24px_rgba(0,0,0,0.16)]">
                  <div className="mb-3 flex items-center gap-2 text-orange-300">
                    <Bolt sx={{ fontSize: 18 }} />
                    <span className="text-[11px] font-bold uppercase tracking-[0.2em]">
                      Gợi ý nhanh
                    </span>
                  </div>
                  <p className="text-neutral-100">
                    Bạn có thể hỏi về sản phẩm, tra cứu đơn hàng, phí vận chuyển
                    hoặc nhờ tư vấn theo nhu cầu tập luyện.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {suggestionMessages.map((item) => (
                    <Button
                      key={item}
                      onClick={() => handleSuggestionClick(item)}
                      variant="outlined"
                      sx={{
                        textTransform: "none",
                        borderRadius: "999px",
                        px: 1.8,
                        py: 0.8,
                        fontSize: "0.82rem",
                        lineHeight: 1.45,
                        justifyContent: "flex-start",
                        color: "#f5f5f5",
                        borderColor: "rgba(249,115,22,0.22)",
                        backgroundColor: "#1b1b1b",
                        "&:hover": {
                          borderColor: "rgba(249,115,22,0.34)",
                          backgroundColor: "rgba(249,115,22,0.16)",
                        },
                      }}
                    >
                      {item}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {(messages as ExtendedChatMessage[]).map((msg, idx) => (
              <div key={idx} className="space-y-2">
                {msg.text && (
                  <div
                    className={`flex ${
                      msg.sender === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
<div
  className={[
    "max-w-[84%] rounded-[1.25rem] px-4 py-3 text-sm leading-6 transition-all duration-200 whitespace-pre-line",
    msg.sender === "user"
      ? "bg-[linear-gradient(135deg,#fb923c_0%,#f97316_100%)] text-[#111111] rounded-br-md font-semibold shadow-[0_12px_28px_rgba(249,115,22,0.22)]"
      : isDark
      ? "border border-white/8 bg-[#1a1a1a] text-neutral-100 rounded-bl-md shadow-[0_10px_22px_rgba(0,0,0,0.14)]"
      : "border border-slate-200 bg-white text-slate-800 rounded-bl-md shadow-[0_10px_22px_rgba(15,23,42,0.08)]",
  ].join(" ")}
>
                      {msg.text}
                    </div>
                  </div>
                )}
{msg.sender === "bot" && msg.actions && msg.actions.length > 0 && (
  <div className="ml-1 mt-2 flex flex-wrap gap-2">
    {msg.actions.map((action, actionIndex) => (
      <button
        key={`${action.action}-${actionIndex}`}
        type="button"
        onClick={() => handleActionClick(action)}
        className="rounded-xl bg-orange-500 px-3 py-2 text-sm font-semibold text-[#111111] transition hover:bg-orange-400"
      >
        {action.label}
      </button>
    ))}
  </div>
)}
                {msg.sender === "bot" &&
                  msg.products &&
                  msg.products.length > 0 &&
                  !msg.items?.length && (
                    <div className="ml-1 space-y-2">
                      {msg.products.map((product) => (
                        <button
                          key={product.id}
                          type="button"
                          onClick={() => handleProductClick(product)}
                          className="flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-[#181818] p-3 text-left transition hover:border-orange-400/40 hover:bg-[#1d1d1d]"
                        >
                          <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl bg-[#242424]">
                            {product.imageUrl ? (
                              <img
                                src={product.imageUrl}
                                alt={product.title}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-xs text-neutral-500">
                                No image
                              </div>
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="line-clamp-2 text-sm font-semibold text-white">
                              {product.title}
                            </div>

                            {product.category && (
                              <div className="mt-1 text-xs text-neutral-400">
                                {product.category}
                              </div>
                            )}

                            {typeof product.price === "number" && (
                              <div className="mt-1 text-sm font-bold text-orange-300">
                                {product.price.toLocaleString("vi-VN")} đ
                              </div>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                {renderStructuredContent(msg)}
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 rounded-[1.1rem] border border-white/8 bg-[#1b1b1b] px-3 py-2 text-xs text-neutral-300">
                  <CircularProgress size={14} sx={{ color: "#fb923c" }} />
                  Đang soạn trả lời...
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-white/8 bg-black/10 px-3 py-3">
            <div className="rounded-[1.35rem] border border-orange-500/12 bg-[#f6efe7] p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]">
              <div className="mb-1 px-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#7a5a44]">
                Nhập câu hỏi của bạn
              </div>

              <div className="flex items-center gap-2 rounded-[1rem] bg-white px-3 py-1.5 shadow-[0_8px_24px_rgba(17,17,17,0.06)]">
                <TextField
                  size="small"
                  variant="standard"
                  placeholder="Ví dụ: áo tập nam dưới 300k hoặc kiểm tra đơn ORD-01C1D43C"
                  fullWidth
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  InputProps={{ disableUnderline: true }}
                  sx={{
                    "& .MuiInputBase-root": {
                      color: "#1f2937",
                      fontSize: "0.96rem",
                      fontWeight: 500,
                    },
                    "& .MuiInputBase-input": {
                      paddingY: "6px",
                    },
                    "& .MuiInputBase-input::placeholder": {
                      color: "#9ca3af",
                      opacity: 1,
                    },
                  }}
                />

                <IconButton
                  onClick={handleSend}
                  disabled={loading || !input.trim()}
                  sx={{
                    width: 42,
                    height: 42,
                    color: "#111111",
                    background:
                      "linear-gradient(135deg, #fb923c 0%, #f97316 100%)",
                    boxShadow: "0 12px 24px rgba(249,115,22,0.2)",
                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #fdba74 0%, #ea580c 100%)",
                    },
                    "&.Mui-disabled": {
                      background: "rgba(17,17,17,0.08)",
                      color: "rgba(17,17,17,0.28)",
                    },
                  }}
                >
                  {loading ? (
                    <CircularProgress size={18} sx={{ color: "inherit" }} />
                  ) : (
                    <SendIcon sx={{ fontSize: 20 }} />
                  )}
                </IconButton>
              </div>
            </div>
          </div>
        </Paper>
      </div>
    </>
  );
};

export default ChatBotWidget;