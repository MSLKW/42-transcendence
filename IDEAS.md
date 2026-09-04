this is where i brain dump all TODOs or nonMVPs + polishing,
so i can relax after record it somewhere, here,
and focus back to my MVP

## MVPs
### Backend & Database (in sequence)
1. types in general:
	- ~~fs.status -> enum -> pgEnum, (status -> renamed to fReqStatus in db too)~~
    - ps.badge  -> enum -> pgEnum,
	- ps.acheievements -> jsonb -> leave it. 
	- push

2. dev/fs:
	- adapt to changes of types
	- TS codebase adapt to types update
	- it runs well using in-memory files
	- push 
	- change import from drizzle files instead of in-memory files
	- push

3. int/fs-db
	- ~~merge dev-fs into int/fs-db~~
	- ~~schema~~
	- ~~index/uniqueIndex/check~~
	- ~~add 2 drizzle files~~
	- ~~add postgres.ts~~
	- ~~Drizzle code adapt to types update: pgEnum & enum in schema~~
	- backend codebase need to be adapted to database integration
	- it runs well with real database integration 
	- push

4. int/ps-db:
	- types: double confirm the types methodology accuracy for profile-system types in pd-db-int branch too, just like how fs types is implemented
	- any fixes needed upon schema 
	- any fixes needed upon types 
	- push

5. later when I add new Game-stats service
	- adjust every users/password/schema namings used permissions etc related to game
		- change: game => game-stats
	- adjust existing game-schema 
		- pull in badges and acheievements from profile-system into game-stats instead
	- ask azrul what are the updated badges / achievements that he setup already on website
	- create backend business logic , discuss with the azrul & team
	- int with database
	- testings
	- debugging
	- successful? done!

## NON-MVPs
### Database

1. All schemas refine:
	- implement relations on each schemas
	- QUESTION: whats postgres default if no relations defined?

2. DATABASE_README.md
	- use SchemaSpy

3. database diagram:
	- criteria:
		- priority: `ACCURACY OF LINKING FK`, FROM WHICH COLUMN TO WHICH COLUMN
		- better for clarity: different `colours` for each schemas
		- aesthetic: all linking FK moving lines (screen record => .gif)    
	- tools/webs:
		- `SchemaSpy` 
		- `dbdocs.io`
		- > REJECT MERMAID CHART (FK linking has HIGH INACCURACY of from which column to which column)

### Overall polishing

1. perf docker: 
	- d-c.yml: add additional_context
	- Dockerfile: COPY using the defined additional_context on own services
	- .dockerignore: edit adjusting to adding additional_context

2. pnpm is better than npm for microservices 
	- discuss with teammates after finish development only 
	- explain the bugs in npm that resolved by pnpm (solves disk size & phantom dependencies)
	- explanations in detail is in FORGET_ME_NOTS.md
	- agreement needed by the whole team, understandably everyone are used already to do commands of "npm ..."
	- alternative solution: eslint-plugin-import-x as root's devDep
		- only solves phantom dependencies, not disk size

3. prettier
	- implement it after finish debugging and NONMVP , before submitting,
	- then retest so it confidently DOES NOT interfer with code logic

4. current `postgres-17-bookworm` is most sufficient already, skip entirely `postgres-18` 
	- pg-18 is only "pretty-to-have", not "practically-helpful"
	- pg-18's uuidv7() main benefit (better index performance from time-ordered inserts) matters at a data scale you're nowhere near for a school project, you're testing with a handful of manually-created UUIDs, not millions of rows where insert-order-driven index fragmentation becomes measurable.
	- if you want to mention it at all, note it as a "future consideration" in your README

5. Healthchecks in docker-compose.yml for every services possible / that has it