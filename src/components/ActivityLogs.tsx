import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UserLogEntry } from '@/lib/userActivityLogger';
import { formatDistanceToNow } from 'date-fns';

interface ActivityLogsProps {
  userId: string;
  logs: UserLogEntry[];
  loading: boolean;
  onRefresh: () => void;
}

export function ActivityLogs({ userId, logs, loading, onRefresh }: ActivityLogsProps) {
  const getActionBadgeVariant = (action: string) => {
    if (action.includes('Visited')) return 'secondary';
    if (action.includes('Submitted')) return 'default';
    if (action.includes('Clicked')) return 'outline';
    if (action.includes('Downloaded')) return 'destructive';
    if (action.includes('Updated')) return 'secondary';
    if (action.includes('Searched')) return 'outline';
    return 'secondary';
  };

  return (
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
          onClick={onRefresh}
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
  );
}