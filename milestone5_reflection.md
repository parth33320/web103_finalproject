# Milestone 5 Reflection — CodePath WEB103 Final Submission

**Project Name:** SupplyAgent (Sovereign Supply Chain Orchestrator)
**Developer:** Parth Patel

---

### 1. What went well during this unit?
During Unit 9, the complete integration of backend Express routes, PostgreSQL database schema relationships (1:1, 1:M, and M:M with unique join fields), and the React frontend was seamless. Implementing automated Purchase Order (PO) creation upon stockouts and Human-in-the-Loop (HITL) quote review checkpoints provided an intuitive, production-grade Forward Deployed Engineering (FDE) workflow.

### 2. What were some challenges your group faced in this unit?
Managing zero-trust multi-tenant state scoping (`X-Tenant-ID`) while ensuring that automated stockout PO generation dynamically picked the correct primary supplier from the `inventory_suppliers` M:M junction table required careful architectural design. Additionally, ensuring smooth button disabling and instant toast notifications across slide-out panes and modal dialogs required disciplined React state management.

### 3. What were some of the highlights or achievements that you are most proud of in this project?
The standout achievement is the realization of an autonomous supply chain orchestrator: when an inventory SKU reaches zero, the system automatically dispatches an Agent-to-Agent (A2A) negotiation request, retrieves supplier quote terms, drafts a formal Purchase Order in PostgreSQL, and presents a Human-in-the-Loop (HITL) approval modal to the user.

### 4. Reflecting on your web development journey so far, how have you grown since the beginning of the course?
Starting from foundational HTML/CSS/JavaScript and React concepts in WEB101-102, WEB103 enabled me to master full-stack software architecture—building normalized PostgreSQL databases with complex relationships, architecting Express REST APIs, enforcing multi-tenant security, and crafting responsive executive dashboards in React.

### 5. Looking ahead, what are your goals related to web development, and what steps do you plan to take to achieve them?
My immediate goal is to deepen expertise in Forward Deployed Engineering (FDE) and Autonomous AI Workflow Orchestration. I plan to build microservice architectures, deploy serverless event-driven systems on cloud platforms, and contribute to open-source supply chain and enterprise automation projects.
