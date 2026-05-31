import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ShopProvider } from "./context/ShopContext";
import { Header } from "./components/Layout/Header";
import { Navigation } from "./components/Layout/Navigation";
import { Cart } from "./components/Cart/Cart";
import { HomePage } from "./pages/HomePage";
import { ProductsPage } from "./pages/ProductsPage";
import { ProductPage } from "./pages/ProductPage";
import { CartPage } from "./pages/CartPage";
import { CheckoutPage } from "./pages/CheckoutPage";
import { OrderHistoryPage } from "./pages/OrderHistoryPage";

export default function App() {
  return (
    <ShopProvider>
      <BrowserRouter>
        <Header />
        <Navigation />
        <Cart />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/orders" element={<OrderHistoryPage />} />
        </Routes>
      </BrowserRouter>
    </ShopProvider>
  );
}
