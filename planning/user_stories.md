# User Stories

Reference the Writing User Stories final project guide in the course portal for more information about how to complete each of the sections below.

## Outline User Roles

1. **Supply Chain Manager / Tenant Admin**: An enterprise logistics administrator responsible for monitoring multi-tenant inventory levels, creating/editing stock items, approving procurement orders, and configuring tenant settings.
2. **Supplier / Vendor**: An external supply chain partner who receives automated quote requests and purchase orders, provides fulfillment pricing and lead times, and manages order statuses.

## Draft User Stories

1. As a Supply Chain Manager, I want to switch between active tenant profiles (e.g., Tenant A vs. Tenant B), so that I can view and manage isolated inventory levels without cross-tenant data leakage.
2. As a Supply Chain Manager, I want to view a complete list of inventory items with quantities, transit times, and spot rates, so that I can assess overall stock health across active warehouses.
3. As a Supply Chain Manager, I want to filter inventory items by category or low-stock status and sort them by quantity or spot rate, so that I can quickly identify items requiring immediate attention.
4. As a Supply Chain Manager, I want to add new inventory items, edit item details, and delete obsolete stock via slide-out panes and modal dialogs, so that my inventory database remains accurate and up to date.
5. As a Supply Chain Manager, I want to use an intelligent conversational chat interface instead of a static dashboard, so that I can query inventory health and issue logistics reallocation commands in plain language.
6. As a Supply Chain Manager, I want to review automated reallocation plans in a Human-in-the-Loop (HITL) approval checkpoint before execution, so that critical supply chain modifications are verified before impacting live operations.
7. As a Supply Chain Manager, I want to see real-time loading spinners and have action buttons disabled during backend processing, so that I receive clear visual feedback and avoid duplicate command submissions.
8. As a Supply Chain Manager, I want the system to automatically trigger an Agent-to-Agent (A2A) negotiation request when an item hits a stockout (quantity = 0), so that supplier quote requests are dispatched without manual delay.
9. As a Supplier / Vendor, I want to receive automated quote requests containing stockout SKUs and respond with restock quantities, unit pricing, and lead times, so that purchase terms are negotiated efficiently.
10. As a Supply Chain Manager, I want the system to automatically draft and persist a formal Purchase Order (PO) in PostgreSQL upon accepting a supplier quote, so that stockout replenishment is immediately documented in the database.
11. As a Supply Chain Manager, I want to see clear, human-readable error banners when a network error or invalid form submission occurs, so that I can correct input errors or retry failed API requests gracefully.
12. As a Supply Chain Manager, I want to reset and re-seed the PostgreSQL database to its initial demo state using a single control button, so that I can run clean testing scenarios and live product demonstrations.
13. As a Supply Chain Manager, I want to view audit logs of all executed SQL queries tagged with my active tenant_id, so that I can verify zero-trust multi-tenant security and regulatory compliance.
