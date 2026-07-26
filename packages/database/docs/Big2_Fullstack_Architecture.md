# Comprehensive Fullstack Architecture
**Project:** 3D big2 Web App Game (PERN Stack + Docker + Monorepo Microservices + 1 Database only)<br>
**Purpose:** Documentation and onboarding guide for the team regarding Database Management, Microservices, and API Gateway Architecture.<br>

### Folder Structure (The "Binary Tree")
```
/big2
  ├── package.json               <-- (The Workspace Map)
  ├── Makefile                   <-- To make project run with 1 command only  [PDF rule]
  ├── docker-compose.yml         <-- For deployment                           [PDF rule]
  │
  ├── /packages                      (The Factory)
  │   ├── /database              <-- Shared Libraries/Tools & Single Source of Truth (Postgres & Drizzle)
  │   └── /auth-utils            <-- Shared security logic                           (The math logics only)
  │ 
  ├── /backend              (The HQ)
  │   ├── /chat                  <-- Private backend microservice
  │   ├── /authentication        <-- Private backend microservice
  │   ├── /bot                   <-- Private backend microservice
  │   └── /game-backend          <-- Private backend microservice
  │
  └── /frontend             (The Shop)
      ├── /website               <-- Frontend microservice
      └── /game-frontend         <-- Frontend microservice
```
