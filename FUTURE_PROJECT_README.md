here are what im going to include in the future readme for the project (this is the draft for the official one)

### 1. Project Architecture(Microservice) & Source Layout (Monorepo).
#### Monolith vs. monorepo — these are unrelated axes, often confused

They're not opposites of each other — one is about how many services run, the other is about how your source code is organized in git.

##### Monolith vs. Microservices = a runtime/architecture question:

Monolith: one single application/process does everything (auth, friends, game logic, DB access) — one deploy unit.
Microservices (what you're building): many small independent services, each doing one job, talking over the network — multiple deploy units. Your authentication, friends-system, party-manager, profile-system are each their own microservice.

##### Monorepo vs. Polyrepo = a source-control/repo layout question:

Monorepo: all your services + shared packages live in one single git repository (yours — 42-transcendence — is a monorepo: services/, packages/, infra/ all under one repo root).
Polyrepo: each service (or each package) lives in its own separate git repository, versioned and released independently.

#### So you can have any combination:

Monolith in a monorepo (trivial — it's just one app in one repo)
Microservices in a monorepo (your setup — many small services, one repo)
Microservices in a polyrepo (each service its own repo — common at large companies)
Monolith in a polyrepo (rare/pointless, but possible)

Your project is microservices architecturally, monorepo in terms of source layout. That combination is exactly why you need things like additional_contexts, npm workspaces, and tsc -b project references — they're all tools for "many independently-runnable things sharing one repo and some common code."

### 2. 

