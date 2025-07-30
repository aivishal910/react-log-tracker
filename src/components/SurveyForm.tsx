import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { logUserAction } from '@/lib/userActivityLogger';

interface SurveyFormProps {
  userId: string;
  onSurveySubmit: () => void;
}

export function SurveyForm({ userId, onSurveySubmit }: SurveyFormProps) {
  const [surveyData, setSurveyData] = useState({
    name: '',
    email: '',
    feedback: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    await logUserAction(userId, 'Submitted Survey', {
      surveyType: 'feedback',
      surveyData: {
        name: surveyData.name,
        email: surveyData.email,
        feedbackLength: surveyData.feedback.length
      }
    });

    toast.success('Survey submitted and logged!');
    setSurveyData({ name: '', email: '', feedback: '' });
    onSurveySubmit();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sample Survey Form</CardTitle>
        <CardDescription>
          Fill out this form to test survey submission logging
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={surveyData.name}
              onChange={(e) => setSurveyData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter your name"
              required
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={surveyData.email}
              onChange={(e) => setSurveyData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <Label htmlFor="feedback">Feedback</Label>
            <Textarea
              id="feedback"
              value={surveyData.feedback}
              onChange={(e) => setSurveyData(prev => ({ ...prev, feedback: e.target.value }))}
              placeholder="Share your feedback..."
              rows={3}
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Submit Survey
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}