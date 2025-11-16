# ================================================================
# Server Dockerfile (Development Mode) /server/Dockerfile
# Purpose: Runs the Node.js/Express server inside a container
# ================================================================

# Use an official Node.js image (LTS, includes npm)
FROM node:22-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json first
COPY package*.json ./

# Install server dependencies (including nodemon)
RUN npm install

# Copy the rest of the server source code into the container
COPY . .

# Expose the port that the server listens on
# Controlled by SERVER_PORT in .env (default 5000)
EXPOSE 5000

# Start in development mode using nodemon
CMD ["npm", "run", "dev"]
