# System Architecture & Concrete Call Stack Traces

**Project:** SupplyAgent (Sovereign Supply Chain Orchestrator)
**Author:** Parth Patel
**Course / Capstone:** CodePath WEB103 Final Milestone (Unit 9)

---

## 1. High-Level Folder & File Structure Trace

```text
.
├── client/                              # React Frontend Application (Vite + Tailwind CSS)
│   ├── public/                          # Static web assets & favicons
│   ├── src/
│   │   ├── components/                  # Hierarchical Presenter Components & Modals
│   │   │   ├── EditItemModal.jsx        # Modal dialog for inventory CRUD mutations & cloud image upload
│   │   │   ├── Header.jsx               # Top navigation, multi-tenant scope dropdown, & DB reset
│   │   │   ├── HitlApprovalModal.jsx    # Human-in-the-Loop review checkpoint modal for A2A quotes
│   │   │   ├── Sidebar.jsx              # Module navigation bar utilizing React Router NavLink
│   │   │   └── SlideOutPane.jsx         # Slide-out inspection pane for M:M supplier relational views
│   │   ├── context/                     # React Context State Containers
│   │   │   ├── AuthContext.jsx          # Protected route session management & JWT token validation
│   │   │   └── TenantContext.jsx        # Multi-tenant scoping state (`tenant_01`, `tenant_02`, `tenant_03`)
│   │   ├── pages/                       # Page-level Container Components
│   │   │   ├── DashboardPage.jsx        # Executive supply chain KPI overview & priority watchlist
│   │   │   ├── InventoryPage.jsx        # Interactive inventory table with sorting, filtering, & slide-out
│   │   │   ├── LoginPage.jsx            # Authentication page
│   │   │   ├── PurchaseOrdersPage.jsx   # Persisted PO list & A2A supplier negotiation logs
│   │   │   ├── SettingsPage.jsx         # 1:1 Tenant Configuration Settings manager
│   │   │   └── SuppliersPage.jsx        # Relational supplier entity network directory
│   │   ├── App.jsx                      # React Router routes, ToastContainer, & provider wrappers
│   │   ├── main.jsx                     # DOM root entry point
│   │   └── index.css                    # Tailwind CSS directives & slide-out pane animation keyframes
│   ├── index.html                       # HTML5 root template
│   ├── package.json                     # Frontend dependencies (`react-router-dom`, `react-toastify`, `lucide-react`)
│   ├── tailwind.config.js               # Custom theme colors & styling extensions
│   └── vite.config.js                   # Vite dev server configuration & API proxy setup
│
├── server/                              # Node.js / Express REST API Backend
│   ├── db/                              # Database Layer & Schema Initialization
│   │   ├── index.js                     # Connection pooling (`pg.Pool`), SQL query wrapper, & in-memory fallback
│   │   ├── init.js                      # Database seed initialization script (`npm run db:init`)
│   │   └── schema.sql                   # Relational PostgreSQL schema definitions (1:1, 1:M, M:M junction)
│   ├── middleware/                      # Express Middleware Seams
│   │   ├── errorHandler.js              # Centralized JSON error handling middleware
│   │   ├── tenantScope.js               # Zero-trust multi-tenant isolation middleware (`X-Tenant-ID`)
│   │   └── validate.js                  # Request payload validator for POST/PATCH mutations
│   ├── routes/                          # Express RESTful & Custom Controllers
│   │   ├── auth.js                      # Authentication & JWT session verification routes
│   │   ├── inventory.js                 # Full CRUD inventory endpoints + stockout PO trigger
│   │   ├── purchaseOrders.js            # Purchase Order CRUD endpoints
│   │   ├── reset.js                     # Database reset endpoint (`/api/reset`)
│   │   ├── suppliers.js                 # Supplier directory + custom A2A `/api/suppliers/negotiate` route
│   │   └── tenant.js                    # 1:1 Tenant settings + custom `/api/tenant/reallocate` route
│   ├── services/                        # Business Logic & Autonomous Services
│   │   └── poAutomation.js              # Automated Stockout Detector & PO Generation Service
│   └── index.js                         # Express application entry point & listener
│
├── docs/                                # Documentation & Demonstration Assets
│   └── assets/
│       └── final_app_demo.gif           # Professional full application run-through GIF
│
├── milestones/                          # Course Deliverables & Progress Reports
│   ├── milestone5.md                    # Final Milestone checklist, feature rubric, reflection & GIF link
│   └── progress_report_5.md             # CodePath 100% completion progress report
│
├── planning/                            # Architectural Specs & Diagrams
│   ├── entity_relationship_diagram.md   # PostgreSQL relational schema documentation
│   ├── system_architecture_and_traces.md# System design & concrete 6-tier call stack traces
│   ├── user_stories.md                  # User persona stories & requirements
│   └── wireframes.md                    # Page wireframe designs
│
├── milestone5_reflection.md             # Root-level structure parity reflection
├── package.json                         # Root package configuration & run scripts
└── README.md                            # Primary project documentation with checkmarks & deployed links
```

---

## 2. Environment & Configuration Binding Trace

```text
System Invariants & Environmental Bindings:
├── Environment Variables (.env):
│   ├── PORT = 5000                              # Express HTTP server port binding
│   ├── DATABASE_URL = postgresql://...          # PostgreSQL connection string with SSL pooling options
│   ├── JWT_SECRET = supplyagent_super_secret... # JWT secret key for session signing
│   └── NODE_ENV = production / development      # Operational mode
│
└── Database Connection Pool Initialization (server/db/index.js):
    ├── Module: 'pg' (node-postgres)
    ├── Class: Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } })
    ├── Operation: query(text, params)
    └── Fallback Engine: InMemoryDB (Ensures zero-downtime execution locally or when DATABASE_URL is unset)
```

---

## 3. Mandatory Concrete 6-Tier Call Stack Traces

### Trace 1: Multi-Tenant Scoping Flow
This call stack details how an incoming HTTP request carrying an `X-Tenant-ID` header is intercepted by middleware, scoped to the active tenant in PostgreSQL, and returned as isolated JSON data.

```text
Execution Call Stack Trace: Multi-Tenant Scoping Flow
└── [Project] SupplyAgent Sovereign Orchestrator API Gateway
    ├── [Configuration/Env] Invariants: PORT=5000, Header: X-Tenant-ID="tenant_01"
    └── [Folder] server/
        └── [Folder] server/middleware/
            └── [File] tenantScope.js
                └── [Class] Express Middleware Handler
                    └── [Method] tenantScope(req: Request, res: Response, next: NextFunction)
                        ├── [Variable State Shift] Inbound Header: req.headers['x-tenant-id'] = "tenant_01"
                        ├── [Variable State Shift] Assigned Property: req.tenantId = "tenant_01"
                        ├── [Method] memoryDb.tenant_settings.find(ts => ts.tenant_id === "tenant_01")
                        ├── [Variable State Shift] Mutated Result: req.tenantSettings = { budget_limit: 50000, auto_po_enabled: true, preferred_currency: "USD" }
                        └── [Method] next() -> Pass execution control to controller
        └── [Folder] server/routes/
            └── [File] inventory.js
                └── [Class] Express Router Controller
                    └── [Method] router.get('/', (req, res) => { ... })
                        ├── [Variable State Shift] Filter Parameter: req.tenantId = "tenant_01"
                        └── [Method] db.query('SELECT * FROM inventory WHERE tenant_id = $1', ['tenant_01'])
                            ├── [Project] PostgreSQL Database Connection Seam (server/db/index.js)
                            ├── [Variable State Shift] Parametric Query: $1 = "tenant_01"
                            ├── [Variable State Shift] Returned Rows: items = [ { id: "inv_101", tenant_id: "tenant_01", sku: "SKU-101", quantity: 45 }, ... ]
                            └── [Method] res.json({ tenant_id: "tenant_01", total: 3, items: items })
```

---

### Trace 2: Automated PO Generation on Stockout Flow
This call stack details an end-to-end execution path triggered when a user updates an inventory item's stock quantity to `0` (stockout condition) on the React frontend. The Express controller invokes `poAutomation.js`, which detects the stockout, queries the primary supplier from the `inventory_suppliers` join table, creates a new `purchase_orders` record in PostgreSQL, and updates UI state with toast notifications.

```text
Execution Call Stack Trace: Automated PO Generation on Stockout Flow
└── [Project] SupplyAgent Frontend & Backend Autonomous Workflow Engine
    ├── [Configuration/Env] Active Session: X-Tenant-ID="tenant_01", Target Item ID="inv_101"
    └── [Folder] client/src/
        └── [Folder] client/src/components/
            └── [File] SlideOutPane.jsx
                └── [Class] React Presenter Component
                    └── [Method] handleSimulateStockout()
                        ├── [Variable State Shift] Trigger Event: User clicks "Simulate Stockout (Qty = 0)"
                        ├── [Variable State Shift] Button Mutated State: clickedButton = true, actionLoading = true
                        └── [Method] fetch('/api/inventory/inv_101', { method: 'PATCH', body: JSON.stringify({ quantity: 0 }) })
    └── [Project] Express REST API Boundary (server/index.js)
        └── [Folder] server/routes/
            └── [File] inventory.js
                └── [Class] Express Inventory Controller
                    └── [Method] router.patch('/:id', validateInventoryPayload, (req, res) => { ... })
                        ├── [Variable State Shift] Inbound Payload: req.body.quantity = 0
                        ├── [Variable State Shift] Existing Item State: existingItem.quantity = 45 -> updatedItem.quantity = 0
                        └── [Method] triggerStockoutPOAutomation(item: updatedItem, tenantId: "tenant_01")
                            └── [Folder] server/services/
                                └── [File] poAutomation.js
                                    └── [Class] PO Automation Engine
                                        └── [Method] triggerStockoutPOAutomation(item: Item, tenantId: string)
                                            ├── [Variable State Shift] Stockout Evaluation: item.quantity === 0 -> true
                                            ├── [Method] memoryDb.inventory_suppliers.find(is => is.inventory_id === "inv_101" && is.is_primary)
                                            ├── [Variable State Shift] Resolved Primary Vendor: supplier_id = "sup_01" (Apex Electronics), unit_cost = $11.50
                                            ├── [Variable State Shift] Calculated PO Metrics: reorderQty = 100, totalAmount = $1,150.00, poNumber = "PO-AUTO-4015"
                                            ├── [Method] memoryDb.purchase_orders.unshift(newPO)
                                            ├── [Variable State Shift] Inserted Record: newPO = { id: "po_1791708206329", po_number: "PO-AUTO-4015", status: "APPROVED", total_amount: 1150 }
                                            ├── [Method] memoryDb.po_items.unshift(poItem)
                                            └── [Method] return { autoPoTriggered: true, purchaseOrder: newPO }
    └── [Project] HTTP Response Return Hop
        └── [Folder] client/src/components/
            └── [File] SlideOutPane.jsx
                └── [Class] React Presenter Component
                    └── [Method] handleSimulateStockout() [Response Promise Resolution]
                        ├── [Variable State Shift] Received Response: res.ok = true, data.poTriggered.purchaseOrder.po_number = "PO-AUTO-4015"
                        ├── [Method] toast.warn("Stockout triggered! Automatic Purchase Order PO-AUTO-4015 generated in PostgreSQL.")
                        ├── [Variable State Shift] UI State Shift: Toast Notification Rendered on Screen
                        └── [Method] onItemUpdated() -> Refreshes React Inventory Table State
```
