# Smart Feedback Analyzer

A full-stack application for analyzing customer feedback using NLP and visualizing insights.

## Features

- Submit text feedback through a clean, modern interface
- Automatic sentiment analysis using HuggingFace Transformers
- Topic extraction using spaCy NLP
- Real-time analytics dashboard with charts and word clouds
- PostgreSQL database for persistent storage
- Containerized deployment with Docker

## Tech Stack

- Backend: FastAPI (Python)
- Frontend: React with TypeScript
- Database: PostgreSQL
- ML/NLP: spaCy, HuggingFace Transformers
- Containerization: Docker
- Deployment: AWS (ready)

## Getting Started

### Prerequisites

- Docker and Docker Compose
- Node.js (for local frontend development)
- Python 3.9+ (for local backend development)

### Installation

1. Clone the repository:
\`\`\`bash
git clone <repository-url>
cd smart-feedback-analyzer
\`\`\`

2. Start the application using Docker Compose:
\`\`\`bash
docker-compose up --build
\`\`\`

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

### Local Development

#### Backend

1. Create a Python virtual environment:
\`\`\`bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
\`\`\`

2. Install dependencies:
\`\`\`bash
pip install -r requirements.txt
python -m spacy download en_core_web_sm
\`\`\`

3. Run the FastAPI server:
\`\`\`bash
uvicorn main:app --reload
\`\`\`

#### Frontend

1. Install dependencies:
\`\`\`bash
cd frontend
npm install
\`\`\`

2. Start the development server:
\`\`\`bash
npm start
\`\`\`

## API Endpoints

- POST /feedback/ - Submit new feedback
- GET /feedback/ - Retrieve all feedback entries
- GET /analytics/sentiment - Get sentiment distribution
- GET /analytics/topics - Get topic distribution

## Deployment

The application is containerized and can be deployed to AWS ECS or Kubernetes. Configuration files for AWS deployment are included in the repository.

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
