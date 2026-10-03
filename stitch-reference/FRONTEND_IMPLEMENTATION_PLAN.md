# Neeramoy Frontend Implementation Plan

This document outlines the complete implementation roadmap for the Neeramoy React + Vite frontend. It builds upon the established foundation and the Stitch visual reference (documented in \`DESIGN_SYSTEM.md\`).

## Phase 1: Core Customer Shopping Flow

### 1. Home Page
*   **Route:** \`/\`
*   **Purpose:** Main entry point showcasing trust, quick actions, categories, and top-selling medicines.
*   **Major Sections:** Hero (Rx upload widget, trust stats), Benefits/Pillars, Categories Grid, Top Selling Products, Footer.
*   **Important Components:** \`MedicineCard\`, \`Button\`, \`Badge\`, \`Navbar\`, \`Footer\`.
*   **Required Mock Data:** \`topSellingMedicines\`, \`categories\`.
*   **Design Source:** Stitch Screen (\`neeramoy_online_medicine_healthcare_marketplace\`).
*   **Dependencies:** Foundation components (\`Button\`, \`MedicineCard\`).

### 2. Search Results & Category Listing
*   **Route:** \`/search\`, \`/category/:id\`
*   **Purpose:** Browse medicines by category, generic name, or search term with filtering capabilities.
*   **Major Sections:** Search/Filter Sidebar (Price, Brand, Form), Results Grid, Pagination.
*   **Important Components:** \`MedicineCard\`, \`FilterSidebar\`, \`Pagination\`.
*   **Required Mock Data:** \`searchResults\`, \`filterOptions\` (Brands, Generic names).
*   **Design Source:** Stitch Screen (\`medicine_catalog_search_results_neeramoy\`).
*   **Dependencies:** Home Page (for search input integration), \`MedicineCard\`.

### 3. Product Details Page (PDP)
*   **Route:** \`/product/:id\`
*   **Purpose:** Detailed view of a specific medicine/product, showing indications, dosages, and add-to-cart functionality.
*   **Major Sections:** Product Image Gallery, Key Details (Price, Rx requirement, Brand), Description/Indications tabs, Related Products.
*   **Important Components:** \`QuantitySelector\`, \`Tabs\`, \`Breadcrumbs\`.
*   **Required Mock Data:** \`productDetails\` (including extensive text for descriptions/side effects).
*   **Design Source:** Stitch Screen (\`sergel_20mg_capsule_neeramoy_pharmacy\`).
*   **Dependencies:** \`MedicineCard\` (for related products).

### 4. Shopping Cart
*   **Route:** \`/cart\`
*   **Purpose:** Review selected items, adjust quantities, apply promo codes, and see order summary.
*   **Major Sections:** Cart Item List, Order Summary (Subtotal, Delivery, Discount, Total), Proceed to Checkout action.
*   **Important Components:** \`CartItem\`, \`OrderSummaryCard\`.
*   **Required Mock Data:** \`cartItems\`, \`promoCodes\`.
*   **Design Source:** Stitch Screen (\`shopping_cart_4_items_neeramoy\`).
*   **Dependencies:** Product Details (for adding items to cart).

### 5. Checkout Page
*   **Route:** \`/checkout\`
*   **Purpose:** Collect delivery address, payment method, and finalize the order.
*   **Major Sections:** Delivery Address Form, Payment Selection (bKash, Nagad, COD), Final Order Summary.
*   **Important Components:** \`Input\`, \`RadioGroup\` (for payment), \`AddressCard\`.
*   **Required Mock Data:** \`savedAddresses\`, \`paymentMethods\`.
*   **Design Source:** Established Design System (Requires utilizing existing tokens, inputs, and card styles).
*   **Dependencies:** Shopping Cart.

### 6. Order Confirmation
*   **Route:** \`/order-success/:orderId\`
*   **Purpose:** Confirm successful order placement and provide tracking/status info.
*   **Major Sections:** Success Message/Icon, Order Number, Estimated Delivery Time, Action to view order details.
*   **Important Components:** \`Card\`, \`Button\`.
*   **Required Mock Data:** \`orderConfirmationInfo\`.
*   **Design Source:** Established Design System.
*   **Dependencies:** Checkout Page.

---

## Phase 2: Authentication & Account Management

### 7. Login / Registration
*   **Route:** \`/login\`, \`/register\` (or implemented as a global Modal)
*   **Purpose:** User authentication using OTP or Password.
*   **Major Sections:** Phone Number Input, OTP Verification, Welcome Back messaging.
*   **Important Components:** \`Modal\` (if overlay), \`Input\`, \`Button\`.
*   **Required Mock Data:** \`userProfile\`.
*   **Design Source:** Stitch Screen (\`neeramoy_online_medicine_healthcare_guest_home\` for guest context) / Design System for forms.
*   **Dependencies:** Navbar (Trigger).

### 8. User Dashboard / Account
*   **Route:** \`/account\`
*   **Purpose:** Overview of user's profile, recent activity, and quick links.
*   **Major Sections:** Profile Summary, Saved Addresses, Recent Orders preview.
*   **Important Components:** \`SidebarNav\` (Account context), \`AddressCard\`.
*   **Required Mock Data:** \`userProfile\`, \`savedAddresses\`.
*   **Design Source:** Established Design System.
*   **Dependencies:** Authentication.

### 9. User Orders History & Details
*   **Route:** \`/account/orders\`, \`/account/orders/:id\`
*   **Purpose:** Track current orders and review past purchases.
*   **Major Sections:** Order List (Status badges), Order Details (Items, Timeline/Tracking).
*   **Important Components:** \`OrderHistoryCard\`, \`StatusBadge\`, \`TimelineElement\`.
*   **Required Mock Data:** \`orderHistory\`.
*   **Design Source:** Established Design System.
*   **Dependencies:** Account Dashboard.

---

## Phase 3: Prescription Flow

### 10. Prescription Upload & Management
*   **Route:** \`/prescription\`
*   **Purpose:** Dedicated page to upload Rx, view previously uploaded prescriptions, and request pharmacist review.
*   **Major Sections:** Drag-and-drop Upload Zone, Upload History List, Guidelines/Disclaimers.
*   **Important Components:** \`FileUploadZone\`, \`DocumentCard\`.
*   **Required Mock Data:** \`pastPrescriptions\`.
*   **Design Source:** Established Design System (incorporating the quick-upload widget design from the Home Page).
*   **Dependencies:** Core UI components.

---

## Phase 4: Admin / Pharmacy Portal

### 11. Admin Dashboard
*   **Route:** \`/admin\`
*   **Purpose:** High-level overview of pharmacy operations.
*   **Major Sections:** Key Metrics (Pending Orders, Pending Prescriptions, Revenue, Low Stock Alerts), Activity Chart.
*   **Important Components:** \`StatCard\`, \`ChartWidget\` (mocked), \`RecentActivityList\`.
*   **Required Mock Data:** \`adminStats\`, \`recentActivity\`.
*   **Design Source:** Established Design System (utilizing \`AdminLayout\`).
*   **Dependencies:** \`AdminLayout\` (Foundation).

### 12. Admin Prescriptions Review
*   **Route:** \`/admin/prescriptions\`
*   **Purpose:** Pharmacist interface to review, approve, or reject user-uploaded prescriptions.
*   **Major Sections:** Pending Rx List, Rx Detail View (Image viewer + approval actions).
*   **Important Components:** \`DataTable\`, \`ImageViewer\`, \`ActionButtons\` (Approve/Reject).
*   **Required Mock Data:** \`pendingPrescriptions\`.
*   **Design Source:** Established Design System.
*   **Dependencies:** Admin Dashboard.

### 13. Admin Order Management
*   **Route:** \`/admin/orders\`
*   **Purpose:** Track, update, and fulfill customer orders.
*   **Major Sections:** Order List with Status Filters (Processing, Shipped, Delivered), Order Detail/Fulfillment View.
*   **Important Components:** \`DataTable\`, \`StatusSelectDropdown\`.
*   **Required Mock Data:** \`adminOrders\`.
*   **Design Source:** Established Design System.
*   **Dependencies:** Admin Dashboard.

### 14. Admin Inventory
*   **Route:** \`/admin/inventory\`
*   **Purpose:** Manage medicine stock, price updates, and add new products.
*   **Major Sections:** Inventory List, Add/Edit Product Modal, Out-of-Stock Alerts.
*   **Important Components:** \`DataTable\`, \`ProductForm\`.
*   **Required Mock Data:** \`adminInventory\`.
*   **Design Source:** Established Design System.
*   **Dependencies:** Admin Dashboard.

---

## Phase 5: Secondary Pages, QA & Deployment Readiness

### 15. Static Pages (Policies, About)
*   **Routes:** \`/about\`, \`/privacy-policy\`, \`/terms\`
*   **Purpose:** Legal and company information.
*   **Design Source:** Established Design System (Standard text layout).

### 16. Responsive QA & Polish
*   **Activities:** 
    *   Verify mobile viewports (hamburger menus, horizontal scroll categories).
    *   Ensure all hover states and transitions are smooth.
    *   Verify empty states (e.g., empty cart, no search results).

### 17. Production & Backend Integration Readiness
*   **Activities:**
    *   Finalize the \`apiClient.js\` structure mapping mock services to actual expected Spring Boot endpoints.
    *   Ensure strict separation between mocked data structures and UI components so replacement with real API responses is seamless.
    *   Run final \`npm run build\` and bundle size check.
