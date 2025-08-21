# Use an official Python runtime as the parent image
FROM python:3.9-slim

# Set the working directory in the container
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    git \
    && rm -rf /var/lib/apt/lists/*

# Copy the requirements file into the container
COPY requirements.txt .

# Set environment variables
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1

# Create and activate virtual environment
RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Upgrade pip and install dependencies in stages
RUN pip install --no-cache-dir --upgrade pip setuptools wheel && \
    # Install non-ML requirements first
    grep -v "torch\|transformers\|spacy" requirements.txt | pip install --no-cache-dir -r /dev/stdin && \
    # Install ML requirements
    pip install --no-cache-dir -r requirements.txt && \
    # Download spaCy model
    python -m spacy download en_core_web_sm

# Copy the rest of the application code
COPY . .

# Make port 8000 available outside the container
EXPOSE 8000

# Start the FastAPI application using uvicorn with the virtual environment's Python
CMD ["/opt/venv/bin/uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
