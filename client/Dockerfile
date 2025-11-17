# Use an official Node.js image
FROM node:22-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json first
COPY package*.json ./

# Install client dependencies
RUN npm install

# Copy the rest of the client source code
COPY . .

# Expose the port that the React dev server runs on
EXPOSE 3000

# Start in development mode
CMD ["npm", "start"]