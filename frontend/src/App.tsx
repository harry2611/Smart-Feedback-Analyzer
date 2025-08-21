import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import FeedbackForm from './components/FeedbackForm';
import Dashboard from './components/Dashboard';

const App: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Smart Feedback Analyzer
        </Typography>
        <Typography variant="body1" gutterBottom>
          Welcome to the Smart Feedback Analyzer platform.
        </Typography>
        <Box sx={{ mt: 4 }}>
          <FeedbackForm />
          <Dashboard />
        </Box>
      </Box>
    </Container>
  );
}

export default App;
