# SupplyAgent (Sovereign Supply Chain Orchestrator)

CodePath WEB103 Final Project — Milestone 4 Progress

**Designed and developed by:** Parth Patel

🔗 **Link to deployed app:** *(Deployment URL will be added upon live release)*

---

## About

### Description and Purpose
**SupplyAgent (Sovereign Supply Chain Orchestrator)** is an intelligent, multi-tenant supply chain orchestration platform. The app modernizes enterprise supply chain operations by replacing traditional, static dashboards with automated workflows and real-time data management.

Designed for enterprise supply chain managers and tenant administrators, SupplyAgent enables seamless management of multi-tenant inventory with strict tenant isolation, real-time supplier tracking, and automated Purchase Order (PO) generation upon stockout events. By combining a robust PostgreSQL relational database schema with a fast Express REST API and a dynamic React frontend, SupplyAgent streamlines procurement logistics and prevents stockout downtime.

### Inspiration
Traditional ERP and supply chain software systems (like legacy SAP setups) suffer from fragmented multi-tenant data, slow manual reordering processes, and clunky user interfaces. Inspired by modern Forward Deployed Engineering (FDE) principles and autonomous workflow orchestration, SupplyAgent was built to bridge the gap between static inventory views and proactive procurement. When stock levels reach zero, SupplyAgent bridges the gap between tenant admins and suppliers through automated workflows, instant quote requests, and seamless PO creation.

---

## Tech Stack

- **Frontend:** React, React Router, Modern CSS / Tailwind CSS, Vite
- **Backend:** Node.js, Express.js REST API
- **Database:** PostgreSQL (with `pg` / SQL relational queries featuring 1:M and M:M relationships)
- **Tooling & Environment:** Environment Configuration (`dotenv`), Git Version Control

---

## Technical Features

### 1. ✅ Multi-Tenant Inventory Scoping & Data Isolation
- **Description:** Enforces strict data-level segregation using `tenant_id` scoping across all PostgreSQL database queries and backend Express middleware. Ensures users only view, query, and mutate inventory items belonging to their active tenant session.

![Multi-Tenant Data Isolation](docs/assets/multi_tenant_isolation.gif)
*Demonstration of strict multi-tenant scoping and session context switching between tenant accounts.*

---

### 2. ✅ Automated Purchase Order (PO) Generation on Stockouts
- **Description:** Automatically generates formal Purchase Order (PO) records whenever an inventory item's quantity reaches zero (stockout condition). Fulfills automated data creation requirements by persisting new PO records directly into PostgreSQL.

![Automated PO Generation on Stockout](docs/assets/po_generation.gif)
*Demonstration of instant Purchase Order record generation triggered when inventory stock reaches zero.*

---

### 3. ✅ Agent-to-Agent (A2A) Supplier Quote Negotiations
- **Description:** Initiates asynchronous supplier quote requests and negotiation logs when stockout conditions occur, enabling automated procurement workflows between tenant admins and vendor supply partners.

![A2A Supplier Quote Negotiations](docs/assets/a2a_negotiations.gif)
*Demonstration of automated supplier quote request dispatching and negotiation log creation.*

---

### 4. ✅ Relational Database Schema with PostgreSQL (1:M and M:M Relationships)
- **Description:** Built on a normalized PostgreSQL schema that models complex enterprise supply chain entities, including one-to-many relationships (e.g., Tenants to Inventory Items, Suppliers to Purchase Orders) and many-to-many relationships (e.g., Inventory Items to Suppliers via a junction table).

![Relational Database CRUD Operations](docs/assets/database_relational_crud.gif)
*Demonstration of PostgreSQL relational queries managing 1:M and M:M database operations.*

---

### 5. ✅ Express REST API with Full CRUD Operations
- **Description:** A robust Node.js/Express REST API exposing full CRUD capabilities (`GET`, `POST`, `PUT`, `DELETE`) for inventory records, purchase orders, suppliers, and tenant settings with comprehensive error handling and status codes.

---

### 6. ✅ React Frontend with Dynamic Routing & Interactive Modals/Slide-out Panes
- **Description:** A responsive React frontend built with React Router for dynamic page navigation. Features interactive modal dialogs and slide-out side panes for detailed inventory inspection, item creation/editing, database resets, and real-time loading spinners with button-disabling behavior during API requests.

![React Interactive Table & Modals](docs/assets/react_ui_modals.gif)
*Demonstration of interactive React slide-out panes, modal dialogs, and real-time loading state feedback.*

---

## Installation Instructions

### Prerequisites
- Node.js (v18.x or higher)
- npm or yarn
- PostgreSQL instance running locally or hosted (e.g., Supabase / Render PostgreSQL)

### Step-by-Step Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/parth33320/SAP_Agentic.git
   cd SAP_Agentic
   ```

2. **Backend Setup:**
   ```bash
   # Navigate to server directory (or root if unified)
   npm install
   ```
   Create a `.env` file in the root directory:
   ```env
   PORT=5000
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/supplyagent_db
   ```
   Initialize and seed the PostgreSQL database:
   ```bash
   npm run db:init
   ```
   Start the backend server:
   ```bash
   npm run server
   ```

3. **Frontend Setup:**
   ```bash
   # Navigate to client directory or run client script
   npm run client
   ```
   Open `http://localhost:3000` or `http://localhost:5173` in your browser.
