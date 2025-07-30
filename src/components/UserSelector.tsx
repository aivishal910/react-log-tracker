import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

export interface User {
  id: string;
  name: string;
  role: string;
}

export const DEMO_USERS: User[] = [
  { id: 'user-001', name: 'Alice Johnson', role: 'Admin' },
  { id: 'user-002', name: 'Bob Smith', role: 'Manager' },
  { id: 'user-003', name: 'Carol Davis', role: 'User' },
  { id: 'user-004', name: 'David Wilson', role: 'User' },
  { id: 'user-005', name: 'Emma Brown', role: 'Manager' }
];

interface UserSelectorProps {
  selectedUserId: string;
  onUserChange: (userId: string) => void;
}

export function UserSelector({ selectedUserId, onUserChange }: UserSelectorProps) {
  const selectedUser = DEMO_USERS.find(user => user.id === selectedUserId);

  return (
    <div className="space-y-2">
      <Label htmlFor="user-select">Select User to Track</Label>
      <div className="flex items-center gap-3">
        <Select value={selectedUserId} onValueChange={onUserChange}>
          <SelectTrigger id="user-select" className="w-64">
            <SelectValue placeholder="Select a user..." />
          </SelectTrigger>
          <SelectContent>
            {DEMO_USERS.map((user) => (
              <SelectItem key={user.id} value={user.id}>
                <div className="flex items-center gap-2">
                  <span>{user.name}</span>
                  <Badge variant="outline" className="text-xs">
                    {user.role}
                  </Badge>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {selectedUser && (
          <Badge variant="secondary">
            ID: {selectedUser.id}
          </Badge>
        )}
      </div>
    </div>
  );
}