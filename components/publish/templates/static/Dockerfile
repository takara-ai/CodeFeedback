# Use lightweight Nginx base image
FROM nginx:alpine

# Copy application code to Nginx public directory
COPY . /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]