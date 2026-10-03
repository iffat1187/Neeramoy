import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CustomerLayout } from './components/layout/CustomerLayout';
import { AdminLayout } from './components/layout/AdminLayout';
import { PlaceholderPage } from './pages/PlaceholderPage';
import { LandingPage } from './pages/LandingPage';
import { SearchResultsPage } from './pages/SearchResultsPage';
import { ProductDetailsPage } from './pages/ProductDetailsPage';
import { CartProvider } from './context/CartContext';

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<CustomerLayout />}>
            <Route index element={<LandingPage />} />
            <Route path="category/:id" element={<SearchResultsPage />} />
            <Route path="product/:id" element={<ProductDetailsPage />} />
            <Route path="cart" element={<PlaceholderPage title="Shopping Cart" />} />
            <Route path="checkout" element={<PlaceholderPage title="Checkout" />} />
            <Route path="login" element={<PlaceholderPage title="Login / Authentication" />} />
            <Route path="search" element={<SearchResultsPage />} />
          </Route>

          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<PlaceholderPage title="Admin Dashboard" />} />
            <Route path="prescriptions" element={<PlaceholderPage title="Prescription Review" />} />
            <Route path="orders" element={<PlaceholderPage title="Order Management" />} />
            <Route path="inventory" element={<PlaceholderPage title="Inventory Management" />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
