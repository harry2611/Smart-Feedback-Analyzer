import React, { useEffect, useState } from 'react';
import { Paper, Typography, Grid, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import WordCloud from './WordCloud';
import axios from 'axios';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
}));

const ChartContainer = styled(Box)(({ theme }) => ({
  height: 300,
  marginBottom: theme.spacing(3),
}));

interface SentimentData {
  name: string;
  count: number;
}

interface TopicData {
  text: string;
  value: number;
}

const Dashboard = () => {
  const [sentimentData, setSentimentData] = useState<SentimentData[]>([]);
  const [topicData, setTopicData] = useState<TopicData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sentimentRes, topicsRes] = await Promise.all([
          axios.get('/api/analytics/sentiment'),
          axios.get('/api/analytics/topics'),
        ]);

        // Transform sentiment data
        const sentimentArray = Object.entries(sentimentRes.data.sentiment_distribution).map(
          ([name, count]) => ({
            name,
            count: count as number,
          })
        );
        setSentimentData(sentimentArray);

        // Transform topic data
        const topicArray = Object.entries(topicsRes.data.topic_distribution).map(
          ([text, value]) => ({
            text,
            value: value as number,
          })
        );
        setTopicData(topicArray);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      }
    };

    fetchData();
    // Refresh data every 5 minutes
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <StyledPaper>
      <Typography variant="h5" gutterBottom>
        Feedback Analytics
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            Sentiment Distribution
          </Typography>
          <ChartContainer>
            <ResponsiveContainer>
              <BarChart data={sentimentData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#1976d2" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            Topic Cloud
          </Typography>
          <ChartContainer>
            <WordCloud words={topicData} />
          </ChartContainer>
        </Grid>
      </Grid>
    </StyledPaper>
  );
};

export default Dashboard;
