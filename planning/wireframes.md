# Wireframes: SupplyAgent (Sovereign Supply Chain Orchestrator)

This document details the UI/UX architecture and page component layouts for SupplyAgent. Each view includes ASCII-based layout mockups mapping directly to React frontend components (`Header`, `Sidebar`, dynamic data tables, modal dialogs, slide-out side panes, and asynchronous loading states).

---

## List of Pages

Below is the list of key pages and views in SupplyAgent:

1. ⭐ **Tenant Dashboard & Overview View** (`/dashboard`)
2. ⭐ **Inventory Management & CRUD View** (`/inventory` with Modals & Slide-Out Panes)
3. ⭐ **Automated Purchase Order & A2A Negotiation View** (`/purchase-orders` & `/negotiations`)
4. **Supplier Network & Vendor Portal View** (`/suppliers`)
5. **Tenant Settings & Audit Logs View** (`/settings`)

---

## Wireframe 1: Tenant Dashboard & Overview View ⭐

### Description & React Mapping
The **Tenant Dashboard** serves as the operational hub for Supply Chain Managers. It features a top header with an active tenant switcher (`tenant_id` state context), a sidebar for navigation, key KPI metric cards, stockout alert banners, and a real-time activity feed showing automated agent actions.

### React Component Layout Mapping
- `<AppLayout>`
  - `<Header>` (Tenant Selector Dropdown, Connection Status Badge, User Profile)
  - `<Sidebar>` (Active Route Navigation Links, Quick Reset Button)
  - `<DashboardView>`
    - `<KPIMetricsGrid>` (Total Items, Stockout Items, Pending POs, Total Spend)
    - `<StockoutAlertBanner>` (Trigger A2A Negotiation CTA)
    - `<RecentActivityFeed>` (Real-Time Async Agent Logs & PO Statuses)
    - `<InventoryHealthChart>` (Category Breakdown & Low Stock Overview)

### ASCII Wireframe
```text
+---------------------------------------------------------------------------------------------------+
|  SupplyAgent  [ Tenant: Acme Corp (tenant_01) v ]         (O) System Active  [ User Profile (v) ] |
+------------------+--------------------------------------------------------------------------------+
| [NAVBAR]         | Dashboard / Overview                                                           |
|                  +--------------------------------------------------------------------------------+
|  [x] Dashboard   | +-----------------+  +-----------------+  +-----------------+  +-----------------+ |
|  [ ] Inventory   | | TOTAL SKUS      |  | STOCKOUT ALERTS |  | PENDING POs     |  | MONTHLY SPEND   | |
|  [ ] PO & A2A    | | 1,240 Items     |  | 3 Items (CRITICAL) | 5 Orders      |  | $142,500.00     | |
|  [ ] Suppliers   | +-----------------+  +-----------------+  +-----------------+  +-----------------+ |
|  [ ] Settings    |                                                                                |
|                  | +----------------------------------------------------------------------------+ |
| ---------------- | | ! CRITICAL STOCKOUT ALERT: SKU-8842 (Microcontroller Unit) Quantity = 0     | |
| [Reset Demo DB]  | | [Trigger A2A Supplier Negotiation]   [Auto-Draft Purchase Order]          | |
|                  | +----------------------------------------------------------------------------+ |
|                  |                                                                                |
|                  | +------------------------------------+  +------------------------------------+ |
|                  | | RECENT AGENT & PO ACTIVITY         |  | INVENTORY HEALTH BY CATEGORY       | |
|                  | |------------------------------------|  |------------------------------------| |
|                  | | * [10:42 AM] A2A Quote Requested   |  | Semiconductors : 85% Stock         | |
|                  | |   Supplier: Apex Electronics       |  | Connectors     : 40% (Low Stock)    | |
|                  | | * [10:30 AM] PO #1042 Generated    |  | Microcontrollers: 0% (STOCKOUT)    | |
|                  | | * [09:15 AM] Tenant DB Seeded      |  | Passive Components: 92% Stock      | |
|                  | +------------------------------------+  +------------------------------------+ |
+------------------+--------------------------------------------------------------------------------+
```

---

## Wireframe 2: Inventory Management & CRUD View ⭐

### Description & React Mapping
The **Inventory Management View** allows administrators to inspect, filter, search, create, update, and delete inventory items within their active tenant scope. It features dynamic sorting, category filtering, an interactive **Slide-Out Detail Pane**, and a **Modal Dialog** for item creation/editing with button-disabling loading spinner states.

### React Component Layout Mapping
- `<AppLayout>`
  - `<Header>`
  - `<Sidebar>`
  - `<InventoryView>`
    - `<InventoryToolbar>` (Search Bar, Category Filter, Stock Status Filter, "Add Item" CTA, "Reset DB" Button)
    - `<InventoryTable>` (Paginated, Sortable Columns: SKU, Name, Category, Qty, Spot Rate, Actions)
    - `<LoadingSpinnerOverlay>` (Visible during dynamic API fetch requests)
    - `<ItemCrudModal>` (Modal overlay for Add / Edit Item with validation error banners)
    - `<ItemDetailSlideOutPane>` (Slide-out side pane for deep item analytics & A2A triggers)

### ASCII Wireframe (Main Table & Search Controls)
```text
+---------------------------------------------------------------------------------------------------+
|  SupplyAgent  [ Tenant: Acme Corp (tenant_01) v ]                            [ User Profile (v) ] |
+------------------+--------------------------------------------------------------------------------+
|  [ ] Dashboard   | Inventory Management (Tenant: Acme Corp)                                       |
|  [x] Inventory   +--------------------------------------------------------------------------------+
|  [ ] PO & A2A    | [ Search SKU / Name... ]  Category: [ All v ]  Status: [ Low Stock v ]         |
|  [ ] Suppliers   | [ + Add New Item ]   [ Reset Tenant Database ]                                 |
|  [ ] Settings    +--------------------------------------------------------------------------------+
|                  | SKU       NAME               CATEGORY         QTY   SPOT RATE   ACTIONS        |
|                  |--------------------------------------------------------------------------------|
|                  | SKU-101   ARM Cortex M4 MCU  Microcontrollers   0   $12.50      [Edit] [Delete]|
|                  | SKU-102   USB-C Connector    Connectors       15   $1.20       [Edit] [Delete]|
|                  | SKU-103   10uF Capacitor     Passives       1,200   $0.15       [Edit] [Delete]|
|                  | SKU-104   Power Management   Semiconductors    0   $8.75       [Edit] [Delete]|
|                  |--------------------------------------------------------------------------------|
|                  | Showing 1 - 4 of 1,240 items                      < Previous  [ 1 ] 2 3  Next >|
+------------------+--------------------------------------------------------------------------------+
```

### ASCII Wireframe: Slide-Out Side Pane (Item Detail & Stockout A2A Trigger)
```text
+--------------------------------------------------+------------------------------------------------+
| Inventory Table (Background - Blurred)           | SLIDE-OUT ITEM DETAILS: SKU-101                |
|                                                  |------------------------------------------------|
| SKU-101   ARM Cortex M4 MCU                      | Item Name: ARM Cortex M4 Microcontroller       |
| SKU-102   USB-C Connector                        | Category: Microcontrollers                     |
|                                                  | Current Stock: 0 Units (CRITICAL STOCKOUT)     |
|                                                  | Reorder Threshold: 50 Units                    |
|                                                  | Current Spot Rate: $12.50 / unit               |
|                                                  | Primary Supplier: Apex Electronics             |
|                                                  | Target Lead Time: 5 Days                       |
|                                                  |------------------------------------------------|
|                                                  | A2A NEGOTIATION STATUS:                        |
|                                                  | Status: Autonomous Quote Requested             |
|                                                  | Best Offer: $11.80 / unit (Supplier Apex)      |
|                                                  |------------------------------------------------|
|                                                  | [ Edit Item ]   [ Initiate A2A Reorder ]       |
|                                                  | [ Close Pane ]                                 |
+--------------------------------------------------+------------------------------------------------+
```

### ASCII Wireframe: Create/Edit Item Modal (With Validation & Loading State)
```text
+---------------------------------------------------------------------------------------------------+
|                                                                                                   |
|       +-----------------------------------------------------------------------------------+       |
|       | EDIT INVENTORY ITEM (SKU-101)                                                 [X] |       |
|       +-----------------------------------------------------------------------------------+       |
|       |  [!] Error: Quantity cannot be negative.                                          |       |
|       |                                                                                   |       |
|       |  Item Name:     [ ARM Cortex M4 MCU                                             ] |       |
|       |  Category:      [ Microcontrollers                                            v ] |       |
|       |  Quantity:      [ 0                                                             ] |       |
|       |  Reorder Point: [ 50                                                            ] |       |
|       |  Spot Rate ($): [ 12.50                                                         ] |       |
|       |  Supplier:      [ Apex Electronics (ID: sup_01)                               v ] |       |
|       |                                                                                   |       |
|       |  +-----------------------------------------------------------------------------+  |       |
|       |  | [Cancel]                          [ (o) Saving... Button Disabled ]         |  |       |
|       |  +-----------------------------------------------------------------------------+  |       |
|       +-----------------------------------------------------------------------------------+       |
|                                                                                                   |
+---------------------------------------------------------------------------------------------------+
```

---

## Wireframe 3: Automated Purchase Order & A2A Negotiation View ⭐

### Description & React Mapping
The **Automated Purchase Order & A2A Negotiation View** visualizes autonomous supply chain procurement workflows. When stockout events occur, the backend agent initiates Agent-to-Agent (A2A) quote negotiations with vendors. Supply Chain Managers can review quote options, view negotiation histories, and approve/reject orders in a **Human-in-the-Loop (HITL) Checkpoint Modal** before Purchase Orders are persisted in PostgreSQL.

### React Component Layout Mapping
- `<AppLayout>`
  - `<Header>`
  - `<Sidebar>`
  - `<PurchaseOrderView>`
    - `<PoTabNavigation>` (Tabs: "Active Purchase Orders", "A2A Supplier Negotiations", "Audit Trail")
    - `<ActiveNegotiationsList>` (Cards representing live stockout negotiations)
    - `<HitlApprovalModal>` (Human-in-the-Loop review modal for quote acceptance & PO generation)
    - `<PurchaseOrderTable>` (Persisted PostgreSQL PO records with status badges: `Draft`, `Pending`, `Approved`, `Fulfilled`)

### ASCII Wireframe (Active Purchase Orders & A2A Negotiation Queue)
```text
+---------------------------------------------------------------------------------------------------+
|  SupplyAgent  [ Tenant: Acme Corp (tenant_01) v ]                            [ User Profile (v) ] |
+------------------+--------------------------------------------------------------------------------+
|  [ ] Dashboard   | Automated Purchase Orders & A2A Negotiations                                   |
|  [ ] Inventory   +--------------------------------------------------------------------------------+
|  [x] PO & A2A    | [ Tab: Active Purchase Orders (5) ]  [ Tab: A2A Supplier Negotiations (2) ]     |
|  [ ] Suppliers   +--------------------------------------------------------------------------------+
|  [ ] Settings    | LIVE A2A STOCKOUT NEGOTIATIONS (Requires HITL Review)                          |
|                  | +----------------------------------------------------------------------------+ |
|                  | | SKU: SKU-101 (ARM Cortex MCU) | Stockout Date: 2026-03-30                    | |
|                  | | Supplier 1: Apex Electronics  | Quote: $11.80/unit | Lead: 3 Days (BEST OFFER)  | |
|                  | | Supplier 2: Zenith Logistics  | Quote: $12.10/unit | Lead: 5 Days               | |
|                  | | Status: Negotiation Complete  | [ Review & Generate PO (HITL Checkpoint) ]   | |
|                  | +----------------------------------------------------------------------------+ |
|                  |                                                                                |
|                  | PERSISTED PURCHASE ORDERS (PostgreSQL Database)                                |
|                  | PO NUMBER   SKU / ITEM           SUPPLIER         QTY    TOTAL COST   STATUS   |
|                  |--------------------------------------------------------------------------------|
|                  | PO-2026-01  SKU-101 ARM Cortex   Apex Electronics 100    $1,180.00    [APPROVED]
|                  | PO-2026-02  SKU-102 USB-C Plug    Global Components 500   $600.00      [PENDING] |
|                  | PO-2026-03  SKU-104 Power IC      Semicon Inc       250    $2,187.50    [DRAFT]   |
|                  |--------------------------------------------------------------------------------|
+------------------+--------------------------------------------------------------------------------+
```

### ASCII Wireframe: Human-in-the-Loop (HITL) PO Approval Modal
```text
+---------------------------------------------------------------------------------------------------+
|                                                                                                   |
|       +-----------------------------------------------------------------------------------+       |
|       | HUMAN-IN-THE-LOOP (HITL) PURCHASE ORDER APPROVAL                              [X] |       |
|       +-----------------------------------------------------------------------------------+       |
|       |  Triggering Event: Automatic Stockout Trigger (Quantity = 0)                      |       |
|       |  Target Item:      SKU-101 - ARM Cortex M4 Microcontroller                        |       |
|       |  Active Tenant:    Acme Corp (tenant_01)                                          |       |
|       |                                                                                   |       |
|       |  RECOMMENDED SUPPLIER QUOTE:                                                      |       |
|       |  +-----------------------------------------------------------------------------+  |       |
|       |  | Vendor: Apex Electronics (Supplier ID: sup_01)                              |  |       |
|       |  | Negotiated Unit Price: $11.80 (7% discount below $12.50 spot rate)            |  |       |
|       |  | Restock Quantity:      100 Units                                            |  |       |
|       |  | Total Order Amount:    $1,180.00 USD                                         |  |       |
|       |  | Estimated Delivery:    3 Business Days                                      |  |       |
|       |  +-----------------------------------------------------------------------------+  |       |
|       |                                                                                   |       |
|       |  [ Reject Quote ]                           [ Confirm & Generate Purchase Order ] |       |
|       +-----------------------------------------------------------------------------------+       |
|                                                                                                   |
+---------------------------------------------------------------------------------------------------+
```
