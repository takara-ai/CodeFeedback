# Use official Python base image
FROM python:3.9-slim

# Set working directory
WORKDIR /app

# Copy requirements and install
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Expose port (default for Gradio/Streamlit)
EXPOSE 7860

# Command to run the app (replace APP_NAME with your main script)
CMD ["python", "APP_NAME"]