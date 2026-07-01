<div align="center">

# 📦 InventoryMS

### Production-Ready MERN Stack Inventory Management System

A modern, full-featured inventory and order management platform built with the MERN stack.
Role-based access control, real-time analytics, Cloudinary image uploads, email notifications, QR code generation, and a polished glassmorphism UI with dark mode.

[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com)
[![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com)
[![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Redux](https://img.shields.io/badge/Redux_Toolkit-764ABC?style=for-the-badge&logo=redux&logoColor=white)](https://redux-toolkit.js.org)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)

[Live Demo](https://inventory-mern.vercel.app) · [Report Bug](https://github.com/YOUR_USERNAME/inventory-mern/issues) · [Request Feature](https://github.com/YOUR_USERNAME/inventory-mern/issues)

![Dashboard Preview](https://via.placeholder.com/900x500/1e293b/4f46e5?text=InventoryMS+Dashboard)

</div>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [User Roles](#user-roles)
- [Deployment](#deployment)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

InventoryMS is a production-quality inventory management system designed to look and operate like a real SaaS product. It handles the complete lifecycle of your inventory — from adding products and tracking stock levels, to processing orders and generating analytics — all in one polished dashboard.

Built as a portfolio-grade project demonstrating clean architecture, scalable folder structure, reusable components, secure authentication, and real-world integrations including Cloudinary for image storage and Nodemailer for email alerts.

---

## Features

### Authentication & Security
- JWT-based authentication with httpOnly cookies
- Password hashing with bcrypt (10 salt rounds)
- Role-based access control (Admin / Staff)
- Protected routes on both frontend and backend
- Rate limiting, helmet security headers, and MongoDB sanitization
- Auto-logout on token expiry

### Dashboard & Analytics
- Real-time stats — total products, orders, revenue, low stock, out of stock
- Monthly sales line chart (last 6 months)
- Category distribution pie chart
- Recent orders feed with live status
- Audit activity log showing all recent actions

### Product Management
- Full CRUD — create, read, update, delete products
- Cloudinary image upload with preview and zoom
- SKU and barcode support
- Search across name, SKU, barcode, and category simultaneously
- Filter by category and stock status
- Sort by price, quantity, name, or date
- Pagination (12 products per page)
- CSV export of full catalog
- QR code generation per product (downloadable PNG)
- Computed stock status — In Stock, Low Stock, Out of Stock
- Profit margin calculated automatically

### Inventory Tracking
- Stock auto-decrements when orders are placed (via MongoDB transactions)
- Low stock threshold configurable per product (default 5 units)
- Email alert fired when stock drops to threshold
- Email alert fired when product reaches zero

### Order Management
- Multi-item orders with live running total
- Atomic stock deduction (all or nothing — no partial failures)
- Order status workflow: Pending → Processing → Completed / Cancelled
- Printable invoice with PDF save via browser
- Full order history with search and status filter

### Email Notifications
- New order confirmation
- Low stock alert
- Out of stock alert
- Product added notification
- Product deleted notification
- Professional HTML email templates

### Staff Management (Admin only)
- Create staff and admin accounts
- Assign and change roles
- Activate and deactivate accounts
- Delete accounts

### UI/UX
- Dark mode with system preference saved to localStorage
- Glassmorphism card design
- Framer Motion page and element animations
- Loading skeleton screens
- Toast notifications for all actions
- Confirmation dialogs for destructive actions
- Fully responsive — works on mobile, tablet, and desktop
- Sidebar navigation with active route indicator

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18 | UI framework |
| Vite | Build tool and dev server |
| Tailwind CSS | Utility-first styling |
| Redux Toolkit | Global state management |
| React Router DOM | Client-side routing |
| Axios | HTTP client with interceptors |
| React Hook Form | Form handling and validation |
| Recharts | Dashboard charts |
| Framer Motion | Animations and transitions |
| Lucide React | Icon library |
| React Hot Toast | Toast notifications |
| React to Print | Invoice PDF printing |

### Backend
| Technology | Purpose |
|---|---|
| Node.js | Runtime |
| Express.js | Web framework |
| MongoDB Atlas | Cloud database |
| Mongoose | ODM and schema validation |
| JSON Web Token | Authentication tokens |
| bcryptjs | Password hashing |
| Multer | File upload handling |
| Cloudinary | Image storage and CDN |
| Nodemailer | Email sending |
| express-validator | Input validation |
| Helmet | Security headers |
| express-rate-limit | API rate limiting |

### Deployment
| Service | Purpose |
|---|---|
| Vercel | Frontend hosting |
| Render | Backend hosting |
| MongoDB Atlas | Database hosting |
| Cloudinary | Image hosting |

---

## Project Structure

```
inventory-mern/
│
├── backend/
│   ├── config/
│   │   ├── db.js                 # MongoDB connection
│   │   └── cloudinary.js         # Cloudinary config + upload helper
│   │
│   ├── controllers/
│   │   ├── authController.js     # Register, login, logout, profile
│   │   ├── productController.js  # Product CRUD, stock, QR, CSV export
│   │   ├── orderController.js    # Order creation with atomic stock deduction
│   │   ├── dashboardController.js # Aggregated analytics queries
│   │   └── userController.js     # Staff account management
│   │
│   ├── middlewares/
│   │   ├── authMiddleware.js     # JWT verification + role authorization
│   │   ├── errorMiddleware.js    # Centralized error handler
│   │   └── uploadMiddleware.js   # Multer memory storage config
│   │
│   ├── models/
│   │   ├── User.js               # User schema with bcrypt hook
│   │   ├── Product.js            # Product schema with virtual stockStatus
│   │   ├── Order.js              # Order schema with embedded line items
│   │   └── AuditLog.js           # Activity log schema
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── dashboardRoutes.js
│   │   └── userRoutes.js
│   │
│   ├── utils/
│   │   ├── generateToken.js      # JWT generation + cookie sender
│   │   ├── sendEmail.js          # Nodemailer transporter
│   │   ├── emailTemplates.js     # HTML email templates
│   │   ├── auditLogger.js        # Activity logger + order number generator
│   │   ├── qrcodeGenerator.js    # QR code base64 PNG generator
│   │   └── seed.js               # Demo data seeder
│   │
│   ├── validators/
│   │   ├── authValidator.js
│   │   ├── productValidator.js
│   │   └── orderValidator.js
│   │
│   ├── server.js                 # Express app entry point
│   ├── package.json
│   └── .env.example
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── layout/
    │   │   │   ├── Sidebar.jsx       # Navigation sidebar
    │   │   │   ├── Navbar.jsx        # Top bar with theme toggle
    │   │   │   ├── DashboardLayout.jsx
    │   │   │   └── ProtectedRoute.jsx
    │   │   │
    │   │   ├── ui/                   # Reusable UI primitives
    │   │   │   ├── Button.jsx
    │   │   │   ├── Input.jsx
    │   │   │   ├── Select.jsx
    │   │   │   ├── Modal.jsx
    │   │   │   ├── Badge.jsx
    │   │   │   ├── Skeleton.jsx
    │   │   │   ├── Pagination.jsx
    │   │   │   └── ConfirmDialog.jsx
    │   │   │
    │   │   ├── products/
    │   │   │   ├── ProductCard.jsx
    │   │   │   ├── ProductForm.jsx
    │   │   │   ├── ImageZoomModal.jsx
    │   │   │   └── ProductQRModal.jsx
    │   │   │
    │   │   ├── orders/
    │   │   │   ├── CreateOrderForm.jsx
    │   │   │   └── InvoiceTemplate.jsx
    │   │   │
    │   │   └── dashboard/
    │   │       └── StatCard.jsx
    │   │
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── Products.jsx
    │   │   ├── Orders.jsx
    │   │   ├── Users.jsx
    │   │   ├── Profile.jsx
    │   │   ├── Settings.jsx
    │   │   └── NotFound.jsx
    │   │
    │   ├── features/               # Redux Toolkit slices
    │   │   ├── auth/authSlice.js
    │   │   ├── products/productSlice.js
    │   │   ├── orders/orderSlice.js
    │   │   ├── dashboard/dashboardSlice.js
    │   │   └── users/userSlice.js
    │   │
    │   ├── redux/
    │   │   ├── store.js
    │   │   └── uiSlice.js          # Theme + sidebar state
    │   │
    │   ├── services/               # Axios API modules
    │   │   ├── api.js              # Base axios instance + interceptors
    │   │   ├── authService.js
    │   │   ├── productService.js
    │   │   ├── orderService.js
    │   │   ├── dashboardService.js
    │   │   └── userService.js
    │   │
    │   ├── hooks/
    │   │   ├── useAuth.js          # Auth state + role helpers
    │   │   ├── useDebounce.js      # Search input debouncing
    │   │   └── useConfirm.js       # Imperative confirm dialog
    │   │
    │   └── utils/
    │       ├── formatters.js       # Currency, date, stock status formatters
    │       └── exportCSV.js        # Blob download helper
    │
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    ├── package.json
    └── .env.example
```

---

## Getting Started

### Prerequisites
- Node.js 18 or higher
- A free [MongoDB Atlas](https://mongodb.com/cloud/atlas) account
- A free [Cloudinary](https://cloudinary.com) account
- Git

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/YOUR_USERNAME/inventory-mern.git
cd inventory-mern
```

**2. Install backend dependencies**
```bash
cd backend
npm install
```

**3. Configure backend environment**
```bash
cp .env.example .env
```
Open `.env` and fill in your values (see [Environment Variables](#environment-variables) section below).

**4. Seed the database with demo data**
```bash
npm run seed
```
This creates:
- Admin account: `admin@inventory.com` / `admin123`
- Staff account: `staff@inventory.com` / `staff123`
- 6 sample products across multiple categories

**5. Start the backend**
```bash
npm run dev
```
You should see:
```
✅ MongoDB Connected: cluster0.xxxxx.mongodb.net
🚀 Server running in development mode on port 5000
```

**6. Install frontend dependencies** (open a new terminal)
```bash
cd frontend
npm install
```

**7. Configure frontend environment**
```bash
cp .env.example .env
```
The default value works for local development:
```
VITE_API_BASE_URL=http://localhost:5000/api
```

**8. Start the frontend**
```bash
npm run dev
```

**9. Open the app**

Visit [http://localhost:5173](http://localhost:5173) and log in with the seeded admin account.

---

## Environment Variables

### Backend `.env`

```env
# Server
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:5173

# MongoDB Atlas
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/inventory_db?retryWrites=true&w=majority

# JWT
JWT_SECRET=your_long_random_secret_key_minimum_32_characters
JWT_EXPIRES_IN=7d
JWT_COOKIE_EXPIRES_DAYS=7

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Nodemailer (optional — app works without this)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
EMAIL_FROM="Inventory System <no-reply@inventorysys.com>"
ADMIN_NOTIFICATION_EMAIL=admin@yourcompany.com

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=200
```

### Frontend `.env`

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## API Documentation

**Base URL:** `http://localhost:5000/api`

All endpoints except `/auth/register` and `/auth/login` require an `Authorization: Bearer <token>` header.

### Authentication

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/auth/register` | Public | Register new user (first user becomes admin) |
| POST | `/auth/login` | Public | Login and receive JWT token |
| POST | `/auth/logout` | Private | Clear auth cookie |
| GET | `/auth/profile` | Private | Get current user profile |
| PUT | `/auth/profile` | Private | Update name or password |

### Products

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/products` | Private | List products with search, filter, sort, pagination |
| GET | `/products/categories` | Private | Get distinct category list |
| GET | `/products/export/csv` | Admin | Download product catalog as CSV |
| GET | `/products/:id` | Private | Get single product |
| POST | `/products` | Admin | Create product (multipart/form-data, `image` field) |
| PUT | `/products/:id` | Admin | Update product |
| DELETE | `/products/:id` | Admin | Delete product |
| PATCH | `/products/:id/stock` | Admin/Staff | Update stock quantity |
| GET | `/products/:id/qrcode` | Private | Get base64 QR code PNG |

**Query parameters for GET `/products`:**

| Param | Type | Example |
|---|---|---|
| `search` | string | `?search=mouse` |
| `category` | string | `?category=Electronics` |
| `stockStatus` | string | `?stockStatus=low-stock` |
| `minPrice` | number | `?minPrice=10` |
| `maxPrice` | number | `?maxPrice=100` |
| `sortBy` | string | `?sortBy=sellingPrice` |
| `sortOrder` | string | `?sortOrder=asc` |
| `page` | number | `?page=2` |
| `limit` | number | `?limit=12` |

### Orders

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/orders` | Private | List orders with filter and pagination |
| GET | `/orders/:id` | Private | Get single order |
| POST | `/orders` | Admin/Staff | Create order (decrements stock atomically) |
| PATCH | `/orders/:id/status` | Admin/Staff | Update order status |

### Dashboard

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/dashboard` | Private | Stats, charts data, recent orders, activity log |

### Users

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/users` | Admin | List all staff accounts |
| POST | `/users` | Admin | Create staff or admin account |
| PUT | `/users/:id` | Admin | Update role or active status |
| DELETE | `/users/:id` | Admin | Delete account |

---

## User Roles

### Admin
- Full access to everything
- Create, edit, and delete products
- Manage all orders
- Create, edit, and delete staff accounts
- Export data and view all analytics
- Receive email notifications

### Staff
- View all products
- Update stock quantities
- Create and process orders
- View dashboard and analytics
- Cannot delete products
- Cannot manage user accounts

---

## Deployment

### Backend → Render

1. Push your repo to GitHub
2. Go to [render.com](https://render.com) → New → Web Service
3. Connect your GitHub repository
4. Set Root Directory to `backend`
5. Set Build Command to `npm install`
6. Set Start Command to `npm start`
7. Add all environment variables from your `.env` file
8. Set `NODE_ENV` to `production`
9. Set `CLIENT_URL` to your Vercel frontend URL
10. Click Deploy

### Frontend → Vercel

1. Go to [vercel.com](https://vercel.com) → Add New Project
2. Import your GitHub repository
3. Set Root Directory to `frontend`
4. Set Framework Preset to Vite
5. Add environment variable: `VITE_API_BASE_URL` = your Render backend URL + `/api`
6. Click Deploy

### Database → MongoDB Atlas

1. Create a free M0 cluster at [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Create a database user under Database Access
3. Allow connections from anywhere (0.0.0.0/0) under Network Access
4. Copy the connection string into your `MONGO_URI` environment variable

### Images → Cloudinary

1. Create a free account at [cloudinary.com](https://cloudinary.com)
2. Copy your Cloud Name, API Key, and API Secret from the dashboard
3. Add them to your environment variables

---

## MongoDB Schema Overview

### User
```
name, email (unique), password (hashed), role: admin|staff,
isActive, lastLogin, avatar, createdAt, updatedAt
```

### Product
```
name, description, category, sku (unique), barcode,
buyingPrice, sellingPrice, quantity, lowStockThreshold,
supplier, imageURL, imagePublicId, createdBy (ref: User),
isArchived, createdAt, updatedAt

Virtuals: stockStatus, profitMargin
```

### Order
```
orderNumber (unique), customerName, customerEmail,
products: [{ product (ref), name, quantity, price, subtotal }],
totalPrice, orderStatus, paymentStatus,
createdBy (ref: User), notes, createdAt, updatedAt
```

### AuditLog
```
user (ref: User), userName, action, entityType,
entityId, description, metadata, createdAt
```

---

## Screenshots

| Dashboard | Products |
|---|---|
| ![Dashboard](https://via.placeholder.com/400x250/1e293b/4f46e5?text=Dashboard) | ![Products](https://via.placeholder.com/400x250/1e293b/4f46e5?text=Products) |

| Orders | Staff Management |
|---|---|
| ![Orders](https://via.placeholder.com/400x250/1e293b/4f46e5?text=Orders) | ![Users](https://via.placeholder.com/400x250/1e293b/4f46e5?text=Staff) |

---

## Contributing

Contributions are welcome. To contribute:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

---

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

Built with ❤️ using the MERN Stack

⭐ Star this repo if you found it helpful

</div>
