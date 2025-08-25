import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  Tabs,
  Tab,
  useTheme,
} from '@mui/material';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';
import { format } from 'date-fns';
import WordCloud from './WordCloud';

interface AnalyticsProps {
  timeRange?: 'day' | 'week' | 'month' | 'year';
}

const AdvancedAnalytics: React.FC<AnalyticsProps> = ({ timeRange = 'week' }) => {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/analytics/advanced?timeRange=${timeRange}`);
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError('Failed to load analytics data');
      console.error('Error fetching analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  const renderSentimentTrends = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Sentiment Trends
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data.sentimentTrends}>
            <XAxis
              dataKey="date"
              tickFormatter={(date) => format(new Date(date), 'MM/dd')}
            />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="positive"
              stroke={theme.palette.success.main}
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="negative"
              stroke={theme.palette.error.main}
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );

  const renderTopicClusters = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Topic Clusters
        </Typography>
        <Box height={400}>
          <WordCloud
            words={data.topicClusters.map((topic: any) => ({
              text: topic.name,
              value: topic.weight,
            }))}
          />
        </Box>
      </CardContent>
    </Card>
  );

  const renderEmotionDistribution = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Emotion Distribution
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data.emotionDistribution}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {data.emotionDistribution.map((entry: any, index: number) => (
                <Cell
                  key={`cell-${index}`}
                  fill={[
                    theme.palette.primary.main,
                    theme.palette.secondary.main,
                    theme.palette.success.main,
                    theme.palette.error.main,
                    theme.palette.warning.main,
                    theme.palette.info.main
                  ][index % 6]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ width: '100%' }}>
      <Tabs
        value={activeTab}
        onChange={(_, newValue) => setActiveTab(newValue)}
        centered
        sx={{ mb: 3 }}
      >
        <Tab label="Overview" />
        <Tab label="Sentiment Analysis" />
        <Tab label="Topic Analysis" />
        <Tab label="Trends" />
      </Tabs>

      <Grid container spacing={3}>
        {activeTab === 0 && (
          <>
            <Grid item xs={12} md={8}>
              {renderSentimentTrends()}
            </Grid>
            <Grid item xs={12} md={4}>
              {renderEmotionDistribution()}
            </Grid>
            <Grid item xs={12}>
              {renderTopicClusters()}
            </Grid>
          </>
        )}

        {activeTab === 1 && (
          <Grid item xs={12}>
            {renderSentimentTrends()}
          </Grid>
        )}

        {activeTab === 2 && (
          <Grid item xs={12}>
            {renderTopicClusters()}
          </Grid>
        )}

        {activeTab === 3 && (
          <Grid item xs={12}>
            {renderEmotionDistribution()}
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default AdvancedAnalytics;
