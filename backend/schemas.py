from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class FeedbackBase(BaseModel):
    text: str

class FeedbackCreate(FeedbackBase):
    pass

class FeedbackResponse(FeedbackBase):
    id: int
    sentiment: str
    topics: List[str]
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        orm_mode = True

class Feedback(FeedbackResponse):
    pass
