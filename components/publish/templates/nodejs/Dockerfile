# Use official Node.js base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json .
RUN npm install

# Copy application code
COPY . .

# Build TypeScript (if applicable)
RUN npm run build

# Expose port (default for Node.js apps)
EXPOSE 3000

# Command to run the app
CMD ["npm", "start"]