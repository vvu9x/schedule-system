# How to Run the Project

## Frontend

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the project:
   ```bash
   npm run
   ```

## Backend

1. Install dependencies:
   ```bash
   npm install
   ```

2. Pull the Docker image for SQL Server:
   ```bash
   docker pull mcr.microsoft.com/mssql/server:2022-latest
   ```

3. Run the Docker image on Docker Desktop.

4. Apply database migrations:
   ```bash
   npx prisma migrate dev --name init
   ```

5. Seed the database:
   ```bash
   node seed.js
   ```

6. Start the backend server:
   ```bash
   node index.js
   ```
