<!-- --- -->
## Project repo style
### One shared PostgreSQL database used by all services
- multiple independently deployable microservices that share a single monorepo
- `monorepo` = a way to organize your code (storing all projects and shared libraries in a single repository)<br>
- mainly consists of `packages`, `backend`, and `frontend`


<!-- --- -->
## How it plays together (Docker + Makefile + package.json scripts)

### Makefile & docker-compose => Deployment/Infrastructure. 
- During `build(Docker)`: Your Dockerfile for each microservice will likely do something like COPY . . and npm install. 
- using a `monorepo`: Dockerfile needs to be smart enough to copy root's package.json + packages/database folder into the image so the service can "see" the code it depends on.

### package.json files => Development/Code.
- During `Development`: You will often run npm run dev at the root. 
- This launches all your services in "watch mode" on your local machine so you can code faster. 
- You don't always want to rebuild Docker containers just to test a small code change.

### A Practical Rule of Thumb:
***Root package.json***: Contains things that apply to everything (TypeScript config, Linting, shared dev tools).<br>
***Service package.json***: Contains things that are unique to that service (Express, React, Socket.io).<br>
***Makefile***: Contains the "Big Red Buttons" (e.g., make start to run docker-compose up, make logs to see output).<br>


<!-- --- -->
## package.json fields

### 1. Root

`"private": true`
- critical = prevents you from accidentally publishing your root monorepo folder to the public npm registry. 
<br>

`"workspaces": []`
- This array tells npm (or your package manager) where to look for your sub-projects. 
- Using the glob pattern "packages/*" (and your specific directories) allows the package manager to automatically link these folders together.  
- to tell our package manager, npm, that our project use the monorepo approach (1 github repo for the whole project)
- we r saying to our package manager, "Hey, don't look for these folders in the online npm registry. Look for them right here on my disk."
- when we do `npm install` at the root, npm creates `"symlinks" (shortcuts).` 
- If backend/auth-service needs @big2/database, npm sees that @big2/database exists in packages/database. 
- Instead of downloading it from the internet, it just creates a link. 
- This means when you edit the code in packages/database, your auth-service instantly sees the changes. It’s like magic for local development.
<br>

`"scripts":`
- `--workspaces` flag = you can run commands across all services at once (e.g., npm run build --workspaces). 
- `--if-present` flag = useful to avoid errors if a specific package doesn't have that script.  
<br>

`devDependencies:` 
- Only put shared tools here—things that apply to the entire repo, such as TypeScript, ESLint, or Prettier. 
- `npm run lint` = check the code quality of your entire project before pushing to GitHub.
- Keep individual service dependencies (like drizzle-orm or express) strictly inside the package.json of each specific service.  
<br>

`<<<<MOST IMPORTANT OF HOW DATABASE AS SHARED LIBRARY <-> MICROSERVICES>>>>`
- `Use Symlinks`: When you run npm install at the root, npm automatically creates symlinks for your local packages. 
- allowing your `backend services to import your local packages (packages/*) as if they were installed packages.`
- database now is the shared library, (Drizzle is a library), not a shared code
<br>

### 2. Local packages


## specified schema for each microservices
`Master URL (for migration and studio) - for Drizzle only`
```
DATABASE_URL=postgresql://admin:password@postgresql:5432/big_two_db
```

`Service-specific`
```
// You override the URL specifically for each service
// each microservice gets a specific DATABASE_URL with a ?schema=... parameter injected by Docker.
DATABASE_URL=postgresql://admin:password@postgresql:5432/big_two_db?schema=auth_service
```



npx drizzle-kit studio or npx drizzle-kit push, you are acting as an Administrator. You need to see everything to manage the database structure.





















<!-- --- -->
## backend/auth vs packages/auth-utils
```
/packages
  └── auth-utils/      <-- The "Shared Math": Encryption, token verification logic.
/backend
  └── auth/            <-- The "Active Service": Handles the database, logins, and signups.
```
- If your app is complex, you actually end up with both
- **Why?** Because the api-gateway needs the logic (the math from auth-utils) to check tokens quickly, but the auth-service needs to run to handle the heavy lifting (writing to the database when a user signs up).