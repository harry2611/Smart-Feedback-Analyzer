from typing import List, Dict, Any
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.cluster import KMeans
from textblob import TextBlob
import spacy
from transformers import pipeline
from app.ml.models import FeedbackAnalyzer
from datetime import datetime, timedelta

class AdvancedAnalytics:
    def __init__(self):
        self.nlp = spacy.load("en_core_web_sm")
        self.feedback_analyzer = FeedbackAnalyzer()
        self.sentiment_analyzer = pipeline("sentiment-analysis")
        self.vectorizer = TfidfVectorizer(max_features=1000)

    def analyze_trends(self, feedbacks: List[Dict]) -> Dict[str, Any]:
        """Analyze feedback trends over time"""
        # Sort feedbacks by timestamp
        sorted_feedbacks = sorted(feedbacks, key=lambda x: x['created_at'])
        
        # Group by time periods
        daily_sentiments = {}
        topics_over_time = {}
        
        for feedback in sorted_feedbacks:
            date = feedback['created_at'].date()
            analysis = self.feedback_analyzer.analyze_text(feedback['text'])
            
            # Track daily sentiment
            if date not in daily_sentiments:
                daily_sentiments[date] = []
            daily_sentiments[date].append(analysis['sentiment']['score'])
            
            # Track topics over time
            if date not in topics_over_time:
                topics_over_time[date] = {}
            for topic in analysis['topics']:
                topics_over_time[date][topic] = topics_over_time[date].get(topic, 0) + 1

        return {
            'sentiment_trends': self._calculate_sentiment_trends(daily_sentiments),
            'topic_trends': self._calculate_topic_trends(topics_over_time),
            'overall_stats': self._calculate_overall_stats(feedbacks)
        }

    def cluster_feedbacks(self, feedbacks: List[Dict], n_clusters: int = 5) -> Dict[str, Any]:
        """Cluster similar feedbacks together"""
        texts = [f['text'] for f in feedbacks]
        
        # Create TF-IDF matrix
        tfidf_matrix = self.vectorizer.fit_transform(texts)
        
        # Perform clustering
        kmeans = KMeans(n_clusters=n_clusters, random_state=42)
        clusters = kmeans.fit_predict(tfidf_matrix)
        
        # Analyze clusters
        cluster_analysis = {}
        for i in range(n_clusters):
            cluster_texts = [text for j, text in enumerate(texts) if clusters[j] == i]
            cluster_analysis[f'cluster_{i}'] = {
                'size': len(cluster_texts),
                'key_terms': self._get_cluster_terms(cluster_texts),
                'avg_sentiment': self._get_avg_sentiment(cluster_texts)
            }
        
        return cluster_analysis

    def generate_report(self, feedbacks: List[Dict]) -> Dict[str, Any]:
        """Generate comprehensive feedback analysis report"""
        return {
            'summary_stats': self._calculate_overall_stats(feedbacks),
            'trend_analysis': self.analyze_trends(feedbacks),
            'clusters': self.cluster_feedbacks(feedbacks),
            'recommendations': self._generate_recommendations(feedbacks),
            'generated_at': datetime.now().isoformat()
        }

    def _calculate_sentiment_trends(self, daily_sentiments: Dict) -> Dict:
        trends = {}
        for date, sentiments in daily_sentiments.items():
            trends[date.isoformat()] = {
                'average': np.mean(sentiments),
                'min': min(sentiments),
                'max': max(sentiments),
                'std': np.std(sentiments)
            }
        return trends

    def _calculate_topic_trends(self, topics_over_time: Dict) -> Dict:
        all_topics = set()
        for date_topics in topics_over_time.values():
            all_topics.update(date_topics.keys())
        
        trends = {}
        for topic in all_topics:
            trends[topic] = {
                date.isoformat(): topics.get(topic, 0)
                for date, topics in topics_over_time.items()
            }
        return trends

    def _get_cluster_terms(self, texts: List[str], n_terms: int = 5) -> List[str]:
        """Get key terms that characterize a cluster"""
        text = ' '.join(texts)
        doc = self.nlp(text)
        terms = []
        for chunk in doc.noun_chunks:
            terms.append(chunk.text)
        return terms[:n_terms]

    def _get_avg_sentiment(self, texts: List[str]) -> float:
        """Calculate average sentiment for a group of texts"""
        sentiments = [TextBlob(text).sentiment.polarity for text in texts]
        return np.mean(sentiments)

    def _generate_recommendations(self, feedbacks: List[Dict]) -> List[str]:
        """Generate actionable recommendations based on feedback analysis"""
        recommendations = []
        
        # Analyze sentiment distribution
        sentiments = [self.feedback_analyzer.analyze_text(f['text'])['sentiment']
                     for f in feedbacks]
        avg_sentiment = np.mean([s['score'] for s in sentiments])
        
        if avg_sentiment < 0.3:
            recommendations.append("Critical attention needed: Overall sentiment is negative")
        
        # Analyze common topics and issues
        all_topics = []
        for f in feedbacks:
            all_topics.extend(self.feedback_analyzer.analyze_text(f['text'])['topics'])
        
        topic_counts = {}
        for topic in all_topics:
            topic_counts[topic] = topic_counts.get(topic, 0) + 1
        
        # Generate topic-based recommendations
        for topic, count in topic_counts.items():
            if count > len(feedbacks) * 0.3:  # If topic appears in > 30% of feedbacks
                recommendations.append(f"High frequency topic '{topic}' requires attention")
        
        return recommendations
