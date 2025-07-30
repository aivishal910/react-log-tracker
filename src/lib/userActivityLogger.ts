import { mockDatabase } from './mockDatabase';

// Mock Supabase-like interface using our mock database
const supabase = {
  from: (table: string) => ({
    insert: async (data: any) => {
      return await mockDatabase.insert(table, data);
    },
    select: (columns: string) => ({
      eq: (column: string, value: any) => ({
        order: (orderColumn: string, options: any) => ({
          range: async (start: number, end: number) => {
            const limit = end - start + 1;
            return await mockDatabase.select(table, value, limit, start);
          }
        })
      })
    })
  })
};

export interface LogDetails {
  [key: string]: any;
}

export interface UserLogEntry {
  id?: string;
  user_id: string;
  action: string;
  details?: LogDetails;
  timestamp?: string;
  created_at?: string;
}

/**
 * Logs user activity to the database
 * @param userId - The ID of the user performing the action
 * @param action - Description of the action (e.g., "Visited Survey Page", "Submitted Survey")
 * @param details - Additional details about the action (e.g., { surveyId: "123" })
 */
export async function logUserAction(
  userId: string,
  action: string,
  details: LogDetails = {}
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('user_logs')
      .insert({
        user_id: userId,
        action,
        details,
        timestamp: new Date().toISOString()
      });

    if (error) {
      console.error('Failed to log user action:', error);
      return { success: false, error: typeof error === 'string' ? error : 'Database error' };
    }

    return { success: true };
  } catch (error) {
    console.error('Error logging user action:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

/**
 * Fetches user logs for a specific user
 * @param userId - The ID of the user whose logs to fetch
 * @param limit - Maximum number of logs to fetch (default: 50)
 * @param offset - Number of logs to skip (for pagination)
 */
export async function getUserLogs(
  userId: string,
  limit: number = 50,
  offset: number = 0
): Promise<{ success: boolean; data?: UserLogEntry[]; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('user_logs')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Failed to fetch user logs:', error);
      return { success: false, error: typeof error === 'string' ? error : 'Database error' };
    }

    return { success: true, data: data || [] };
  } catch (error) {
    console.error('Error fetching user logs:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

/**
 * Hook for automatically logging page visits
 * @param userId - The ID of the user
 * @param pageName - Name of the page being visited
 * @param additionalDetails - Any additional details to log
 */
export function usePageVisitLogger(
  userId: string,
  pageName: string,
  additionalDetails: LogDetails = {}
) {
  React.useEffect(() => {
    if (userId) {
      logUserAction(userId, `Visited ${pageName}`, {
        page: pageName,
        url: window.location.href,
        ...additionalDetails
      });
    }
  }, [userId, pageName, additionalDetails]);
}

// Import React for the hook
import React from 'react';