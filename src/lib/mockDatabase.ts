// Mock database for demonstrating user activity logging
// In production, this would be replaced with actual Supabase integration

import { UserLogEntry } from './userActivityLogger';

class MockDatabase {
  private storageKey = 'user_activity_logs';
  private counterKey = 'user_activity_counter';

  private getLogs(): UserLogEntry[] {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('[LocalStorageDB] Error reading logs:', error);
      return [];
    }
  }

  private saveLogs(logs: UserLogEntry[]): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(logs));
    } catch (error) {
      console.error('[LocalStorageDB] Error saving logs:', error);
    }
  }

  private getNextId(): string {
    try {
      const stored = localStorage.getItem(this.counterKey);
      const counter = stored ? parseInt(stored) : 1;
      const nextId = `log_${counter}`;
      localStorage.setItem(this.counterKey, (counter + 1).toString());
      return nextId;
    } catch (error) {
      console.error('[LocalStorageDB] Error managing counter:', error);
      return `log_${Date.now()}`;
    }
  }

  async insert(tableName: string, data: Omit<UserLogEntry, 'id' | 'created_at'>): Promise<{ error: null | string }> {
    try {
      const logs = this.getLogs();
      const newLog: UserLogEntry = {
        ...data,
        id: this.getNextId(),
        created_at: new Date().toISOString(),
        timestamp: data.timestamp || new Date().toISOString()
      };

      logs.push(newLog);
      this.saveLogs(logs);
      console.log(`[LocalStorageDB] Inserted log:`, newLog);
      
      return { error: null };
    } catch (error) {
      console.error('[LocalStorageDB] Insert error:', error);
      return { error: 'Failed to insert log' };
    }
  }

  async select(tableName: string, userId: string, limit: number = 50, offset: number = 0): Promise<{ data: UserLogEntry[]; error: null | string }> {
    try {
      const logs = this.getLogs();
      const userLogs = logs
        .filter(log => log.user_id === userId)
        .sort((a, b) => new Date(b.timestamp!).getTime() - new Date(a.timestamp!).getTime())
        .slice(offset, offset + limit);

      console.log(`[LocalStorageDB] Selected ${userLogs.length} logs for user ${userId}`);
      
      return { data: userLogs, error: null };
    } catch (error) {
      console.error('[LocalStorageDB] Select error:', error);
      return { data: [], error: 'Failed to fetch logs' };
    }
  }

  getAllLogs(): UserLogEntry[] {
    return this.getLogs();
  }

  // Additional utility methods for localStorage management
  clearAllLogs(): void {
    try {
      localStorage.removeItem(this.storageKey);
      localStorage.removeItem(this.counterKey);
      console.log('[LocalStorageDB] All logs cleared');
    } catch (error) {
      console.error('[LocalStorageDB] Error clearing logs:', error);
    }
  }

  exportLogs(): string {
    try {
      const logs = this.getLogs();
      return JSON.stringify(logs, null, 2);
    } catch (error) {
      console.error('[LocalStorageDB] Export error:', error);
      return '[]';
    }
  }
}

export const mockDatabase = new MockDatabase();