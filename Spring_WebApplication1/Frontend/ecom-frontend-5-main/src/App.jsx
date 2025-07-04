import React, { useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Cart from "./components/Cart";
import AddProduct from "./components/AddProduct";
import Product from "./components/Product";
import UpdateProduct from "./components/UpdateProduct";
import Checkout from "./components/Checkout"; // ✅ Add this import
import { AppProvider } from "./Context/Context";
import 'bootstrap/dist/css/bootstrap.min.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Footer from "./components/Footer";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


function MainLayout({ selectedCategory }) {
    const location = useLocation();
    const hideFooterOn = ["/"];
    const shouldShowFooter = !hideFooterOn.includes(location.pathname);

    return (
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            <Navbar onSelectCategory={selectedCategory.set} />
            <div style={{ flex: 1 }}>
                <Routes>
                    <Route path="/" element={<Home selectedCategory={selectedCategory.value} />} />
                    <Route path="/add_product" element={<AddProduct />} />
                    <Route path="/product" element={<Product />} />
                    <Route path="/product/:id" element={<Product />} />
                    <Route path="/product/update/:id" element={<UpdateProduct />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout" element={<Checkout />} /> {/* ✅ This was missing */}
                </Routes>
            </div>
            {shouldShowFooter && <Footer />}
        </div>
    );
}

function App() {
    const [selectedCategory, setSelectedCategory] = useState("");

    return (
        <AppProvider>
            <BrowserRouter>
                <MainLayout selectedCategory={{ value: selectedCategory, set: setSelectedCategory }} />
            </BrowserRouter>
        </AppProvider>
    );
}

export default App;
