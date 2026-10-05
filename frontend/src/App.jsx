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
import { OrderProvider } from './context/OrderContext';
import { OrdersPage } from './pages/OrdersPage';
import { OrderDetailsPage } from './pages/OrderDetailsPage';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { AccountLayout } from './components/layout/AccountLayout';
import { DashboardPage } from './pages/account/DashboardPage';
import { ProfilePage } from './pages/account/ProfilePage';
import { EditProfilePage } from './pages/account/EditProfilePage';
import { AddressesPage } from './pages/account/AddressesPage';
import { PrescriptionsPage } from './pages/account/PrescriptionsPage';

function App() {
  return (
    <AuthProvider>
      <OrderProvider>
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
              
              {/* Account Routes */}
              <Route path="account" element={<ProtectedRoute><AccountLayout /></ProtectedRoute>}>
                <Route index element={<DashboardPage />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="profile/edit" element={<EditProfilePage />} />
                <Route path="addresses" element={<AddressesPage />} />
              </Route>
              
              {/* Prescriptions under AccountLayout too, per Account Integration instructions */}
              <Route path="prescriptions" element={<ProtectedRoute><AccountLayout /></ProtectedRoute>}>
                <Route index element={<PrescriptionsPage />} />
              </Route>

              <Route path="orders" element={<OrdersPage />} />
              <Route path="orders/:orderId" element={<OrderDetailsPage />} />
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
      </OrderProvider>
    </AuthProvider>
  );
}

export default App;
