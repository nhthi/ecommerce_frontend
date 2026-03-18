import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import OrderReviewPage from "./OrderReviewPage";
import { Order } from "../../../types/OrderType";
import { api } from "../../../config/Api";

const OrderReviewPageWrapper = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await api.get(`/api/orders/${orderId}`);
        setOrder(data);
      } catch (err) {
        console.error("Lỗi tải đơn hàng:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  if (loading) return <div className="flex h-[80vh] items-center justify-center"><CircularProgress sx={{ color: "#f97316" }} /></div>;
  if (!order) return <div className="mt-20 text-center text-lg text-slate-400">Không tìm thấy đơn hàng.</div>;
  return <OrderReviewPage order={order} />;
};

export default OrderReviewPageWrapper;
