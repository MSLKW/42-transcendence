optimize only. its workable already once database successfully integrated with the services.



# MVP kind of perf

1. docker-compose-yml:
- use `additional_context`
	- context: services' own path
	- additional_contexts: their path

2. Dockerfiles:
- dc’s `context` at services’ own specific path
	- `COPY . .` will just be the whole service’s directory only
	- need 	`WORKDIR app/services/…` before `COPY . .` as its originally WORKDIR /app

- dc’s `additional_contexs`
	- in Dockerfile, use `--from=` ,for every additional_context component added onto this service in dc.

- use `build:docker` (`tsc -b`) 
	- to minimize RUN build’s lines clutter, only 1 line upon that service itself only. 
	- auto build everything needed by that service’s dependency chain

- executables are made earlier on from host, once and for all!
	- just make it executables from host, no need to manually convert them to be executable everytime deploying => minimize image layers & size (perf!)
	- git saves it in git’s metadata, on Linux&Mac, but except on Window’s terminal 
	- =>Running chmod inside a standard Windows terminal won't change the Git metadata.
	- solution:
		- on host, run this: 
			- `git add --chmod=+x services/**/scripts/*.sh`
		- If your terminal throws a "no matches found" error, wrap the path in quotes to force Git to handle the matching instead of your shell:
			- `git add --chmod=+x "services/**/scripts/*"`
			- `IMPORTANT!! discuss with jeremy first` 
			- asks first if he is okay his tests files for authentication be executable
			- these files get executed using `bash` anyway too.
		- full process:
			```
			# preview what will match
			git ls-files "**/scripts/*.sh"

			# stage the mode change
			git add --chmod=+x "**/scripts/*.sh"

			# confirm it's a pure mode change, no content diffs
			git diff --cached

			# then, safe to commit & push!
			```
		- after that, can remove entirely manually executable conversions in Dockerfiles.
	- remove manual executable conversions lines in Dockerfiles + make their path as additional_contexts + copy in runner stage only after copy package.json(s) + these executable files' copy destination must be to /usr/local/bin/
	- issue: after `git add .`, all is back to regular files
		- `git add --chmod=+x` <pattern> only edits the mode bit stored in git's index, not the actual file permission on disk. Your files on disk are still 644 (non-executable) — you never ran a real chmod +x on the filesystem.
		- When you then run git add ., git re-stages from the working tree's actual state. Since the real on-disk mode is still 644, git add . overwrites your index-only 755 back down to 644. That's why the executable bit "disappears" right after.
	- Fix: do the real chmod, not just the git-metadata trick:
		```bash
		find . -path "*/scripts/*.sh" -exec chmod +x {} \;
		git add .
		```
		- Now the working tree and the index agree, and nothing after can flip it back. git add --chmod=+x is a fallback for when you can't chmod on disk (e.g. certain shared/Windows filesystems) — it's fragile if any subsequent git add . runs.

- solution on npm’s phantom dependencies, refer the section below.

3. .env(s)
- when there are many .env from everyone,
- create environment/ and put everyone’s .env and .env.example in there
- edit specified env files into their docker services

4. secrets
- keep using secrets haha, less risky & complications. 
- if want to do infisical, dont do the whole module (+WAF) coz not enough time to do the other part of the module on team’s deadline. no metal capacity too hurm
- if do want to do infisical, 
	- see if its borthering other people’s work too much or just the docker itself. dont want to menyusahkan team more
	- need to learn how to handle API key properly, securely
	- suitable: infisical / hashicorp vault

5. package.json
	- now:
		- service , build: tsup ...
		- others , build: tsc 
	- later:
		- service, "build:docker" : "tsc -b" (thats all!) (have to do .js explicitely?)
		- module: NodeNext ~~bundler~~
		- moduleResolution: NodeNext ~~bundler~~

6. Other speed suggestions:
	- Cache mount for npm: RUN --mount=type=cache,target=/root/.npm npm ci





# need to discuss kind of perf

1. network specifically for services that do internal REST API , not sure if this hrelps in any way, read somewhere before

2. npm → pnpm , ideal for microservices. pnpm solves 2 major issues by npm:
- big disk size
- phantom dependencies => can just do npm’s own solution withoput switching to pnpm:
	- npm’s solution is using eslint-plugin-phantom-dependencies or the import/no-extraneous-dependencies rule from eslint-plugin-import-x 
	- IMPORTANT - this issue must be resolve to be truly act as microservice!
	- execution methodology:
		- apply the specific git stash with all the files ready: `git stash apply stash@{#}` 
		- at root: `npm install -D eslint-plugin-import-x`
		- run at root: `npm run lint`
		- add the dependencies told by import-x/no-extraneous-dependencies's error logs 
		- the error logs for phantom dependencies looks like this:
		```
		/home/aimokhta/42projects/42-transcendence/packages/postgres/auth-schema/src/auth.relations.ts
		1:1  error  'drizzle-orm' should be listed in the project's dependencies. Run 'npm i drizzle-orm' to add it  import-x/no-extraneous-dependencies
		```
		- even if already listed, eslint still flag it if its not installed by explicit `npm i <dest> <pckg>` and manually just add it into the package.json
		- 1. Why the root install didn't stop ESLint flagging it

		- This is actually the core of the phantom-dependency problem, not a contradiction of it: it working fine, while still failing lint, are two independent facts.

		- Why it compiled/ran fine: with npm workspaces, npm install at root hoists everything into one shared root node_modules. Node's module resolution walks up parent folders looking for node_modules until it finds the package — so @big2/auth-schema resolves fine for friends-system-schema even though it was never declared in that package's own package.json. It's riding on the fact that something else in the workspace declared it, so it exists somewhere in the shared pool.
		Why ESLint still flagged it: no-extraneous-dependencies isn't checking "can Node find this file" — it's checking "does the closest package.json to this source file declare this dependency." Those are genuinely different questions. Your code worked because of hoisting; the lint rule complained because the declaration was missing regardless of hoisting making it resolve fine.
		- need to specifically npm i authentication -w @bi2/auth-schema
		- That gap between "resolves at runtime" and "properly declared" is the phantom dependency risk itself — it's not a false positive. It's exactly why this stayed invisible for as long as it did: nothing broke, so nothing forced you to notice the declaration was missing, until a linter that specifically checks declarations (not resolution) was added.
