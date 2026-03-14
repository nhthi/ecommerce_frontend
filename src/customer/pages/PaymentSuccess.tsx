import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircleOutline } from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch } from "../../state/Store";
import { paymentSuccess } from "../../state/customer/orderSlice";

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const dispatch = useAppDispatch();

  //   useEffect(() => {
  //     dispatch(paymentSuccess(orderId));
  //   }, []);
  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-green-100 via-white to-green-50">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 15 }}
        className="bg-white p-10 rounded-2xl shadow-xl text-center max-w-md w-full"
      >
        {/* Icon */}
        <motion.div
          initial={{ rotate: -180, scale: 0 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ delay: 0.3, type: "spring" }}
          className="flex justify-center mb-6"
        >
          <CheckCircleOutline
            className="text-green-500"
            style={{ fontSize: "5rem" }}
          />
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-3xl font-bold text-green-600"
        >
          Payment Successful!
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-gray-600 mt-3"
        >
          Thank you for your purchase. Your transaction has been completed
          successfully.
        </motion.p>

        {/* Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-6 px-6 py-3 bg-green-500 text-white font-semibold rounded-xl shadow-md hover:bg-green-600 transition"
          onClick={() => navigate("/")}
        >
          Shopping More
        </motion.button>
      </motion.div>
    </div>
  );
}
