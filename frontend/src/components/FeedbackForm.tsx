import React, { useState } from 'react';
import { Paper, TextField, Button, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import axios from 'axios';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
}));

const StyledForm = styled('form')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
}));

const FeedbackForm = () => {
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    try {
      await axios.post('/api/feedback/', {
        text: feedback,
      });
      setFeedback('');
      setSubmitStatus('success');
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <StyledPaper>
      <Typography variant="h5" gutterBottom>
        Submit Feedback
      </Typography>
      <StyledForm onSubmit={handleSubmit}>
        <TextField
          label="Your Feedback"
          multiline
          rows={4}
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          variant="outlined"
          fullWidth
          required
          disabled={isSubmitting}
          placeholder="Share your thoughts or experience..."
          helperText="Your feedback will be analyzed for sentiment and key topics"
        />
        <Button 
          type="submit"
          variant="contained"
          color="primary"
          disabled={isSubmitting || !feedback.trim()}
          fullWidth
        >
          {isSubmitting ? 'Analyzing...' : 'Submit Feedback'}
        </Button>
        {submitStatus === 'success' && (
          <Typography color="success" variant="body2">
            Thank you for your feedback! It has been analyzed and recorded.
          </Typography>
        )}
        {submitStatus === 'error' && (
          <Typography color="error" variant="body2">
            Sorry, there was an error submitting your feedback. Please try again.
          </Typography>
        )}
      </StyledForm>
    </StyledPaper>
  );
};

export default FeedbackForm;
