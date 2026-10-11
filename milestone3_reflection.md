# Milestone 3 Reflection: SupplyAgent (Sovereign Supply Chain Orchestrator)

**Course:** CodePath WEB103 (Unit 7 Milestone 3)
**Project:** SupplyAgent (Sovereign Supply Chain Orchestrator)
**Developer:** Parth Patel

---

## 1. What went well during this unit?

During Milestone 3 (Unit 7), our team successfully executed our core project management setup and completed foundational full-stack milestone deliverables. Pitching our project vision—**SupplyAgent (Sovereign Supply Chain Orchestrator)**—during the in-class pitch session was an exceptional success. Classmates and reviewers responded enthusiastically to our approach of combining multi-tenant PostgreSQL data isolation with automated stockout Purchase Order (PO) triggers and Agent-to-Agent (A2A) supplier quote negotiations.

Technically, establishing our GitHub Project Board, creating granular issues linked to our technical feature set, and organizing our 5 unit milestones allowed us to systematically complete 100% of Milestone 3 sprint tasks. We established our core Express REST API endpoints, connected our normalized PostgreSQL database schema (supporting both 1:M and M:M relationships), implemented tenant scoping middleware, and built out the primary React frontend interface with dynamic routes, slide-out side panes, and modal dialogs.

---

## 2. What were some challenges your group faced in this unit?

Our primary technical challenge during this unit was coordinating multi-tenant state management across backend Express middleware and frontend React components during asynchronous operations. Ensuring that all database queries strictly filtered by `tenant_id` without introducing latency or redundant queries required careful middleware design (`tenantScope.js`).

Another key challenge was orchestrating the automated trigger for stockout events: when an inventory item quantity reaches zero, the backend must instantly create a Purchase Order and initiate an asynchronous supplier quote negotiation log. Preventing race conditions and ensuring smooth UI responsiveness (via loading spinners and button disabling state) required rigorous asynchronous handling and component error boundary configurations.

---

## 3. Did you finish all of your tasks in your sprint plan for this week? If you did not finish all of the planned tasks, how would you prioritize the remaining tasks on your list?

Yes, we successfully finished 100% of the tasks in our sprint plan for Milestone 3 (Unit 7). All 5 GitHub issues created for this unit—ranging from database initialization and tenant middleware to full RESTful CRUD operations and React routing—were completed and verified.

For upcoming units (Milestones 4 and 5), if unforeseen blockers arise, our prioritization matrix will remain centered on core system integrity:
1. **P0 (Critical):** Core multi-tenant PostgreSQL data security, database persistence integrity, and backend REST endpoint stability.
2. **P1 (High):** Automated stockout PO generation triggers and Human-in-the-Loop (HITL) quote approval workflows.
3. **P2 (Medium):** Advanced UI animations, enhanced slide-out pane transitions, and search/filter enhancements in the React frontend.

---

## 4. Which features and user stories would you consider “at risk”? How will you change your plan if those items remain “at risk”?

Currently, none of our baseline core features or primary user stories are at risk, as our backend REST endpoints, database schema, and frontend views are already operational. However, our complex custom stretch feature—**Autonomous Multi-Party A2A Supplier Negotiation Workflows with Dynamic Re-negotiation**—carries moderate complexity risk due to asynchronous state synchronization between external supplier mocks and internal tenant databases.

If this feature experiences delays or remains at risk during Milestone 4 development, we will execute our contingency plan: simplify the A2A negotiation logic to a deterministic rule-based supplier selection model (e.g., auto-selecting the lowest cost / shortest lead-time supplier from our `inventory_suppliers` junction table) while preserving full Human-in-the-Loop (HITL) manual override capabilities in the React UI.

---

## 5. What additional support will you need in upcoming units as you continue to work on your final project?

As we advance into Milestone 4 (Unit 8) and prepare for final production deployment on Render in Unit 9, the following areas of support will be valuable:
- **Deployment & Production Environment Configuration:** Best practices for deploying a full-stack React + Express + PostgreSQL application to Render, including managing environment variables (`DATABASE_URL`, `JWT_SECRET`), configuring SSL connections for production PostgreSQL, and setup of healthcheck endpoints.
- **Automated E2E Testing & Pre-Commit Workflows:** Strategies for optimizing pre-commit verifications, Playwright UI testing for slide-out panes and modal workflows, and ensuring clean CI/CD runs.
- **Demo Day Presentation Refinement:** Guidance on structuring our final Demo Day pitch and live feature presentation to effectively communicate technical complexity (multi-tenant architecture & automated PO orchestration) in a concise, high-impact demonstration.
