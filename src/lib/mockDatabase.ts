// Mock database for demonstrating user activity logging
// In production, this would be replaced with actual Supabase integration

import { UserLogEntry } from './userActivityLogger';

class MockDatabase {
  private logs: UserLogEntry[] = [];
  private idCounter = 1;

  async insert(tableName: string, data: Omit<UserLogEntry, 'id' | 'created_at'>): Promise<{ error: null | string }> {
    const newLog: UserLogEntry = {
      ...data,
      id: `log_${this.idCounter++}`,
      created_at: new Date().toISOString(),
      timestamp: data.timestamp || new Date().toISOString()
    };

    this.logs.push(newLog);
    console.log(`[MockDB] Inserted log:`, newLog);
    
    return { error: null };
  }

  async select(tableName: string, userId: string, limit: number = 50, offset: number = 0): Promise<{ data: UserLogEntry[]; error: null | string }> {
    const userLogs = this.logs
      .filter(log => log.user_id === userId)
      .sort((a, b) => new Date(b.timestamp!).getTime() - new Date(a.timestamp!).getTime())
      .slice(offset, offset + limit);

    console.log(`[MockDB] Selected ${userLogs.length} logs for user ${userId}`);
    
    return { data: userLogs, error: null };
  }

  getAllLogs(): UserLogEntry[] {
    return [...this.logs];
  }
}

export const mockDatabase = new MockDatabase();