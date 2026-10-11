# Milestone 2

This document should be completed and submitted during **Unit 6** of this course. You **must** check off all completed tasks in this document in order to receive credit for your work.

## Checklist

This unit, be sure to complete all tasks listed below. To complete a task, place an `x` between the brackets.

- [x] In `planning/wireframes.md`: add wireframes for at least three pages in your web app.
  - [x] Include a list of pages in your app
- [x] In `planning/entity_relationship_diagram.md`: add the entity relationship diagram you developed for your database.
  - [x] Your entity relationship diagram should include the tables in your database.
- [x] Prepare your three-minute pitch presentation, to be presented during Unit 7 (the next unit).
  - [x] You do **not** need to submit any materials in advance of your pitch.
- [x] In this document, complete all three questions in the **Reflection** section below

## Reflection

### 1. What went well during this unit?

Designing the UI/UX wireframes and PostgreSQL Entity Relationship Diagram (ERD) for SupplyAgent went exceptionally well. We clearly mapped out our 3 core React views (Tenant Dashboard, Inventory Management CRUD with modals/slide-out panes, and Automated PO / A2A Negotiation View) to clean ASCII mockups and React component hierarchies. Furthermore, modeling our 7 PostgreSQL tables—including 1:M relationships for tenant scoping and PO generation, and M:M junction tables like `inventory_suppliers` and `po_items`—allowed us to firmly validate our multi-tenant security architecture and event-driven stockout workflows before writing production code.

### 2. What were some challenges your group faced in this unit?

The primary challenge was designing a database schema that seamlessly captures both traditional multi-tenant inventory scoping and complex autonomous agent capabilities (such as Agent-to-Agent supplier quote negotiations and Human-in-the-Loop approval checkpoints). Synthesizing M:M relational mappings for inventory-to-supplier pricing while ensuring all queries remain strictly isolated by `tenant_id` required careful constraint modeling and clear documentation.

### 3. What additional support will you need in upcoming units as you continue to work on your final project?

As we transition into Unit 7 (3-minute pitch presentation and core feature implementation), additional guidance on structuring an engaging technical pitch demo, managing complex asynchronous React state during live agent quote streaming, and setting up automated Playwright test scripts for verifying modal overlays and database resets will be highly valuable.
