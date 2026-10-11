# Milestone 2 Reflection: SupplyAgent (Sovereign Supply Chain Orchestrator)

**Course:** CodePath WEB103 (Unit 6 Milestone 2)
**Project:** SupplyAgent (Sovereign Supply Chain Orchestrator)
**Developer:** Parth Patel

---

## 1. What went well during this unit?

During Milestone 2, our primary focus was establishing the UI/UX component architecture through comprehensive wireframes (`planning/wireframes.md`) and designing a normalized PostgreSQL Entity Relationship Diagram (`planning/entity_relationship_diagram.md`).

Key achievements that went exceptionally well include:
- **Component-Driven Wireframing:** Successfully mapped 3 core React views (Tenant Dashboard, Inventory CRUD Management with slide-out side panes & modal overlays, and Automated Purchase Order / A2A Negotiation View) directly to React component hierarchies. Each layout explicitly accounts for loading states, action button disabling, and error alert banners.
- **Robust PostgreSQL Schema Architecture:** Modeled 7 database tables (`tenants`, `inventory`, `suppliers`, `inventory_suppliers`, `purchase_orders`, `po_items`, and `a2a_negotiations`). The schema captures both 1:M relationships (tenant inventory isolation, purchase order issue) and M:M relationships (vendor pricing junction tables and PO line item mappings) using Mermaid.js syntax and detailed column constraint definitions.
- **Alignment with Autonomous Workflows:** Seamlessly integrated database tables for Agent-to-Agent (A2A) quote negotiations and Human-in-the-Loop (HITL) approval checkpoints directly into our core entity structures.

---

## 2. What were some challenges your group faced in this unit?

The main challenges encountered during Milestone 2 revolved around database modeling complexity and UI workflow balancing:

- **Balancing Relational Complexity with Multi-Tenant Isolation:** Ensuring that every table holding operational data (`inventory`, `purchase_orders`, `a2a_negotiations`) enforces strict tenant scoping (`tenant_id`) while maintaining normalized M:M junction tables (such as `inventory_suppliers` for vendor lead times and unit pricing).
- **Designing Intuitive HITL Checkpoints in UI:** Structuring the UI wireframes so that automated stockout triggers (quantity = 0) dispatch vendor quote requests without overwhelming the user. We solved this by designing a dedicated Human-in-the-Loop (HITL) modal overlay where supply chain managers can review negotiated vendor quotes before finalizing and persisting Purchase Orders into PostgreSQL.
- **Standardizing Asynchronous Feedback Patterns:** Designing UI wireframes that clearly communicate async backend API communication (e.g., real-time loading spinners, disabled submission buttons during pending API calls, and inline validation banners).

---

## 3. What additional support will you need in upcoming units as you continue to work on your final project?

As we advance into Unit 7 (3-minute pitch presentation) and subsequent technical implementation phases, the following areas of support and focus will be key:

- **Pitch Presentation Guidance:** Strategies for effectively delivering a compelling 3-minute pitch that highlights SupplyAgent's core problem (legacy static ERPs vs. modern autonomous orchestrators), technical architecture (multi-tenant Express/PostgreSQL), and live workflow demonstration.
- **Async State & Real-Time Agent Feedback:** Best practices for managing complex asynchronous state in React when handling live A2A quote negotiations and database resets without UI lag or race conditions.
- **E2E & UI Verification:** Guidance on leveraging Playwright automation to verify dynamic modal overlays, slide-out side panes, and multi-tenant session switching.
