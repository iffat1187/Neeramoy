# Neeramoy Product Requirements Document (PRD)

**Product Name:** Neeramoy
**Product Type:** Online Medicine & Healthcare Marketplace
**Project Type:** AReal-World E-commerce Application
**Primary Inspiration:** Arogga-style online medicine marketplace
**Target Market:** Bangladesh
**Primary Users:** Customers, Pharmacy Staff, Administrators
**Payment:** Cash on Delivery + bKash
**Primary Database:** MongoDB
**Image Storage:** Cloudinary

---

# 1. Product Overview

## 1.1 Vision

Neeramoy is a modern online medicine and healthcare marketplace that allows customers to discover medicines and healthcare products, view detailed product information, upload prescriptions when required, add products to a cart, place orders, make payments through Cash on Delivery or bKash, and track their orders.

The platform will also provide an administrative system for managing products, categories, inventory, customers, prescriptions, orders, payments, reviews, and business analytics.

Neeramoy is an **original academic project inspired by the functionality and general experience of established online medicine marketplaces such as Arogga**. It will use its own branding, UI design, content, assets, and implementation.

---

# 2. Problem Statement

Traditional medicine purchasing can require customers to physically visit pharmacies, search across multiple stores for products, and manually communicate prescription information.

Neeramoy aims to provide a centralized digital platform where customers can:

* Discover medicines online.
* Search for healthcare products.
* Compare product information and prices.
* Check product availability.
* Upload prescriptions when required.
* Order medicines from home.
* Pay through bKash or Cash on Delivery.
* Track order status.
* Manage their account, addresses, orders, and wishlist.

For administrators and pharmacy staff, the system provides centralized management of products, inventory, prescriptions, orders, customers, payments, and reviews.

---

# 3. Product Goals

## 3.1 Primary Goals

Neeramoy must:

1. Provide a modern online medicine shopping experience.
2. Allow customers to search and browse medicines efficiently.
3. Provide detailed product information.
4. Support cart and checkout functionality.
5. Support Cash on Delivery.
6. Integrate bKash payment into the checkout process.
7. Support prescription-required medicines.
8. Allow customers to upload prescriptions.
9. Allow authorized staff/admins to review prescriptions.
10. Provide order tracking.
11. Provide customer order history.
12. Provide product reviews and ratings.
13. Provide wishlist functionality.
14. Provide inventory management.
15. Provide an administration dashboard.
16. Provide responsive web interfaces for desktop, tablet, and mobile.
17. Provide a secure authentication and authorization system.
18. Be deployable as a separate frontend and backend.

---

# 4. Target Users

## 4.1 Customer

A customer is a user who wants to browse, purchase, and receive medicines or healthcare products.

Customer capabilities include:

* Registration
* Login/logout
* Product browsing
* Search
* Filtering
* Product details
* Wishlist
* Cart
* Address management
* Prescription upload
* Checkout
* bKash payment
* Cash on Delivery
* Order tracking
* Order history
* Reviews
* Profile management

---

## 4.2 Pharmacy Staff

Pharmacy staff are authorized employees who assist with operational activities.

Staff capabilities may include:

* Login
* View assigned orders
* Process orders
* Check inventory
* Update stock
* Review prescriptions
* Update order status
* View relevant customer/order information

Staff must not have unrestricted administrative permissions.

---

## 4.3 Administrator

Administrators manage the complete platform.

Admin capabilities include:

* Dashboard
* Product management
* Category management
* Brand management
* Inventory management
* Order management
* Customer management
* Pharmacy staff management
* Prescription management
* Payment monitoring
* Coupon management
* Review moderation
* Sales analytics
* Low-stock monitoring
* Platform configuration

---

# 5. User Roles

The system will initially support:

```text
CUSTOMER
ADMIN
PHARMACY_STAFF
```

Authorization must be role-based.

Customers must not access administrative functionality.

Pharmacy staff must only access features permitted to their operational role.

Administrators have full management privileges.

---

# 6. Customer Features

## 6.1 Registration

Customers can create an account using:

* Name
* Email
* Phone number
* Password

The system must validate registration data.

Passwords must never be stored as plain text.

---

# 7. Authentication

Customers, administrators, and pharmacy staff must be able to securely authenticate.

The system should support:

* Login
* Logout
* JWT-based authentication
* Role-based authorization
* Password hashing
* Protected API endpoints

Authentication implementation details will be defined separately in the Technical Requirements Document.

---

# 8. Homepage

The homepage should provide an attractive healthcare-focused shopping experience.

The homepage may contain:

* Navigation bar
* Search bar
* Categories
* Promotional banner
* Featured products
* Popular products
* New products
* Healthcare categories
* Prescription medicine section
* Promotional offers
* Trust/security information
* Delivery information
* Footer

The homepage must be responsive.

---

# 9. Product Categories

Products should be organized into categories.

Examples:

* Medicine
* Vitamins & Supplements
* Personal Care
* Baby Care
* Medical Devices
* Diabetes Care
* Skin Care
* Sexual Wellness
* First Aid
* Healthcare Equipment

Categories may be modified by administrators.

---

# 10. Product Catalog

Customers can browse available products.

Each product should provide relevant information such as:

* Product name
* Generic name
* Brand
* Category
* Description
* Price
* Discount price
* Stock availability
* Product images
* Dosage/form information where applicable
* Manufacturer
* Prescription requirement
* Rating
* Review count

The product catalog must support pagination.

---

# 11. Product Search

Customers can search products by relevant terms such as:

* Product name
* Generic name
* Brand
* Category

Search should provide useful results even when the catalog contains a large number of products.

Search functionality may later be enhanced using Redis caching and Spring AI.

---

# 12. Product Filtering and Sorting

Customers should be able to filter products using relevant attributes.

Possible filters:

* Category
* Brand
* Price range
* Availability
* Prescription requirement
* Rating

Sorting options may include:

* Price: Low to High
* Price: High to Low
* Newest
* Popularity
* Rating

---

# 13. Product Details

The product details page must provide comprehensive product information.

The page should contain:

* Product image gallery
* Product name
* Brand
* Generic name
* Price
* Discount
* Availability
* Description
* Relevant medicine information
* Prescription requirement
* Quantity selector
* Add to Cart
* Add to Wishlist
* Rating
* Customer reviews
* Related products

If a product requires a prescription, the UI must clearly communicate that requirement.

---

# 14. Shopping Cart

Customers can add products to their cart.

The cart must support:

* Add product
* Remove product
* Increase quantity
* Decrease quantity
* View subtotal
* View applicable discount
* View delivery fee
* View final total

The backend must recalculate prices during checkout rather than trusting prices submitted by the frontend.

---

# 15. Wishlist

Customers can save products for later.

Wishlist functionality:

* Add product
* Remove product
* View saved products
* Move product to cart

---

# 16. Address Management

Customers can manage delivery addresses.

An address may contain:

* Recipient name
* Phone number
* Division
* District
* Area
* Address line
* Postal code
* Address type

Possible address types:

* Home
* Office
* Other

Customers can:

* Add address
* Edit address
* Delete address
* Select default address
* Select an address during checkout

---

# 17. Prescription Management

Certain medicines may require a valid prescription.

Products must contain a prescription requirement indicator.

For example:

```text
requiresPrescription = true
```

If a cart contains a prescription-required product, the checkout flow must require the customer to provide an appropriate prescription before order processing.

Prescription workflow:

```text
Customer
   ↓
Adds prescription-required medicine
   ↓
Checkout
   ↓
Upload prescription
   ↓
Prescription stored
   ↓
Staff/Admin review
   ↓
APPROVED / REJECTED
   ↓
Order processing
```

Prescription statuses:

```text
PENDING
APPROVED
REJECTED
```

The system must not automatically approve prescriptions.

---

# 18. Prescription Upload

Customers can upload prescription images/documents through the application.

Prescription storage should use secure external file storage.

The system should store metadata such as:

* Prescription ID
* Customer ID
* File URL
* File identifier
* Upload timestamp
* Status
* Reviewer
* Review timestamp
* Rejection reason when applicable

Prescription files must not be stored directly inside MongoDB as binary data.

---

# 19. Checkout

Checkout should provide a clear multi-step or well-organized process.

Suggested flow:

```text
Cart
 ↓
Delivery Address
 ↓
Prescription Check
 ↓
Order Summary
 ↓
Payment Method
 ↓
Payment
 ↓
Order Confirmation
```

Checkout must display:

* Products
* Quantities
* Subtotal
* Discount
* Delivery fee
* Total amount
* Delivery address
* Payment method

---

# 20. Payment Methods

Neeramoy will initially support:

### Cash on Delivery

The customer places the order and pays upon delivery.

### bKash

Customers can pay digitally through bKash.

The bKash integration must be implemented using the appropriate official bKash merchant/payment integration and credentials.

Payment credentials must be stored securely using environment variables and must never be committed to GitHub.

Payment processing must maintain a payment status separate from order status.

Possible payment statuses:

```text
PENDING
PROCESSING
PAID
FAILED
CANCELLED
REFUNDED
```

The exact bKash API workflow, authentication mechanism, callback/execute flow, transaction verification, and credentials will be specified in the technical/API documentation.

---

# 21. Order Management

After checkout, the system creates an order.

An order should contain:

* Order ID
* Customer
* Ordered products
* Quantities
* Product prices
* Shipping address
* Subtotal
* Delivery fee
* Discount
* Total amount
* Payment method
* Payment status
* Order status
* Created timestamp
* Updated timestamp

Order statuses:

```text
PLACED
CONFIRMED
PROCESSING
SHIPPED
DELIVERED
CANCELLED
```

---

# 22. Order Tracking

Customers should be able to view the current status of their orders.

Example:

```text
✓ Order Placed
      ↓
✓ Confirmed
      ↓
✓ Processing
      ↓
○ Shipped
      ↓
○ Delivered
```

The interface should visually communicate the current stage.

---

# 23. Order Cancellation

Customers may request cancellation according to the order's current state.

The system must prevent cancellation when the order has reached a state where cancellation is no longer permitted.

Administrators/staff should be able to manage cancellation requests.

---

# 24. Customer Order History

Customers can view:

* Previous orders
* Current orders
* Order details
* Payment status
* Order status
* Purchased products
* Total amount

Customers should be able to open an individual order to see its details.

---

# 25. Reviews and Ratings

Customers should be able to review products they have purchased.

A review may contain:

* Rating from 1–5
* Comment
* Optional image
* Customer
* Product
* Creation date

Review eligibility should preferably be linked to completed/delivered purchases.

Administrators should be able to moderate reviews.

Possible review statuses:

```text
PENDING
APPROVED
REJECTED
```

---

# 26. Coupons and Discounts

The system may support promotional coupons.

Coupon properties may include:

* Coupon code
* Discount type
* Discount value
* Minimum order amount
* Maximum discount
* Start date
* Expiration date
* Usage limit
* Active/inactive status

The backend must validate coupon eligibility.

---

# 27. Inventory Management

The system must maintain product inventory.

Inventory information may include:

* Product ID
* Current stock
* Reserved stock
* Sold quantity
* Low-stock threshold
* Availability

The system should prevent customers from purchasing unavailable quantities.

Administrators should receive a low-stock indication.

---

# 28. Admin Dashboard

The admin dashboard should provide an overview of platform activity.

Possible dashboard information:

* Total orders
* Total customers
* Total products
* Total sales
* Pending orders
* Pending prescriptions
* Low-stock products
* Recent orders
* Recent customers
* Sales trends
* Order status distribution

Charts may be implemented using a frontend charting library.

---

# 29. Admin Product Management

Administrators can:

* Create products
* Edit products
* Delete/deactivate products
* Upload product images
* Update prices
* Configure discounts
* Configure stock
* Assign category
* Assign brand
* Mark prescription requirement
* Manage product information

Product images will be stored through Cloudinary.

---

# 30. Admin Category and Brand Management

Administrators can:

* Create categories
* Update categories
* Delete/deactivate categories
* Create brands
* Update brands
* Delete/deactivate brands

The system should prevent deletion when doing so would create invalid product references unless the relevant products are handled appropriately.

---

# 31. Admin Order Management

Administrators can:

* View orders
* Search orders
* Filter orders
* View order details
* Update order status
* View payment status
* Manage cancellations
* Review customer/order information

---

# 32. Pharmacy Staff Management

Administrators can manage pharmacy staff accounts.

Admin capabilities:

* Create staff account
* Activate/deactivate staff
* Assign operational permissions
* View staff information

Staff access must be restricted according to their role.

---

# 33. Prescription Verification Dashboard

Authorized staff/admins should have a dedicated prescription management interface.

The dashboard should display:

* Pending prescriptions
* Customer information
* Related order
* Prescription file
* Upload date
* Review status

Authorized staff can:

* Approve
* Reject
* Provide rejection reason

---

# 34. Customer Management

Administrators can:

* View customers
* Search customers
* View customer profile
* View customer order history
* Activate/deactivate accounts where appropriate

Sensitive customer information should only be visible to authorized users.

---

# 35. Notifications

The platform may provide notifications for important events.

Examples:

* Order placed
* Payment successful
* Payment failed
* Order confirmed
* Order shipped
* Order delivered
* Prescription approved
* Prescription rejected
* Promotional notification

Notification functionality can initially be implemented inside the application and expanded later.

---

# 36. Image Management

Cloudinary will be used for application images.

Image categories may include:

```text
neeramoy/
├── products/
├── categories/
├── brands/
├── banners/
├── prescriptions/
├── profiles/
└── reviews/
```

MongoDB will store image metadata such as:

* URL
* Public ID

Binary image data should not be stored in MongoDB.

---

# 37. Performance and Caching

Redis will be introduced as a caching layer.

Potential cache targets:

* Categories
* Brands
* Product details
* Featured products
* Popular products
* Selected search results

MongoDB remains the primary source of truth.

When relevant data changes, the corresponding cache must be invalidated or refreshed.

Redis is a performance layer and must not replace MongoDB as the primary database.

---

# 38. Security Requirements

The application must implement appropriate security controls.

Requirements include:

* Password hashing
* JWT authentication
* Role-based authorization
* Protected administrative endpoints
* Input validation
* Secure environment variables
* No credentials committed to Git
* Secure payment credential handling
* Secure prescription file handling
* Backend-side price validation
* Backend-side order validation
* Protection against unauthorized access
* Appropriate CORS configuration

---

# 39. Responsive Design

The application must support:

* Desktop
* Laptop
* Tablet
* Mobile

The mobile interface must not simply be a scaled-down desktop interface.

Important mobile experiences include:

* Navigation
* Search
* Product browsing
* Product details
* Cart
* Checkout
* Order tracking
* Customer profile

---

# 40. UI/UX Direction

Neeramoy should have an original modern healthcare-commerce identity rather than directly copying Arogga's visual design.

The design should communicate:

* Healthcare
* Trust
* Cleanliness
* Accessibility
* Professionalism
* Convenience

The design system will be developed separately and implemented using the frontend technology stack.

The UI/UX design will be prototyped using **Stitch** before the frontend implementation.

The Stitch designs should cover the major customer and administrative workflows.

---

# 41. Customer Application Screens

The initial UI/UX design should include:

### Public

* Home
* Product listing
* Search results
* Category page
* Product details
* Login
* Registration

### Customer

* Profile
* Edit profile
* Addresses
* Wishlist
* Cart
* Checkout
* Payment
* Order confirmation
* Orders
* Order details
* Order tracking
* Prescription upload
* Prescription history
* Reviews

---

# 42. Admin Application Screens

The initial admin UI/UX design should include:

* Admin login
* Dashboard
* Products
* Add product
* Edit product
* Categories
* Brands
* Inventory
* Orders
* Order details
* Customers
* Customer details
* Prescriptions
* Prescription review
* Reviews
* Coupons
* Staff
* Analytics

---

# 43. Payment Flow

The intended payment flow is:

```text
Customer
   ↓
Cart
   ↓
Checkout
   ↓
Select bKash
   ↓
Create payment
   ↓
bKash payment interface
   ↓
Customer completes payment
   ↓
Backend verifies payment
   ↓
Payment marked PAID
   ↓
Order confirmed
   ↓
Customer sees confirmation
```

The system must not mark an order as successfully paid merely because the frontend reports success.

Payment status must be confirmed by the backend using the appropriate payment-provider mechanism.

---

# 44. Cash on Delivery Flow

```text
Customer
   ↓
Checkout
   ↓
Select Cash on Delivery
   ↓
Place Order
   ↓
Order = PLACED
   ↓
Admin/Staff confirmation
   ↓
Processing
   ↓
Shipped
   ↓
Delivered
   ↓
Payment collected
```

---

# 45. Prescription + Payment Flow

For products requiring prescriptions:

```text
Product
   ↓
Add to Cart
   ↓
Checkout
   ↓
Prescription Required
   ↓
Upload Prescription
   ↓
Submit Order
   ↓
Prescription Review
   ↓
Approved
   ↓
Payment / Payment Verification
   ↓
Order Processing
```

The exact business rule for when bKash payment is captured relative to prescription approval should be finalized during the technical design phase.

---

# 46. Future AI Features

Spring AI and RAG are **not part of the initial critical-path implementation**.

They will be introduced after the core e-commerce system is stable.

Possible future features:

### Customer AI Assistant

* Product information assistance
* Store FAQ
* Delivery information
* Order status assistance
* Policy questions
* Product discovery

### Admin AI Assistant

* Inventory questions
* Order summaries
* Sales analytics assistance
* Product catalog assistance

AI must operate through controlled application services.

AI must not independently:

* Diagnose medical conditions
* Prescribe medicines
* Approve prescriptions
* Change customer orders
* Change inventory
* Execute financial operations without explicit authorization

---

# 47. Future RAG System

A future RAG system may use approved knowledge sources such as:

* Neeramoy FAQs
* Delivery policies
* Return policies
* Prescription policies
* Product information
* Approved healthcare information

The RAG system must retrieve information from approved sources rather than relying solely on generated responses.

---

# 48. Non-Functional Requirements

## Performance

The application should provide responsive page and API interactions under normal expected academic/demo workloads.

Redis caching should reduce repeated database reads for suitable read-heavy endpoints.

## Scalability

The backend architecture should allow future expansion without requiring a complete rewrite.

## Availability

The deployed application should remain accessible through the frontend and backend deployment platforms.

## Maintainability

The backend should use a clear layered architecture.

```text
Controller
    ↓
Service
    ↓
Repository
    ↓
MongoDB
```

Supporting components such as Redis, Cloudinary, authentication, and payment services should have clearly separated responsibilities.

## Security

Authentication, authorization, payment credentials, customer information, and prescription information must be handled securely.

---

# 49. Technology Direction

## Frontend

* React
* Vite
* Tailwind CSS
* Responsive UI
* REST API integration

## Backend

* Java 25
* Spring Boot 4.x
* Spring Web
* Spring Data MongoDB
* Spring Security
* JWT
* Validation

## Database

* MongoDB Atlas

## Cache

* Redis

## Image/File Storage

* Cloudinary

## Payment

* bKash
* Cash on Delivery

## Testing

* JUnit
* Mockito
* Spring Boot Test
* Postman/API testing

## Deployment

Frontend:

```text
Vercel or Netlify
```

Backend:

```text
Render
```

Database:

```text
MongoDB Atlas
```

Cache:

```text
Redis Cloud or another compatible hosted Redis service
```

---

# 50. MVP Scope

Because this is an academic project with a limited implementation timeline, the following features are the **MUST-HAVE MVP**.

## Must Have

* Customer registration/login
* JWT authentication
* Role-based authorization
* Homepage
* Categories
* Product catalog
* Product search
* Product filtering
* Product details
* Cloudinary product images
* Cart
* Address management
* Checkout
* Cash on Delivery
* bKash payment integration
* Orders
* Order status
* Admin product management
* Admin category management
* Admin order management
* Inventory
* Prescription upload
* Prescription review
* Responsive UI
* MongoDB Atlas
* Deployment

---

# 51. Should Have

After the MVP is stable:

* Wishlist
* Reviews and ratings
* Coupons
* Customer notifications
* Admin analytics
* Pharmacy staff role
* Low-stock dashboard
* Redis caching
* Better search
* Order cancellation
* Customer dashboard

---

# 52. Future Features

These should not block the initial project:

* Spring AI
* RAG
* AI product assistant
* AI admin assistant
* Advanced recommendation system
* Personalized product recommendations
* Advanced analytics
* More payment gateways
* Delivery partner integration
* Email/SMS notifications
* Advanced inventory forecasting

---

# 53. Out of Scope for Initial MVP

The initial implementation will not attempt to implement:

* Real medical diagnosis
* Automated medical prescriptions
* AI-based prescription approval
* Full hospital management
* Doctor appointment management
* Laboratory management
* Insurance processing
* Automated pharmaceutical supply-chain management
* Multiple independent pharmacies with separate financial accounts
* Complex accounting/ERP functionality

These may be considered future extensions.

---

# 54. Core Business Flow

The complete primary customer flow is:

```text
Visit Neeramoy
      ↓
Browse/Search Products
      ↓
View Product
      ↓
Add to Cart
      ↓
View Cart
      ↓
Checkout
      ↓
Select Address
      ↓
Prescription Check
      ↓
Select Payment
      ├── Cash on Delivery
      │
      └── bKash
      ↓
Place/Pay for Order
      ↓
Order Confirmation
      ↓
Order Processing
      ↓
Shipped
      ↓
Delivered
      ↓
Review Product
```

---

# 55. Primary Admin Flow

```text
Admin Login
     ↓
Dashboard
     ↓
Manage Products
     ↓
Manage Categories/Brands
     ↓
Manage Inventory
     ↓
Manage Orders
     ↓
Review Prescriptions
     ↓
Manage Customers
     ↓
Manage Reviews
     ↓
View Analytics
```

---

# 56. Success Criteria

The project will be considered functionally successful when a customer can complete the following workflow:

```text
Register
   ↓
Login
   ↓
Search medicine
   ↓
View product
   ↓
Add to cart
   ↓
Enter/select address
   ↓
Upload prescription if required
   ↓
Choose bKash or COD
   ↓
Complete checkout
   ↓
Create order
   ↓
View order
   ↓
Track order
```

The administrator must be able to:

```text
Login
   ↓
Manage products
   ↓
Manage inventory
   ↓
View customer orders
   ↓
Review prescriptions
   ↓
Update order status
   ↓
Monitor platform activity
```

The deployed system should allow:

```text
Frontend
     ↓
Vercel/Netlify
     ↓
Render Backend
     ↓
MongoDB Atlas
     +
Redis
     +
Cloudinary
     +
bKash
```

---

# 57. Project Principles

1. Build the core e-commerce workflow before advanced features.
2. MongoDB remains the primary application database.
3. Redis is a caching layer, not the primary database.
4. Cloudinary handles image/file storage.
5. Payment status must be verified by the backend.
6. Prescription approval must be performed by authorized users.
7. Secrets must never be committed to GitHub.
8. The frontend must not be trusted for prices, payment status, roles, or authorization.
9. The UI should be original and inspired by healthcare-commerce patterns rather than copied from another company's proprietary design.
10. Spring AI and RAG must remain optional future modules and must not block the MVP.
11. Every major feature should be implemented, tested, and integrated before moving to the next feature.
12. The application should remain suitable for future deployment and scaling.

---

# 58. Final Product Definition

**Neeramoy is a full-stack online medicine and healthcare marketplace for Bangladesh, providing customers with product discovery, shopping, prescription handling, checkout, bKash/COD payments, order tracking, and reviews, while providing administrators and pharmacy staff with tools for product, inventory, prescription, order, customer, and operational management.**

The initial system will be built using **React + Vite + Tailwind CSS, Spring Boot + Java, MongoDB Atlas, Cloudinary, Redis, Spring Security/JWT, and bKash payment integration**, with **Spring AI/RAG reserved for a later enhancement phase**.

The application will use an independently designed Neeramoy brand identity and UI/UX, with Stitch used during the design/prototyping stage.
