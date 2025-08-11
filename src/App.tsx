import { ThemeProvider } from "@mui/material";
import "./App.css";
import Navbar from "./customer/components/Navbar/Navbar";
import customeTheme from "./Theme/customeTheme";
import Home from "./customer/pages/Home/Home";
import Product from "./customer/pages/Product/Product";
import PageDetails from "./customer/pages/Page Details/PageDetails";
import Cart from "./customer/pages/Cart/Cart";
import Checkout from "./customer/pages/Checkout/Checkout";

function App() {
  return (
    <div className="App">
      <ThemeProvider theme={customeTheme}>
        <div>
          <Navbar />
          {/* <Home /> */}
          {/* <Product /> */}
          {/* <PageDetails /> */}
          {/* <Cart /> */}
          <Checkout />
        </div>
      </ThemeProvider>
    </div>
  );
}

export default App;
