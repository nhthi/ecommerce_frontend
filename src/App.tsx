import { ThemeProvider } from "@mui/material";
import "./App.css";
import Navbar from "./customer/components/Navbar/Navbar";
import customeTheme from "./Theme/customeTheme";
import Home from "./customer/pages/Home/Home";
import Product from "./customer/pages/Product/Product";
import PageDetails from "./customer/pages/Page Details/PageDetails";
import Cart from "./customer/pages/Cart/Cart";
import Checkout from "./customer/pages/Checkout/Checkout";
import Account from "./customer/pages/Account/Account";
import { Route, Routes, useParams } from "react-router-dom";
import Review from "./customer/pages/Home/Review/Review";
import BecomeSeller from "./customer/pages/BecomeSeller/BecomeSeller";
import SellerDashboard from "./seller/pages/SellerDashboard/SellerDashboard";
import AdminDashboard from "./admin/pages/Dashboard/Dashboard";
import NotFound from "./customer/pages/NotFound/NotFound";
import Auth from "./customer/pages/Auth/Auth";
import PaymentSuccess from "./customer/pages/PaymentSuccess";
import Wishlist from "./customer/pages/Wishlist/Wishlist";
import TryOn from "./test/test";
import OrderSuccess from "./customer/pages/Checkout/OrderSuccess";
import SearchProduct from "./customer/pages/Product/SearchProduct";
import ScrollToTop from "./customer/components/ScrollToTop/ScrollToTop";
import ChatBotWidget from "./customer/components/ChatBot/ChatBotWidget";
import Message from "./customer/pages/Message/Message";
import { useAppSelector } from "./state/Store";
import SellerStorePage from "./customer/pages/SellerProduct/SellerStorePage";

function App() {
  const { seller, auth } = useAppSelector((store) => store);
  return (
    <div className="App">
      <ThemeProvider theme={customeTheme}>
        <div>
          <Navbar />
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/store/:sellerId" element={<SellerStorePage />} />
            <Route path="/test" element={<TryOn />} />
            <Route path="/login" element={<Auth />} />
            <Route path="/message" element={<Message />} />
            <Route path="/message" element={<Message />} />
            <Route path="/products/:category" element={<Product />} />
            <Route
              path="/product-details/:categoryId/:name/:productId"
              element={<PageDetails />}
            />
            <Route path="/cart" element={<Cart />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/ordersuccess" element={<OrderSuccess />} />
            <Route
              path="/payment-success/:orderId"
              element={<PaymentSuccess />}
            />
            <Route path="/become-seller" element={<BecomeSeller />} />
            <Route path="/search" element={<SearchProduct />} />

            <Route path="/account/*" element={<Account />} />
            <Route
              path="/seller/*"
              element={seller.profile ? <SellerDashboard /> : <NotFound />}
            />
            <Route
              path="/admin/*"
              element={
                auth.user?.role === "ROLE_ADMIN" ? (
                  <AdminDashboard />
                ) : (
                  <NotFound />
                )
              }
            />
            <Route path="/*" element={<NotFound />} />
          </Routes>
          <ChatBotWidget />
        </div>
      </ThemeProvider>
    </div>
  );
}

export default App;
