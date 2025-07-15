# Use an official Node.js image
FROM node:18

# Setting up a working directory
WORKDIR /app

# Copy package.json and package-lock.json first
COPY package*.json ./

# Install dependencies automatically
RUN npm install

# Copy the rest of the app
COPY . .

# Exposing the port 
EXPOSE 5000

# Starting the app
CMD ["npm", "start"]
