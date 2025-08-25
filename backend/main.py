from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
import models
import schemas
from database import SessionLocal, engine
from ml_utils import analyze_sentiment, extract_topics
import logging
from sqlalchemy import func

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

try:
    models.Base.metadata.create_all(bind=engine)
    logger.info("Database tables created successfully")
except Exception as e:
    logger.error(f"Error creating database tables: {str(e)}")
    raise

app = FastAPI(title="Smart Feedback Analyzer API")

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:80", "http://localhost"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency to get database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/feedback/", response_model=schemas.FeedbackResponse)
def create_feedback(feedback: schemas.FeedbackCreate, db: Session = Depends(get_db)):
    # Analyze sentiment and extract topics
    sentiment = analyze_sentiment(feedback.text)
    topics = extract_topics(feedback.text)
    
    # Create DB entry
    db_feedback = models.Feedback(
        text=feedback.text,
        sentiment=sentiment,
        topics=topics
    )
    db.add(db_feedback)
    db.commit()
    db.refresh(db_feedback)
    return db_feedback

@app.get("/feedback/", response_model=List[schemas.Feedback])
def get_all_feedback(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    feedback = db.query(models.Feedback).offset(skip).limit(limit).all()
    return feedback

@app.get("/analytics/sentiment")
def get_sentiment_analytics(db: Session = Depends(get_db)):
    results = db.query(
        models.Feedback.sentiment,
        func.count(models.Feedback.id)
    ).group_by(models.Feedback.sentiment).all()
    return {
        "sentiment_distribution": dict(results)
    }

@app.get("/analytics/topics")
def get_topic_analytics(db: Session = Depends(get_db)):
    feedbacks = db.query(models.Feedback.topics).all()
    topic_counts = {}
    for feedback in feedbacks:
        for topic in feedback.topics:
            topic_counts[topic] = topic_counts.get(topic, 0) + 1
    return {
        "topic_distribution": topic_counts
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}
