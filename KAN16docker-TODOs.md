optimize only. its workable already once database successfully integrated with the services.



# MVP kind of perf

1. docker-compose-yml:
- use `additional_context`
	- context: services' own path
	- additional_contexts: their path

2. Dockerfiles:
- dc’s `context` at services’ own specific path
	- COPY . . will just be the whole service’s directory only
	- need WORKDIR app/services/….  before COPY . . as its originally WORKDIR /app

- dc’s `additional_contexs`
	- in Dockerfile, use --from= ,for every additional_context component added onto this service in dc.

- use `build:docker` (tsc -b) 
	- to minimize RUN build’s lines clutter, only 1 line upon that service itself only. 
	- auto build everything needed by that service’s dependency chain

- executables are made earlier on from host, once and for all!
	- just make it executables from host, no need to manually convert them to be executable everytime deploying => minimize image layers & size (perf!)
	- git saves it in git’s metadata, on Linux&Mac, but except on Window’s terminal 
	- =>Running chmod inside a standard Windows terminal won't change the Git metadata.
	- solution:
		- on host, run this: 
			- git add --chmod=+x services/**/scripts/*
		- If your terminal throws a "no matches found" error, wrap the path in quotes to force Git to handle the matching instead of your shell:
			- git add --chmod=+x "services/**/scripts/*"
		- after that, can remove entirely manually executable conversions in Dockerfiles.
	- remove lines + make their path as additional_contexts + copy in runner stage only after copy package.json(s) + their copy destination must be to /usr/local/bin/

- solution on npm’s phantom dependencies, refer the section below.

3. .env(s)
- when there are many .env from everyone,
- create environment/ and put everyone’s .env and .env.example in there
- edit specified env files into their docker services

4. secrets
- keep using secrets haha, less risky & complications. 
- if want to do infisical, dont do the module coz not enough time to do the other part of the module on team’s deadline. no metal capacity too hurm
- if do want to do infisical, see if its borthering other people’s work too much or just the docker itself. dont want to menyusahkan team more


# need to discuss kind of perf

1. network specifically for services that do internal REST API , not sure if this hrelps in any way, read somewhere before

2. npm → pnpm , ideal for microservices. pnpm solves 2 major issues by npm:
- big disk size
- phantom dependencies => can just do npm’s own solution withoput switching to pnpm:
	- npm’s solution is using eslint-plugin-phantom-dependencies or the import/no-extraneous-dependencies rule from eslint-plugin-import-x 
	- IMPORTANT - this issue must be resolve to be truly act as microservice!