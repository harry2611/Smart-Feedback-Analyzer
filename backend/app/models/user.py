from sqlalchemy import Boolean, Column, Integer, String, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    username = Column(String, unique=True, index=True)
    full_name = Column(String)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
    is_superuser = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    role = Column(String, default="viewer")  # viewer, analyst, admin

    feedbacks = relationship("Feedback", back_populates="user")
    preferences = relationship("UserPreference", back_populates="user", uselist=False)

class UserPreference(Base):
    __tablename__ = "user_preferences"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    theme = Column(String, default="light")
    dashboard_layout = Column(JSON)
    email_notifications = Column(Boolean, default=True)
    slack_notifications = Column(Boolean, default=False)
    notification_frequency = Column(String, default="daily")

    user = relationship("User", back_populates="preferences")
