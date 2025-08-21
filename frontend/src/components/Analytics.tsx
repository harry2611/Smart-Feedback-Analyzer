import React, { useState, useEffect } from 'react';
import { Paper, Typography, Grid, CircularProgress, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import axios from 'axios';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
}));

interface SentimentData {
  positive: number;
  negative: number;
  neutral: number;
}

interface TopicData {
  [key: string]: number;
}

const Analytics = () => {
  const [sentimentData, setSentimentData] = useState<SentimentData | null>(null);
  const [topicData, setTopicData] = useState<TopicData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sentimentRes, topicRes] = await Promise.all([
          axios.get('/api/analytics/sentiment'),
          axios.get('/api/analytics/topics')
        ]);

        setSentimentData(sentimentRes.data.sentiment_distribution);
        setTopicData(topicRes.data.topic_distribution);
      } catch (err) {
        setError('Failed to load analytics data');
        console.error('Error fetching analytics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" my={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" align="center">
        {error}
      </Typography>
    );
  }

  const totalSentiments = sentimentData
    ? Object.values(sentimentData).reduce((a, b) => a + b, 0)
    : 0;

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <StyledPaper>
          <Typography variant="h6" gutterBottom>
            Sentiment Analysis
          </Typography>
          {sentimentData && (
            <Box>
              {Object.entries(sentimentData).map(([sentiment, count]) => (
                <Box key={sentiment} mb={2}>
                  <Typography variant="body1" style={{ textTransform: 'capitalize' }}>
                    {sentiment}: {count} ({((count / totalSentiments) * 100).toFixed(1)}%)
                  </Typography>
                  <Box
                    sx={{
                      width: '100%',
                      height: '10px',
                      backgroundColor: '#e0e0e0',
                      borderRadius: '5px',
                      overflow: 'hidden',
                    }}
                  >
                    <Box
                      sx={{
                        width: `${(count / totalSentiments) * 100}%`,
                        height: '100%',
                        backgroundColor: 
                          sentiment === 'positive' ? '#4caf50' :
                          sentiment === 'negative' ? '#f44336' : '#ff9800',
                      }}
                    />
                  </Box>
                </Box>
              ))}
            </Box>
          )}
        </StyledPaper>
      </Grid>
      <Grid item xs={12} md={6}>
        <StyledPaper>
          <Typography variant="h6" gutterBottom>
            Top Topics
          </Typography>
          {topicData && (
            <Box>
              {Object.entries(topicData)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 10)
                .map(([topic, count]) => (
                  <Box key={topic} mb={2}>
                    <Typography variant="body1" style={{ textTransform: 'capitalize' }}>
                      {topic}: {count} mentions
                    </Typography>
                    <Box
                      sx={{
                        width: '100%',
                        height: '10px',
                        backgroundColor: '#e0e0e0',
                        borderRadius: '5px',
                        overflow: 'hidden',
                      }}
                    >
                      <Box
                        sx={{
                          width: `${(count / Math.max(...Object.values(topicData))) * 100}%`,
                          height: '100%',
                          backgroundColor: '#2196f3',
                        }}
                      />
                    </Box>
                  </Box>
                ))}
            </Box>
          )}
        </StyledPaper>
      </Grid>
    </Grid>
  );
};

export default Analytics;
