## notes for me to remember, FOR ACTUAL PROJECT IMPLEMENTATIONS

1. node modules only exist at root 
	- entire project depends on 1 single same node_modules/ at root
	- coz we use root's package.json that uses workspace field
	- so even in Docker they will depend on the root's node_modules/ alone, which generated in Docker, not taken from host
	- root's package-lock.json is copied into Docker to minimize buildtime huhu. or else lama nak ...

2. multiple .*ignore
	- `.dockerignore`
		- Docker only ever reads one. period.
		- it must sits at the root of `context`
	- `.gitignore`
		- Git explicitly supports having a .gitignore in every folder
		- all of them apply simultaneously
		- combining the root .gitignore with every nested one along that path
		- deeply-nested .gitignore can override parent's .gitignore. ex:
			- root's .gitignore => *.log, 
			- services/friends-system/.gitignore => specifically un-ignore one particular log file with a ! prefix
			- BUT, !services/friends-system/keep-this.txt only works if services/friends-system/ itself was never ignored as a whole directory
	- .prettierignore
		- `https://prettier.io/docs/ignore`:
			- To exclude files from formatting, create a .prettierignore file in the root of your project. .prettierignore uses gitignore syntax.
			- other specific ways on other file extensions

3. implementing `microservices` in `Docker`
	- Dockerfile's selective copying is what makes this a true, isolated microservice build
	- QUESTION: what about "COPY . ."? that dosent look like microservice tho? 
		- YUP, its def not microservice like this
		- SOLUTION: 
			1. `context` is the own service's path itself
			2. implement `additional_context` in dc.yml + Dockerfile 
				- Dockerfile cannot COPY backwards. it only go onwards from what defined as `context` in docker-compose.yml
				- so just dockerignore within context, yeayy EASY!
			3. minimize Dockerfile lines using `tsc -b` 
				- for dockerfile use only, dev will use, depends, tsc or tsup instead
				- automated through the deoendency chain

4. pnpm is better than npm for microservices 
	- npm(2010) = it's the default, "just works" choice.
	- pnpm arrived later (2016) specifically because npm's design has two real, related costs::
		- disk waste: 
			- every single project on your machine gets its own full copy of every dependency 
			- even if ten projects all use the exact same version of express 
		- phantom dependencies: 
			- hoisting lets code silently use packages it never declared.
			- hoisting: dosent include its imports in its own package.json, but took from its other dependencies that listed the said imports in their package.json
			- esp since all workspaces using the same and only node_modules/ used/exist in the entire project Docker
	- pnpm offers solution for these 2 issues above by:
		- disk-space
			- it keeps one single global store of every package version on your entire machine (not per-project),
			- and links files into each project via hard links/symlinks instead of copying 
		- phantom dependencies
			- it builds each workspace's node_modules as a strict, 
			- symlinked structure containing only what that specific package explicitly declared
			- nothing hoisted, nothing borrowed from a sibling.
	- result of implementing this:
		- pnpm makes that import fail immediately — turning the bug class into something structurally impossible, rather than something you have to remember to check manually or lint for.

5. Does pnpm migration touch tsconfig.json?
	- No, tsconfig.json governs TypeScript's own compilation behavior (moduleResolution, target, etc.)
	- completely independent of which package manager installed the files on disk. 
	- What actually changes: 
		- package-lock.json deleted, 
		- pnpm-lock.yaml generated instead; your Dockerfile's npm ci → pnpm install --frozen-lockfile; 
		- and one new file you'd need that doesn't exist today — pnpm-workspace.yaml at the repo root, 
			- since pnpm doesn't read the "workspaces" array inside package.json the way npm does, it requires its own separate file listing the same folders. 
	- Everything else — your actual .ts source files, tsconfig.json, imports — untouched.

6. for generating DATABASE DIAGRAM later:
	- criteria:
		- priority: ACCURACY OF LINKING FK, FROM WHICH COLUMN TO WHICH COLUMN
		- good to have: colours
		- aesthetic: all linking FK moving lines (screen record => .gif)    
	- tools/webs:
		- `SchemaSpy` 
			- wins in precision
			- connects directly to your real Postgres instance, introspects the actual tables/FKs, and generates `static PNG/SVG images` with guaranteed-accurate arrows, since it's reading the database itself, not a hand-drawn guess. 
			- This directly solves your "arrows not from the real column origin" complaint — it can't be wrong, because it's not manually drawn at all.
			- no new persistent service needed, just a command you run when you want a fresh export, must while Postgres is running
				```
				// terminal
				docker run --rm --network=<your_database_network_name> \
				-v "$(pwd)/schemaspy-output:/output" \
				schemaspy/schemaspy:latest \
				-t pgsql -host postgresql -port 5432 -db <PGDATABASE> \
				-u <PGUSER> -p <password> -o /output
				```
			- Since it joins your database network by name, it can reach the postgresql container exactly the way your other services already do — no new persistent service needed, just a command you run when you want a fresh export.
		- `dbdocs.io`
			- dbdocs.io stays closer to drawSQL's interactive & colorful style, 
			- but shares the same limitation as drawSQL: real precision and hover-highlighting only exist in the `live interactive canvas`
			- can try to see later if we can screen record the precision during live, and make it as .gif! 


7. database/store's job:
	- just read/write the row you ask for
8. backend's job:
	- decide business rules
	- throw and catch
	- error handling on situational edge cases
9. .limit(1) on .returning() — not needed, and here's the actual reason
	- .returning() only returns rows that were actually affected by that specific INSERT/UPDATE/DELETE statement, not rows found by a search. 
	- Since your .values({ senderId, receiverId }) inserts exactly one row (in sendRequest()), .returning() only hand back exactly one row, period.
	- .limit() only earns its keep on .select()

10. Standard industry practice
	- Repository pattern (or "ports and adapters" more formally): 
		- an interface (FriendRequestRepository) as the "port,"
		- a concrete implementation (DrizzleFriendRequestRepository) as the "adapter." 
		- This is genuinely how larger production codebases are structured, not a school-project simplification
	- service layer:
		- One real gap at larger scale, worth knowing even if you don't build it now: 
		- bigger systems usually add a `service layer` between handlers and stores
		- handlers stay thin (parse request → call service → format response),
		- business rules (the "must still be Pending" check, the "auto-close reverse request" logic) live in a FriendRequestService rather than directly in the handler. 
		- At your current size, keeping that logic in handlers is completely reasonable — just know the next layer up has a name, in case you ever want to point to it.

11. terminology used:
	- Drizzle: "Drizzle queries" or "Drizzle's query builder API."
		- Drizzle isn't a heavy, hides-everything ORM like some others — it's specifically marketed as a query builder that stays close to real SQL shape (.select().from().where() mirrors SQL structure directly). So "I'm writing Drizzle queries" is accurate; calling it "SQL" is technically wrong (you're writing TypeScript that Drizzle compiles into SQL, not SQL itself) — worth keeping that distinction crisp in your own head and your README.
	- "querying Postgres"
		- "querying" is the correct, precise word for what your store classes do (select/insert/update/delete are all queries). "Communicating with the database" is fine as looser prose in a README or verbal explanation, but in code comments, "queries Postgres via Drizzle" is the tighter, more accurate phrasing.
		
12. "Store" vs "Repository" directory naming
	- both real, one is more universally recognized
	- "Store" isn't wrong, 
	- but the more common industry term specifically for this exact pattern (backend data-access classes) is "Repository" — FriendRequestRepository, DrizzleFriendRequestRepository. 
	- Worth knowing the more common name, because "Store" carries a specific other association in the JS ecosystem — Redux/Zustand "stores" (frontend state management)
	- so a reader skimming your backend code might briefly expect frontend-style reactive state rather than a data-access class. 
	- Not a functional problem, just a naming collision with an unrelated, very common concept in the same language ecosystem.

13. "Repository" vs. "git repo" naming conventions
	- create confusions and genuinely funny coincidence, but truly a coincidence, not a shared origin
	- Good instinct to question this rather than assume a connection — there isn't one. 
	- The Repository pattern name traces back to Martin Fowler's Patterns of Enterprise Application Architecture (2002) and Eric Evans' Domain-Driven Design (2003) — both using "repository" in its plain, everyday English sense: a place where a collection of things is kept and retrieved from, same root meaning as "a repository of knowledge" or "a seed repository." 
	- Git itself wasn't created until 2005 — three years after Fowler's book coined this exact software pattern name. 
	- So there's no derivation in either direction; 
	- both just independently picked the same ordinary English word because it fits their respective concepts (a collection you store and fetch things from)
	- pure coincidence of timing and word choice, not one borrowing from the other.
	- Given that mental snag is real for you, and "Store" doesn't carry that particular confusion (even though it has its own minor collision with frontend state-management naming) — no pressure to rename anything. 
	- Sticking with DrizzleFriendRequestStore is completely fine; 
	- it was worth knowing the industry's more common term exists, not a reason you're obligated to switch to it.

14. Dockerfile optimizations:
	- `-w`
		- Alternative: npm --workspace=@big2/auth-schema run build works
		- but placing -w <package-name> at the end of npm run build is standard practice
	- `--form=<additional_context>`
		- can be used for: `COPY --from=...` (Most Common)
		- not a valid flag for standard Linux terminal commands inside a Docker `RUN`
		- --from= is a flag, not a target path:
			- You cannot pass --from= twice in a single COPY command. 
			- Docker uses --from=<stage_name> to know where to copy from, followed by <source_path> and <destination_path>.

15. dbclient namings (currently `postgres` in drizzle query)
	- On your actual goal (a): wanting the code to explicitly say "we talk to Postgres" is a completely reasonable instinct, and doesn't need to disappear
	- it just needs a small adjustment to stay precise. 
	- The issue isn't the word "postgres," 
	- it's that a bare postgres reads as "this variable is the database," when it's actually the client/connection object pointed at the database. 
	- Better: `postgresClient` (file postgresClient.ts, export export const postgresClient = createPostgresClient(...))
		- keeps your explicit "we're on Postgres" signal
		- adds clarity that it's a client/connection
		- sidesteps the naming collision entirely. 
		- This also directly answers your multi-database future-proofing goal:
			- if you ever add a second database technology later, 
			- postgresClient sits naturally alongside a hypothetical mongoClient or redisClient 
			- same pattern, unambiguous which is which.


## revise, forgot!
- why postgres.ts can do import * ?  i thought cannot do * for imports ?
