import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { logUserAction } from '@/lib/userActivityLogger';

interface TestActionsProps {
  userId: string;
  onActionPerformed: () => void;
}

export function TestActions({ userId, onActionPerformed }: TestActionsProps) {
  const handleActionClick = async (actionName: string, details: any = {}) => {
    await logUserAction(userId, actionName, details);
    toast.success(`Action "${actionName}" logged!`);
    onActionPerformed();
  };

  return (
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
        <Button
          variant="outline"
          onClick={() => handleActionClick('Searched Database', { query: 'user analytics', filters: ['active', 'recent'] })}
          className="w-full"
        >
          Search Database
        </Button>
      </CardContent>
    </Card>
  );
}