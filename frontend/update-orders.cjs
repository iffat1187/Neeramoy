const fs = require('fs');
const path = require('path');

// Update App.jsx
const appPath = path.join('D:\\Neeramoy\\frontend', 'src/App.jsx');
let appContent = fs.readFileSync(appPath, 'utf8');

if (!appContent.includes('OrderProvider')) {
  appContent = appContent.replace(
    "import { AuthProvider } from './context/AuthContext';",
    "import { AuthProvider } from './context/AuthContext';\nimport { OrderProvider } from './context/OrderContext';\nimport { OrdersPage } from './pages/OrdersPage';\nimport { OrderDetailsPage } from './pages/OrderDetailsPage';"
  );

  appContent = appContent.replace(
    "<AuthProvider>\n      <CartProvider>",
    "<AuthProvider>\n      <OrderProvider>\n      <CartProvider>"
  );

  appContent = appContent.replace(
    "</CartProvider>\n    </AuthProvider>",
    "</CartProvider>\n      </OrderProvider>\n    </AuthProvider>"
  );

  appContent = appContent.replace(
    '<Route path="search" element={<SearchResultsPage />} />',
    '<Route path="search" element={<SearchResultsPage />} />\n              <Route path="orders" element={<OrdersPage />} />\n              <Route path="orders/:orderId" element={<OrderDetailsPage />} />'
  );

  fs.writeFileSync(appPath, appContent);
}

// Update CheckoutPage.jsx
const checkoutPath = path.join('D:\\Neeramoy\\frontend', 'src/pages/CheckoutPage.jsx');
let checkoutContent = fs.readFileSync(checkoutPath, 'utf8');

if (!checkoutContent.includes('useOrder')) {
  checkoutContent = checkoutContent.replace(
    "import { useAuth } from '../context/AuthContext';",
    "import { useAuth } from '../context/AuthContext';\nimport { useOrder } from '../context/OrderContext';"
  );

  checkoutContent = checkoutContent.replace(
    "const { isLoggedIn, user } = useAuth();",
    "const { isLoggedIn, user } = useAuth();\n  const { addOrder } = useOrder();"
  );

  checkoutContent = checkoutContent.replace(
    "// Navigate to order confirmation and pass state",
    "// Store order globally and navigate to confirmation\n      addOrder(orderDetails);"
  );

  fs.writeFileSync(checkoutPath, checkoutContent);
}

console.log('App and Checkout updated.');
