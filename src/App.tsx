import "./App.css";
import Navbar from "./customer/components/Navbar/Navbar";
import Home from "./customer/pages/Home/Home";
import Product from "./customer/pages/Product/Product";
import PageDetails from "./customer/pages/Page Details/PageDetails";
import Cart from "./customer/pages/Cart/Cart";
import Checkout from "./customer/pages/Checkout/Checkout";
import Account from "./customer/pages/Account/Account";
import { Route, Routes } from "react-router-dom";
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
import Training from "./customer/pages/Training/Training";
import TrainingDetail from "./customer/pages/Training/TrainingDetail";
import Delivery from "./customer/pages/Policy/Delivery";
import Payment from "./customer/pages/Policy/Payment";
import Exchange from "./customer/pages/Policy/Exchange";
import Faq from "./customer/pages/Policy/Faq";
import Blog from "./customer/pages/Blog/Blog";
import BlogDetail from "./customer/pages/Blog/BlogDetail";
import SiteThemeProvider from "./Theme/SiteThemeProvider";

function App() {
  const { seller, auth } = useAppSelector((store) => store);

  return (
    <div className="App">
      <SiteThemeProvider>
        <div className="app-shell">
          <Navbar />
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/store/:sellerId" element={<SellerStorePage />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogDetail />} />
            <Route path="/training" element={<Training />} />
            <Route path="/training/:slug" element={<TrainingDetail />} />
            <Route path="/policy/delivery" element={<Delivery />} />
            <Route path="/policy/payment" element={<Payment />} />
            <Route path="/policy/exchange" element={<Exchange />} />
            <Route path="/policy/faq" element={<Faq />} />
            <Route path="/test" element={<TryOn />} />
            <Route path="/login" element={<Auth />} />
            <Route path="/message" element={<Message />} />
            <Route path="/products/:category" element={<Product />} />
            <Route path="/product-details/:name/:productId" element={<PageDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/ordersuccess" element={<OrderSuccess />} />
            <Route path="/payment-success/:orderId" element={<PaymentSuccess />} />
            <Route path="/become-seller" element={<BecomeSeller />} />
            <Route path="/search" element={<SearchProduct />} />
            <Route path="/account/*" element={<Account />} />
            <Route path="/seller/*" element={seller.profile ? <SellerDashboard /> : <NotFound />} />
            <Route path="/admin/*" element={(auth.user?.role === "ROLE_ADMIN" || auth.user?.role === "ROLE_STAFF") ? <AdminDashboard /> : <NotFound />} />
            <Route path="/*" element={<NotFound />} />
          </Routes>
          <ChatBotWidget />
        </div>
      </SiteThemeProvider>
    </div>
  );
}

export default App;
