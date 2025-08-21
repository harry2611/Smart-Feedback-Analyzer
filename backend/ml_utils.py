import spacy
from transformers import pipeline

# Load spaCy model for topic extraction
nlp = spacy.load("en_core_web_sm")

# Load sentiment analysis model from HuggingFace
sentiment_analyzer = pipeline("sentiment-analysis")

def analyze_sentiment(text: str) -> str:
    """
    Analyze the sentiment of the given text using HuggingFace transformers.
    Returns: 'positive', 'negative', or 'neutral'
    """
    result = sentiment_analyzer(text)[0]
    score = result['score']
    
    if score > 0.6:
        return 'positive'
    elif score < 0.4:
        return 'negative'
    else:
        return 'neutral'

def extract_topics(text: str) -> list:
    """
    Extract key topics/themes from the text using spaCy.
    Returns a list of important nouns and noun phrases.
    """
    doc = nlp(text)
    
    # Extract noun phrases and named entities
    topics = []
    
    # Get noun phrases
    for chunk in doc.noun_chunks:
        topics.append(chunk.text.lower())
    
    # Get named entities
    for ent in doc.ents:
        topics.append(ent.text.lower())
    
    # Remove duplicates and return
    return list(set(topics))
