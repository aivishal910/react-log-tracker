import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { logUserAction, getUserLogs, UserLogEntry } from '@/lib/userActivityLogger';
import { formatDistanceToNow } from 'date-fns';

interface UserActivityDemoProps {
  userId?: string;
}

export function UserActivityDemo({ userId = 'demo-user-123' }: UserActivityDemoProps) {
  const [logs, setLogs] = useState<UserLogEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [surveyData, setSurveyData] = useState({
    name: '',
    email: '',
    feedback: ''
  });

  // Log page visit on component mount
  useEffect(() => {
    logUserAction(userId, 'Visited Activity Demo Page', {
      page: 'UserActivityDemo',
      timestamp: new Date().toISOString()
    });
  }, [userId]);

  // Fetch user logs
  const fetchLogs = async () => {
    setLoading(true);
    const result = await getUserLogs(userId);
    if (result.success && result.data) {
      setLogs(result.data);
    } else {
      toast.error('Failed to fetch logs: ' + (result.error || 'Unknown error'));
    }
    setLoading(false);
  };

  // Handle survey submission
  const handleSurveySubmit = async (e: React.FormEvent) => {
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
    fetchLogs(); // Refresh logs
  };

  // Handle button clicks
  const handleActionClick = async (actionName: string, details: any = {}) => {
    await logUserAction(userId, actionName, details);
    toast.success(`Action "${actionName}" logged!`);
    fetchLogs(); // Refresh logs
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const getActionBadgeVariant = (action: string) => {
    if (action.includes('Visited')) return 'secondary';
    if (action.includes('Submitted')) return 'default';
    if (action.includes('Clicked')) return 'outline';
    return 'secondary';
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-foreground">User Activity Log System</h1>
        <p className="text-muted-foreground">
          Demonstrate logging user actions in a survey application
        </p>
        <Badge variant="outline" className="mt-2">
          User ID: {userId}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Demo Actions Section */}
        <div className="space-y-6">
          {/* Sample Survey Form */}
          <Card>
            <CardHeader>
              <CardTitle>Sample Survey Form</CardTitle>
              <CardDescription>
                Fill out this form to test survey submission logging
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSurveySubmit} className="space-y-4">
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

          {/* Action Buttons */}
          <Card>
            <CardHeader>
              <CardTitle>Test Actions</CardTitle>
              <CardDescription>
                Click these buttons to generate different types of logs
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                onClick={() => handleActionClick('Clicked Help Button', { section: 'demo' })}
                className="w-full"
              >
                Click Help
              </Button>
              <Button
                variant="outline"
                onClick={() => handleActionClick('Downloaded Report', { reportType: 'survey-results' })}
                className="w-full"
              >
                Download Report
              </Button>
              <Button
                variant="outline"
                onClick={() => handleActionClick('Updated Profile', { field: 'preferences' })}
                className="w-full"
              >
                Update Profile
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Activity Logs Section */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Activity Logs</CardTitle>
              <CardDescription>
                Recent user activity for {userId}
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchLogs}
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Refresh'}
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {logs.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  No activity logs yet. Perform some actions to see them here!
                </p>
              ) : (
                logs.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-start justify-between p-3 border rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant={getActionBadgeVariant(log.action)}>
                          {log.action}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {log.timestamp && formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })}
                        </span>
                      </div>
                      {log.details && Object.keys(log.details).length > 0 && (
                        <pre className="text-xs text-muted-foreground bg-muted p-2 rounded mt-1 overflow-x-auto">
                          {JSON.stringify(log.details, null, 2)}
                        </pre>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}