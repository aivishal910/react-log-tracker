import React, { useState, useEffect } from 'react';
import { logUserAction, getUserLogs, UserLogEntry } from '@/lib/userActivityLogger';
import { UserSelector, DEMO_USERS } from './UserSelector';
import { SurveyForm } from './SurveyForm';
import { TestActions } from './TestActions';
import { ActivityLogs } from './ActivityLogs';

export function UserActivityDemo() {
  const [selectedUserId, setSelectedUserId] = useState(DEMO_USERS[0].id);
  const [logs, setLogs] = useState<UserLogEntry[]>([]);
  const [loading, setLoading] = useState(false);

  // Log page visit when component mounts or user changes
  useEffect(() => {
    logUserAction(selectedUserId, 'Visited Activity Demo Page', {
      page: 'UserActivityDemo',
      timestamp: new Date().toISOString()
    });
  }, [selectedUserId]);

  // Fetch user logs
  const fetchLogs = async () => {
    setLoading(true);
    const result = await getUserLogs(selectedUserId);
    if (result.success && result.data) {
      setLogs(result.data);
    }
    setLoading(false);
  };

  // Refresh logs when user changes
  useEffect(() => {
    fetchLogs();
  }, [selectedUserId]);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-foreground">Multi-User Activity Log System</h1>
        <p className="text-muted-foreground">
          Track user actions across multiple users in a survey application
        </p>
        
        <div className="flex justify-center">
          <UserSelector 
            selectedUserId={selectedUserId} 
            onUserChange={setSelectedUserId} 
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Demo Actions Section */}
        <div className="space-y-6">
          <SurveyForm 
            userId={selectedUserId} 
            onSurveySubmit={fetchLogs} 
          />
          
          <TestActions 
            userId={selectedUserId} 
            onActionPerformed={fetchLogs} 
          />
        </div>

        {/* Activity Logs Section */}
        <ActivityLogs 
          userId={selectedUserId}
          logs={logs}
          loading={loading}
          onRefresh={fetchLogs}
        />
      </div>
    </div>
  );
}