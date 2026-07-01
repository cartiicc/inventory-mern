# 📦 InventoryMS — Production-Ready MERN Inventory Management System

A modern, full-stack inventory & order management platform built with the MERN stack. Designed to look and operate like a real SaaS product — role-based access, real inventory tracking, order processing with automatic stock deduction, email notifications, analytics dashboards, and a polished glassmorphism UI with dark mode.

![Stack](https://img.shields.io/badge/stack-MERN-4f46e5) ![License](https://img.shields.io/badge/license-MIT-green)

---

## ✨ Features

### Core (fully implemented)
- **Authentication** — JWT-based auth, bcrypt password hashing, httpOnly cookie + Bearer token support, protected routes, role-based authorization (Admin / Staff)
- **Product Management** — Full CRUD, Cloudinary image upload with preview, SKU/barcode, search, category & price filters, sorting, pagination
- **Inventory Tracking** — Real-time computed stock status (in-stock / low-stock / out-of-stock), audit-logged stock adjustments
- **Order Management** — Multi-item orders with atomic (MongoDB transaction-safe) stock decrement, order status workflow, printable PDF invoices
- **Dashboard Analytics** — Revenue, product/order counts, low & out-of-stock counts, monthly sales line chart, category distribution pie chart, recent orders & activity feed
- **Email Notifications** — Professional HTML emails via Nodemailer for new orders, low stock, out of stock, product added/deleted
- **Staff Management** — Admin-only user CRUD, role assignment, account activation/deactivation
- **Audit Logs** — Every meaningful mutation (product/stock/order/user changes) is logged and surfaced on the dashboard
- **CSV Export** — One-click product catalog export
- **QR Code Generation** — Per-product QR codes (downloadable PNG) encoding SKU & ID
- **UI/UX** — Dark mode, glassmorphism cards, Framer Motion animations, loading skeletons, toasts, confirmation dialogs, responsive mobile-first layout

### Partially implemented / stubbed (clearly marked for extension)
These were listed under "Bonus Features" in the spec. Given the size of a fully production MERN core, the following are scaffolded but **not** fully built out — flagged here rather than silently omitted:
- **Barcode generation** — `jsbarcode`/`canvas` are included as backend deps but only QR codes are wired up end-to-end; extending to 1D barcodes is a small addition in `qrcodeGenerator.js`
- **PDF report export** (full analytics report, not just invoices) — invoices print-to-PDF via the browser; a dedicated PDF analytics report endpoint is not built
- **Real-time updates (Socket.IO)** — not implemented; current data freshness comes from short-TTL Redux Toolkit caching + manual refetch on mutation
- **Multi-store inventory** — schema is single-store; would need a `Store` model + `store` refs on Product/Order
- **AI-powered demand prediction** — not implemented (would require a separate ML service/integration)
- **Bulk Excel import/export** — CSV export only; XLSX import/export is not wired up
- **Offline caching / full PWA** — basic `vite-plugin-pwa` manifest + runtime caching for GET requests is configured; this is "PWA-installable with basic offline read" rather than a full offline-first app

---

## 🛠️ Tech Stack

**Frontend:** React 18 + Vite, Tailwind CSS, Redux Toolkit, React Router DOM, Axios, React Hook Form, React Hot Toast, Recharts, Framer Motion, Lucide Icons

**Backend:** Node.js, Express.js, MongoDB + Mongoose, JWT, bcryptjs, Multer, Cloudinary, Nodemailer

**Deployment:** Vercel (frontend) · Render (backend) · MongoDB Atlas · Cloudinary

---

## 📁 Project Structure

```
inventory-mern/
├── backend/
│   ├── config/          # db.js, cloudinary.js
│   ├── controllers/     # business logic per resource
│   ├── middlewares/     # auth, error handling, multer upload
│   ├── models/          # Mongoose schemas (User, Product, Order, AuditLog)
│   ├── routes/          # Express routers
│   ├── utils/           # email templates/sender, JWT, audit logger, QR, seed
│   ├── validators/      # express-validator rule sets
│   ├── server.js
│   ├── package.json
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── components/  # layout/, ui/, products/, orders/, dashboard/
    │   ├── pages/        # route-level pages
    │   ├── features/     # Redux Toolkit slices (auth, products, orders, dashboard, users)
    │   ├── redux/         # store.js, uiSlice.js
    │   ├── services/      # axios API modules
    │   ├── hooks/          # useAuth, useDebounce, useConfirm
    │   └── utils/           # formatters, CSV download helper
    ├── package.json
    └── .env.example
```

---

## 🚀 Local Setup

### Prerequisites
- Node.js 18+
- A MongoDB Atlas cluster (or local MongoDB)
- A Cloudinary account (free tier is fine)
- An SMTP-capable email account (Gmail App Password works) — optional, app degrades gracefully without it

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env   # fill in MONGO_URI, JWT_SECRET, CLOUDINARY_*, EMAIL_*
npm run dev             # starts on http://localhost:5000
```

Optional — seed demo data (1 admin, 1 staff, 6 sample products):
```bash
npm run seed
```
Demo logins after seeding:
- Admin: `admin@inventory.com` / `admin123`
- Staff: `staff@inventory.com` / `staff123`

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env   # set VITE_API_BASE_URL=http://localhost:5000/api
npm run dev              # starts on http://localhost:5173
```

> The **first account ever registered** automatically becomes Admin. All subsequent public registrations are forced to `staff` — additional admins must be created from the Staff page by an existing admin.

---

## 📡 API Documentation

Base URL: `/api`

### Auth
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/auth/register` | Public | Register (first user becomes admin) |
| POST | `/auth/login` | Public | Login, returns JWT |
| POST | `/auth/logout` | Private | Clears auth cookie |
| GET | `/auth/profile` | Private | Get current user |
| PUT | `/auth/profile` | Private | Update name/password |

### Products
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/products` | Private | List with `search, category, stockStatus, minPrice, maxPrice, sortBy, sortOrder, page, limit` query params |
| GET | `/products/categories` | Private | Distinct category list |
| GET | `/products/:id` | Private | Single product |
| POST | `/products` | Admin | Create (multipart/form-data, `image` field) |
| PUT | `/products/:id` | Admin | Update |
| DELETE | `/products/:id` | Admin | Delete |
| PATCH | `/products/:id/stock` | Admin/Staff | Body: `{ quantity, operation: 'set'\|'increment'\|'decrement' }` |
| GET | `/products/:id/qrcode` | Private | Returns base64 PNG QR code |
| GET | `/products/export/csv` | Admin | Download CSV |

### Orders
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/orders` | Private | List with `status, search, page, limit` |
| GET | `/orders/:id` | Private | Single order |
| POST | `/orders` | Admin/Staff | Create order — decrements stock atomically |
| PATCH | `/orders/:id/status` | Admin/Staff | Update order status |

### Dashboard
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/dashboard` | Private | Aggregated stats, charts data, recent orders/activity |

### Users (Staff Management)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/users` | Admin | List all users |
| POST | `/users` | Admin | Create staff/admin account |
| PUT | `/users/:id` | Admin | Update role/active status |
| DELETE | `/users/:id` | Admin | Delete account |

All endpoints (except register/login) require `Authorization: Bearer <token>`.

---

## 🗄️ MongoDB Schema Overview

**User** — `name, email (unique), password (hashed), role: admin|staff, isActive, lastLogin`

**Product** — `name, description, category, sku (unique), barcode, buyingPrice, sellingPrice, quantity, lowStockThreshold, supplier, imageURL, imagePublicId, createdBy`. `stockStatus` and `profitMargin` are computed virtuals, never stored.

**Order** — `orderNumber (unique), customerName, customerEmail, products: [{product, name, quantity, price, subtotal}], totalPrice, orderStatus, paymentStatus, createdBy`

**AuditLog** — `user, userName, action, entityType, entityId, description, metadata, createdAt`

---

## ☁️ Deployment

### Backend → Render
1. Push this repo to GitHub.
2. New Web Service on Render, root directory `backend`.
3. Build command: `npm install` · Start command: `npm start`.
4. Add all variables from `backend/.env.example` in the Render dashboard (use your real Atlas URI, JWT secret, Cloudinary & SMTP creds). Set `CLIENT_URL` to your deployed Vercel URL.

### Frontend → Vercel
1. Import the repo, set root directory to `frontend`.
2. Framework preset: Vite.
3. Environment variable: `VITE_API_BASE_URL=https://your-render-app.onrender.com/api`.
4. Deploy.

### Database → MongoDB Atlas
1. Create a free M0 cluster.
2. Add a database user + allow access from `0.0.0.0/0` (or Render's IPs) under Network Access.
3. Copy the connection string into `MONGO_URI`.

### Images → Cloudinary
1. Create a free account, grab Cloud Name / API Key / API Secret from the dashboard.
2. Add to backend env vars — no further setup needed, the app uploads via stream.

---

## 🔒 Security Notes
- Passwords hashed with bcrypt (10 salt rounds)
- JWT signed with a long random secret, stored as httpOnly cookie + returned for Bearer-header use
- `helmet`, `express-mongo-sanitize`, and rate limiting applied globally
- Role-based middleware (`authorize('admin')`) guards every privileged route
- All Cloudinary uploads validated by mimetype + 5MB size limit

---

## 📝 License
MIT — free to use as a portfolio project or starting point for your own SaaS.
