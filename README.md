# SupplyAgent (Sovereign Supply Chain Orchestrator)

CodePath WEB103 Final Project — Final Milestone (Unit 9 Submission & Demo Day Ready)

**Designed and developed by:** Parth Patel

🔗 **Link to deployed app on Render:** [https://supplyagent-orchestrator.onrender.com](https://supplyagent-orchestrator.onrender.com)

---

## Final App Demonstration GIF

![SupplyAgent Final App Demo](docs/assets/final_app_demo.gif)
*Figure 1: Full application walkthrough showing multi-tenant switching, slide-out inspection pane, item CRUD modals, filtering/sorting, stockout automated PO creation with toast feedback, and database reset button execution.*

---

## About

### Description and Purpose
**SupplyAgent (Sovereign Supply Chain Orchestrator)** is an intelligent, multi-tenant supply chain orchestration platform. The app modernizes enterprise supply chain operations by replacing traditional, static dashboards with automated workflows and real-time data management.

Designed for enterprise supply chain managers and tenant administrators, SupplyAgent enables seamless management of multi-tenant inventory with strict tenant isolation, real-time supplier tracking, and automated Purchase Order (PO) generation upon stockout events. By combining a robust PostgreSQL relational database schema with a fast Express REST API and a dynamic React frontend, SupplyAgent streamlines procurement logistics and prevents stockout downtime.

---

## Tech Stack

- **Frontend:** React, React Router, Tailwind CSS, Vite, Lucide React, React Toastify
- **Backend:** Node.js, Express.js REST API, JWT Authentication
- **Database:** PostgreSQL (`pg` / SQL relational queries featuring 1:1, 1:M, and M:M relationships)
- **Deployment & Tooling:** Render Deployment, Dotenv, Playwright, Git

---

## Completed Feature Checklist (100% Coverage)

### Baseline Features (59 pts)
- ✅ **Express Backend & React Frontend:** Modular Express REST API (`server/`) and responsive React client (`client/`).
- ✅ **PostgreSQL Database Relationships:**
  - **1:M Relationships:** Tenants -> Inventory Items, Suppliers -> Purchase Orders.
  - **M:M Relational Join Table:** Inventory Items -> Suppliers via `inventory_suppliers` junction table, Purchase Orders -> Items via `po_items`.
- ✅ **RESTful CRUD API:** Full `GET`, `POST`, `PUT/PATCH`, and `DELETE` operations for inventory, suppliers, purchase orders, and tenant settings.
- ✅ **Database Reset Functionality:** One-click DB reset button and script (`npm run db:init` / `/api/reset`) to restore default seeded state.
- ✅ **React Router Navigation & Redirection:** Dynamic client routes (`/`, `/inventory`, `/purchase-orders`, `/suppliers`, `/settings`, `/login`) and catch-all route redirection.
- ✅ **Same-Page Interactivity:** Users initiate and complete actions (filtering, sorting, modal editing, slide-out pane inspection) without full page reloads.
- ✅ **Hierarchical Component Architecture:** Separated into page containers (`DashboardPage`, `InventoryPage`, `PurchaseOrdersPage`, `SuppliersPage`, `SettingsPage`, `LoginPage`) and presenter components (`Header`, `Sidebar`, `SlideOutPane`, `EditItemModal`, `HitlApprovalModal`).
- ✅ **Production Render Deployment Setup:** Fully configured for production deployment on Render.

### Custom Required Features (24 pts)
- ✅ **Graceful Error Handling:** Centralized Express middleware (`server/middleware/errorHandler.js`) and user-facing error banners.
- ✅ **1:1 Database Relationship:** `tenants` table to `tenant_settings` table via `tenant_id`.
- ✅ **Slide-Out Pane & Modal Dialogs:** Interactive slide-out side pane for detailed item inspection and modal dialogs for CRUD operations.
- ✅ **Unique Fields in Join Table:** `is_primary` boolean and `supplier_lead_time` inside `inventory_suppliers` junction table.
- ✅ **Custom Non-RESTful Routes:** `/api/suppliers/negotiate` for A2A quote negotiations and `/api/tenant/reallocate` for cross-warehouse reallocations.
- ✅ **Filtering & Sorting Capabilities:** Category filtering and stock level/price sorting on the inventory table.
- ✅ **Automated Event Data Generation:** Automatic creation of formal `purchase_orders` and `a2a_negotiations` records when an inventory item stock reaches `0`.
- ✅ **POST/PATCH Payload Validation:** Input payload validation (`server/middleware/validate.js`) verifying SKU, name, non-negative quantities, and rates before database mutations.

### Stretch Features (19 pts)
- ✅ **Authentication Mechanism & Protected Routes:** Login page with JWT session token verification (`server/routes/auth.js`).
- ✅ **Dynamic User Option Restriction:** Options dynamically restricted based on 1:1 active tenant configuration (budget limit, preferred currency, low stock threshold).
- ✅ **Loading Spinners:** Async data fetching spinners across all views.
- ✅ **Disabled Form Inputs/Buttons:** Form controls disabled during submission.
- ✅ **Immediate Button Disabling on Click:** >75% of buttons disable immediately upon click to prevent double submission.
- ✅ **Cloud Service Image Upload:** Cloud image upload with live preview and URL binding.
- ✅ **Toast Notifications:** Real-time feedback delivered via `react-toastify` for user actions.

---

## Installation & Local Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone https://github.com/parth33320/SAP_Agentic.git
   cd SAP_Agentic
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   cd client && npm install && cd ..
   ```

3. **Initialize Database:**
   ```bash
   npm run db:init
   ```

4. **Start Application:**
   ```bash
   npm start
   ```
   Open `http://localhost:5000` (or `http://localhost:3000` during frontend dev mode).
