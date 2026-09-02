notes for me to remember FOR ACTUAL PROJECT IMPLEMENTATIONS

1. node modules only exist at root 
	- entore project depends on 1 sigle same node_modules/ at root
	- coz we use root's package.json that uses workspace field
	- so even in Docker they will depend on the root's node_modules/ alone, which generated in Docker, not taken from host
	- root's package-lock.json is copied into Docker to minimize buildtime huhu. or else lama nak ...

2. Dockerfile's selective copying is what makes this a true, isolated microservice build
	- !! genuine question, what about "COPY . ."? that dosent look like microservice tho?

3. Does pnpm migration touch tsconfig.json?
	- No, tsconfig.json governs TypeScript's own compilation behavior (moduleResolution, target, etc.)
	- completely independent of which package manager installed the files on disk. 
	- What actually changes: 
		- package-lock.json deleted, 
		- pnpm-lock.yaml generated instead; your Dockerfile's npm ci → pnpm install --frozen-lockfile; 
		- and one new file you'd need that doesn't exist today — pnpm-workspace.yaml at the repo root, 
			- since pnpm doesn't read the "workspaces" array inside package.json the way npm does, it requires its own separate file listing the same folders. 
	- Everything else — your actual .ts source files, tsconfig.json, imports — untouched.

4. for generating DATABASE DIAGRAM later:
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

5. pnpm is better than npm for microservices 
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

6. Dockerfile cannot COPY backwards. it only go onwards from what defined as context in docker-compose.yml