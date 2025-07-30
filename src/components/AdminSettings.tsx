import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Users, Activity } from 'lucide-react';
import { getUserLogs, UserLogEntry } from '@/lib/userActivityLogger';
import { DEMO_USERS, User } from './UserSelector';
import { ActivityLogs } from './ActivityLogs';
import { formatDistanceToNow } from 'date-fns';

interface AdminSettingsProps {
  currentUserId: string;
  onClose: () => void;
}

export function AdminSettings({ currentUserId, onClose }: AdminSettingsProps) {
  const [selectedUser, setSelectedUser] = useState<User>(DEMO_USERS[0]);
  const [logs, setLogs] = useState<UserLogEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [allUsersStats, setAllUsersStats] = useState<Record<string, number>>({});

  const currentUser = DEMO_USERS.find(u => u.id === currentUserId);
  const isAdmin = currentUser?.role === 'Admin';

  // Fetch logs for selected user
  const fetchUserLogs = async (userId: string) => {
    setLoading(true);
    const result = await getUserLogs(userId);
    if (result.success && result.data) {
      setLogs(result.data);
    }
    setLoading(false);
  };

  // Fetch activity stats for all users
  const fetchAllUsersStats = async () => {
    const stats: Record<string, number> = {};
    for (const user of DEMO_USERS) {
      const result = await getUserLogs(user.id);
      stats[user.id] = result.success && result.data ? result.data.length : 0;
    }
    setAllUsersStats(stats);
  };

  useEffect(() => {
    if (isAdmin) {
      fetchUserLogs(selectedUser.id);
      fetchAllUsersStats();
    }
  }, [selectedUser.id, isAdmin]);

  if (!isAdmin) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-destructive" />
            Access Denied
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertDescription>
              You need Admin privileges to access user activity logs. Your current role: {currentUser?.role || 'Unknown'}
            </AlertDescription>
          </Alert>
          <Button onClick={onClose} className="mt-4">
            Close
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Admin Settings - User Activity Management
          </CardTitle>
          <CardDescription>
            Monitor and analyze user activity across the application
          </CardDescription>
          <div className="flex justify-between items-center pt-2">
            <Badge variant="destructive">Admin Access</Badge>
            <Button variant="outline" onClick={onClose}>
              Close Admin Panel
            </Button>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Users Overview
          </TabsTrigger>
          <TabsTrigger value="detailed" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Detailed Logs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Users Activity Summary</CardTitle>
              <CardDescription>
                Overview of activity levels for all users in the system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {DEMO_USERS.map((user) => (
                  <Card key={user.id} className="cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => setSelectedUser(user)}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{user.name}</h3>
                        <Badge variant={user.role === 'Admin' ? 'destructive' : user.role === 'Manager' ? 'default' : 'secondary'}>
                          {user.role}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">ID: {user.id}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-primary">
                          {allUsersStats[user.id] || 0}
                        </span>
                        <span className="text-sm text-muted-foreground">activities</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="detailed" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Selection</CardTitle>
              <CardDescription>
                Select a user to view their detailed activity logs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                {DEMO_USERS.map((user) => (
                  <Button
                    key={user.id}
                    variant={selectedUser.id === user.id ? "default" : "outline"}
                    onClick={() => setSelectedUser(user)}
                    className="flex flex-col items-center p-3 h-auto"
                  >
                    <span className="font-semibold text-sm">{user.name}</span>
                    <Badge variant="outline" className="text-xs mt-1">
                      {user.role}
                    </Badge>
                    <span className="text-xs text-muted-foreground mt-1">
                      {allUsersStats[user.id] || 0} logs
                    </span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <ActivityLogs
            userId={selectedUser.id}
            logs={logs}
            loading={loading}
            onRefresh={() => fetchUserLogs(selectedUser.id)}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}