using PostgreSQL

more documentations coming soon for team's references
draft only for now, this DEV_DOC is still incomplete

# these are outdated, not updated to the new method of making database as a package rather than a microservice

## updated dependencies in package.json

### run these on the same directory as package.json

- check if any of the package.json's versiona are **outdated** compared to latest:
	```bash
	npm outdated 
	```

- if theres outdated versions, let npm auto handle the updates for you into your **package-lock.json only**
	```bash
	npm update
	```

- to **auto update into package.json**, manually install the packages on terminal, one by one
	```bash
	npm install <pkg>@latest
	# replace <pkg> with the name of outdated packages
	```
---

## to check if the code working on vs code / host:

### 1. No more Intellisense's errors (locally on VS Code)
- `cd` to `backend/`
- `npm install`
- `npm run generate`
- `npm run build`
- Voila, no more red underlines!
- to clean up space on host, `rm -rf node_modules/ && rm package-lock.json`

### 2. Docker runs successfully
- `cd` to `database/`
- `make`
- `docker ps` (all 3 containers' status are `UP`)
- `docker logs database` (output = "PostgreSQL init process complete; ready for start up.")
- `docker logs backend` (output = "Server listening on port 5000")
- `docker logs prisma_studio` (output = "Prisma Studio is running at: http://localhost:5555")

### 3. open the ports in browser (While Docker is not cleaned yet)
- backend: http://localhost:5000/
- prisma_studio: http://localhost:5555/ 

---

