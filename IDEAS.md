this is where i brain dump all nonMVP / polishing TODOs,
so i can relax after record it somewhere, here,
and focus back to my MVP

1. DATABASE_README.md => use SchemaSpy

2. DATABASE DIAGRAM:
	- criteria:
		- priority: ACCURACY OF LINKING FK, FROM WHICH COLUMN TO WHICH COLUMN
		- good to have: colours
		- aesthetic: all linking FK moving lines (screen record => .gif)    
	- tools/webs:
		- `SchemaSpy` 
		- `dbdocs.io`

3. prettier
	- implement it after finish debugging and NONMVP , before submitting,
	- then retest so it confidently DOES NOT interfer with code logic

4. pnpm is better than npm for microservices 
	- discuss with teammates after finish development only 
	- explanationn detail is in FORGET_ME_NOTS.md

5. skip upgrade to `postgres-18` 
	- only "pretty-to-have", not "practically-helpful"
	- uuidv7()'s main benefit (better index performance from time-ordered inserts) matters at a data scale you're nowhere near for a school project, you're testing with a handful of manually-created UUIDs, not millions of rows where insert-order-driven index fragmentation becomes measurable.
	- if you want to mention it at all, note it as a "future consideration" in your README

6. Edit profile-system-db’s, game and website dockerignore later
7. 2 drizzle files in fs-dev
8. postgres-client in fs-dev
9. relation on all schemas, whats postgres default iof no relations defined?
10. change import from drizzlefiles instead of in-memory files
11. database diagram other than mermaid chart (mermaid chart make FK linking not accurate at all, makes me cant sleep coz of the inaccuracy)
12. merge dev-fs into int/fs-db , recheck the types
13. double confirm the types methodology accuracy for profile-system types in pd-db-int branch too, just like how fs types is implemented
14. fs.status -> enum -> pgEnum,
    ps.badge  -> enum -> pgEnum,
	ps.acheievements -> jsonb -> leave it. 
15. implement additional_context (d-c.yml) and copy specifically from each additional_context(Dockerfile) 
