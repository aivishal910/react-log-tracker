import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Settings, Shield } from 'lucide-react';
import { logUserAction, getUserLogs, UserLogEntry } from '@/lib/userActivityLogger';
import { UserSelector, DEMO_USERS } from './UserSelector';
import { SurveyForm } from './SurveyForm';
import { TestActions } from './TestActions';
import { ActivityLogs } from './ActivityLogs';
import { AdminSettings } from './AdminSettings';

export function UserActivityDemo() {
  const [selectedUserId, setSelectedUserId] = useState(DEMO_USERS[0].id);
  const [logs, setLogs] = useState<UserLogEntry[]>([]);
  const [showAdminSettings, setShowAdminSettings] = useState(false);
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

  const currentUser = DEMO_USERS.find(u => u.id === selectedUserId);
  const isAdmin = currentUser?.role === 'Admin';

  if (showAdminSettings) {
    return (
      <div className="container mx-auto p-6">
        <AdminSettings 
          currentUserId={selectedUserId}
          onClose={() => setShowAdminSettings(false)}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-foreground">Multi-User Activity Log System</h1>
        <p className="text-muted-foreground">
          Track user actions across multiple users in a survey application
        </p>
        
        <div className="flex justify-center items-center gap-4">
          <UserSelector 
            selectedUserId={selectedUserId} 
            onUserChange={setSelectedUserId} 
          />
          {isAdmin && (
            <Button
              variant="outline"
              onClick={() => setShowAdminSettings(true)}
              className="flex items-center gap-2"
            >
              <Shield className="h-4 w-4" />
              Admin Settings
            </Button>
          )}
        </div>
        
        {isAdmin && (
          <div className="flex justify-center">
            <Badge variant="destructive" className="flex items-center gap-1">
              <Shield className="h-3 w-3" />
              Admin User - Access to All Activity Logs
            </Badge>
          </div>
        )}
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