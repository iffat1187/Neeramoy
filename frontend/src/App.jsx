import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CustomerLayout } from './components/layout/CustomerLayout';
import { AdminLayout } from './components/layout/AdminLayout';
import { PlaceholderPage } from './pages/PlaceholderPage';
import { LandingPage } from './pages/LandingPage';
import { SearchResultsPage } from './pages/SearchResultsPage';
import { ProductDetailsPage } from './pages/ProductDetailsPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<CustomerLayout />}>
              <Route index element={<LandingPage />} />
              <Route path="category/:id" element={<SearchResultsPage />} />
              <Route path="product/:id" element={<ProductDetailsPage />} />
              <Route path="cart" element={<CartPage />} />
              <Route path="checkout" element={<CheckoutPage />} />
              <Route path="order-confirmation" element={<OrderConfirmationPage />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
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
    </AuthProvider>
  );
}

export default App;
