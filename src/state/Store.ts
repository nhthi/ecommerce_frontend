import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import sellerSlice from "./seller/sellerSlice";
import sellerProductSlice from "./seller/sellerProductSlice";
import productSlice from "./customer/productSlice";
import cartSlice from "./customer/cartSlice";
import addressSlice from "./customer/addressSlice";

import authSlice from "./AuthSlice";
import orderSlice from "./customer/orderSlice";
import wishlistSlice from "./customer/wishlistSlice";
import sellerOrderSlice from "./seller/sellerOrderSlice";
import transactionSlice from "./seller/transactionSlice";
import paymentSlice from "./seller/paymentSlice";
import dashboardSlice from "./seller/dashboardSlice";

import homeCategorySlice from "./admin/adminSlice";
import customerSlice from "./customer/customerSlice";
import analysisSlice from "./customer/analysisSlice";
import reviewSlice from "./customer/reviewSlice";
import chatbotSlice from "./customer/chatbotSlice";
import chatSlice from "./customer/chatSlice";

import couponSlice from "./admin/adminCouponSlice";
import categorySlice from "./admin/adminCategorySlice";
import adminProductSlice from "./admin/adminProduct";
import adminUserSlice from "./admin/adminUserSlice";
const rootReducer = combineReducers({
  seller: sellerSlice,
  sellerProduct: sellerProductSlice,
  product: productSlice,
  auth: authSlice,
  cart: cartSlice,
  order: orderSlice,
  wishlist: wishlistSlice,
  customer: customerSlice,
  address: addressSlice,
  customerAnalysis: analysisSlice,
  review: reviewSlice,
  chatbot: chatbotSlice,
  chatSlice: chatSlice,
  //seller
  sellerOrder: sellerOrderSlice,
  transaction: transactionSlice,
  payment: paymentSlice,
  dashboard: dashboardSlice,
  //admin
  admin: homeCategorySlice,
  coupon: couponSlice,
  category: categorySlice,
  adminProduct: adminProductSlice,
  adminUser: adminUserSlice,
});
const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof rootReducer>;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
