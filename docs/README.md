# 🗄️ Database-Centric Development's Setup & Testing Guide

This guide focuses entirely on how to set up your environment, run containers, configure the Drizzle Gateway, and execute service tests specifically to observe their direct effects on the database. Every step is geared toward verifying data persistence and schema updates.

### Index:
* [1. Prerequisites & Required Files](#1-prerequisites--required-files)
* [2. Running Docker](#2-running-docker)
* [3. Opening & Configuring Drizzle Gateway (Database GUI Dev Tool)](#3-opening--configuring-drizzle-gateway-database-gui-dev-tool)
* [4. Live Database Testing: Auth Service](#4-live-database-testing-auth-service)
* [5. Live Database Testing: Party-Manager Service](#5-live-database-testing-party-manager-service)

## 1. Prerequisites & Required Files

Before starting, ensure your database configuration and container secrets are in place at the project root:
(Obtained from the provided GitHub Gist link in the WhatsApp group chat)
* `.env` 
* `secrets/database_passwords/db_admin_password.txt`
* `secrets/drizzle-gateway/dg_masterpass.txt`


## 2. Running Docker

At the project root, start your containers using `make`:

```bash
make
```

> 💡 **Development Note:** Running `make` executes `docker compose up --build` (without the `-d` detached flag) so you can monitor live database initialization logs in real-time.

### Database Readiness Checklist
Look for these specific terminal logs to confirm the database and its migrator have successfully initialized and structured the database, along with other backend microservices:

* **PostgreSQL (The Core DB):**
  ![PostgreSQL Ready](./pictures/docker/d_pg.png)

* **Migrator (Schema Builder):**
  ![Migrator Completed](./pictures/docker/d_migrator.png)

* **Auth Service:**
  ![Auth Service Running](./pictures/docker/d_auth.png)

* **Party-Manager Service:**
  ![Party-Manager Running](./pictures/docker/d_pm.png)

---

## 3. Opening & Configuring Drizzle Gateway (Database GUI Dev Tool)

1. Open your browser and navigate to:
   ```text
   http://localhost:4983
   ```
   <br>

2. **Initial Startup Prompt:** Upon starting up the page (especially after running `make re` or removing previous volumes), you may encounter this prompt below. 👉 **Click Cancel.** <br>
   ![Startup Prompt](./pictures/dg/dg_1_startup.png)  
   <br><br>

3. **Register a New Database Connection:** Since your volumes are empty, you need to register a new connection. Click **`+ Add database connection`**. <br>
   ![Add DB Connection](./pictures/dg/dg_2_addDBConn.png)
   <br><br>

4. **Select Database Engine:** Choose **PostgreSQL**. <br>
   ![Choose Database Engine](./pictures/dg/dg_3_chooseDB.png)
   <br><br>

5. **Fill in Connection Details:** <br>
   *Most inputs reference your `.env` variables automatically. For example, typing `pg_h` or `host` will trigger a dropdown for `PGHOST`—simply click it! No manual copy-pasting required.*
   <br><br>
   | Field | Value to Enter / Select |
   | :--- | :--- |
   | **Name** | Custom name of your choice (e.g., `big2test`) |
   | **Host** | `pghost` (select from dropdown) |
   | **Port** | `5432` (leave default) |
   | **User** | `pguser` (select from dropdown) |
   | **Password** | Copy & paste manually from `secrets/database_passwords/db_admin_password.txt` *(Tip: Allow your browser to save it for auto-fill next time)* |
   | **Database** | `pgdatabase` (select from dropdown) |
   | **SSL Mode & SSL Keys** | Leave as default (used for cloud databases) |
   <br>
> ⚠️ **Troubleshooting:** If the browser becomes unresponsive upon clicking **Connect**, simply refresh the tab, repeat from Step 3, and it will work smoothly.<br>
   
   ![Register Step 1.1](./pictures/dg/dg_4_register1.1.png)
   ![Register Step 1.2](./pictures/dg/dg_4_register1.2.png)
   ![Register Step 2](./pictures/dg/dg_4_register2.png)
   ![Register Step 3](./pictures/dg/dg_4_register3.png)
   <br><br>

6. **Connection Established:** Drizzle Gateway is now connected! By default, it displays the `public` schema. Note that tables are stored inside each service's own dedicated schema, so `public` will appear empty.<br>
   ![Established Connection](./pictures/dg/dg_5_establishedConn.png)
   <br><br>

7. **Exploring Schemas:** Use the schema dropdown menu to select the specific service schema you want to inspect.<br>
   ![Schemas Dropdown](./pictures/dg/dg_6_schemas.png)
   <br><br>

8. **Viewing Tables & Refreshing:** You will see the tables inside each service's schema. Use the **Refresh** button whenever you perform actions that update the database (e.g., new user sign-ups or sign-ins).<br>
   ![Tables View](./pictures/dg/dg_7_tables.png)  
   ![Refresh Button](./pictures/dg/dg_7_refreshButton.png)
   <br><br>

9. **Filtering & Sorting Data:** When dealing with large datasets, you can easily analyze data using built-in filters and sorting options:<br>
   * **Filter:**
     ![Filter Feature](./pictures/dg/dg_8_filter1.png)
   * **Sort:** You can sort across multiple columns sequentially in ascending (`ASC`) or descending (`DESC`) order.
     ![Sort Feature 1](./pictures/dg/dg_8_sort1.png)
     ![Sort Feature 2](./pictures/dg/dg_8_sort2.png)
   <br><br>

---

## 4. Live Database Testing: Auth Service

### Scenario A: New User Sign Up
1. Run the following command at the root terminal:
   ```bash
   docker exec auth npm run test:signup -- <email> <password>
   ```
   *Example:*
   ```bash
   docker exec auth npm run test:signup -- aisyah@gmail.com 0909oioi0909oioi
   ```

2. **Terminal Output:** The auth service will respond with `201 Created`.
3. **Database Verification:** Go to Drizzle Gateway in your browser, navigate to the `user` table under the auth schema, click **Refresh**, and verify the new user record appears.<br>
	![Sign Up Successful!](./pictures/auth/a_signup.png)
<br><br>

### Scenario B: New User Sign In
1. Run the following command at the root terminal:
   ```bash
   docker exec auth npm run test:signin -- <email> <password>
   ```
   *Note: Use the exact same email and password used during the signup process.*
   *Example:*
   ```bash
   docker exec auth npm run test:signin -- aisyah@gmail.com 0909oioi0909oioi
   ```

2. **Terminal Output:** The auth service will respond with `200 OK`.
3. **Database Verification:** Go to Drizzle Gateway in your browser, navigate to the `session` table under the auth schema, click **Refresh**, and verify the session record has been created.<br>
	![Sign In Successful!](./pictures/auth/a_signin.png)
<br><br>

new ways to test authentication now: <br>
### bash backend/authentication/scripts/test:signup.sh <user's email> <user's password>
### bash backend/authentication/scripts/test:signin.sh <user's email> <user's password>
### bash backend/authentication/scripts/test:validate.sh <user's session_token>
### bash backend/authentication/scripts/test:logout.sh <user's session_token>
---

## 5. Live Database Testing: Party-Manager Service

*(Add your Party-Manager testing steps and database verification flows here as needed.)*
