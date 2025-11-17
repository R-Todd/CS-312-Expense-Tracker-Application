Getting Started on a New Machine

1. Prerequisites  
Make sure the machine has:

- Docker Desktop  
  Download: https://www.docker.com/products/docker-desktop/

Nothing else is required — no local Node.js installation needed.

---

2. Create a .env File  
Create a `.env` file in the project root:

Fill out .env.example with your credentials

---

3. Build and Run the Server (Docker)  
From the project root:

docker compose up --build

This will:

- Build the server container using server/Dockerfile
- Install dependencies using npm install inside the container
- Start the server using nodemon
- Hot-reload when you edit server files locally

Once running, you should see:

Server is running on port 5000  
http://localhost:5000

---

4. Stop and Clean Containers  

To stop:

docker compose down

To stop and remove all volumes (fresh start):

docker compose down -v

---

5. Test the API  

Open browser or Postman and test:

http://localhost:5000/

Expected:

Expense Tracker API is running

Test sample expenses endpoint:

http://localhost:5000/api/expenses

You will see the placeholder JSON response.

---

6. Development Notes  

Auto-reload  
Nodemon runs inside the container, so any file changes in /server trigger a restart.

Node modules  
The Docker volume prevents host node_modules from interfering with container node_modules.

Never commit .env  
Your .gitignore correctly prevents environment variables from being exposed.

---

7. Future Enhancements (Phase-2)

- Integrate PostgreSQL database (container will be added later)
- Add full CRUD for expenses
- JWT authentication
- Connect React client (to be added under /client)

---

8. Running After Changing Repositories  

If you clone this repo on a brand-new system:

docker compose down -v  
docker compose up --build

This ensures Docker rebuilds everything cleanly.
