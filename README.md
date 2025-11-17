# Getting Started on a New Machine

## 1. Prerequisites
Make sure the machine has:

- **Docker Desktop**  
  Download: https://www.docker.com/products/docker-desktop/

Nothing else is required — no local Node.js installation needed.

---

## 2. Create a .env File
Create a `.env` file in the project's root directory. You can copy the example file:

```bash
.env.example
```

Fill out the new `.env` file with your credentials, especially:
- POSTGRES_USER  
- POSTGRES_PASSWORD  
- POSTGRES_DB  
- JWT_SECRET  

---

## 3. Build and Run the Server (Docker)

From the project root:

```bash
docker-compose up -d --build
```

This will:

- Build the server and client containers using their Dockerfiles  
- Install all dependencies inside the containers  
- Start the server, client, and database in detached mode  

---

## 4. Initialize the Database (One-Time Setup)
This must be done **after your containers are running** (after Step 3) but **before registering a user**.  
This creates all required tables.


Copy the following SQL into that file:

```sql
-- Create the 'users' table for storing login and profile information
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

```

1) Open a new terminal.

Connect to the running PostgreSQL container using this command:

```bash
docker-compose exec db psql -U POSTGRES_USER -d POSTGRES_DB
```
(Use the POSTGRES_USER and POSTGRES_DB values from your .env file).

Once you're inside the psql shell, paste the following SQL code and press Enter:

SQL:

```sql
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```
You should see CREATE TABLE. Type \q and press Enter to quit the psql shell.

---

## 5. Test the API & App

Your containers should now be running:

- **Client App:** http://localhost:3000  
  Register and log in here.

- **Server API:** http://localhost:5000  
  Should show: *Expense Tracker API is running*

You can now create your first user.

---

## 6. Stop and Clean Containers

Stop everything:

```bash
docker-compose down
```

Stop and **delete all data** (including database):

```bash
docker-compose down -v
```

---

## Development Notes

- **Auto-reload:**  
  Nodemon (server) and React dev server (client) automatically reload when editing files inside `/server` or `/client`.

- **Node modules isolation:**  
  Docker volumes prevent conflicts between host and container node_modules.

- **Never commit `.env`:**  
  Your `.gitignore` correctly prevents exposing secrets.

