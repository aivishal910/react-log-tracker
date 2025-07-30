# User Activity Log System Guide

## Overview

This User Activity Log System tracks user actions across your survey-based web application. It's currently running with a mock database for demonstration, but can be easily connected to Supabase for production use.

## Features

- ✅ **Automatic Activity Logging**: Track user actions like page visits, form submissions, button clicks
- ✅ **Flexible Data Structure**: Store action details as JSON for maximum flexibility
- ✅ **TypeScript Support**: Fully typed interfaces for better development experience
- ✅ **React Hooks**: Easy integration with React components
- ✅ **Real-time Updates**: View logs in real-time as actions are performed
- ✅ **Professional UI**: Beautiful interface to view and manage activity logs

## Current Implementation

### Database Schema (Mock)
```typescript
interface UserLogEntry {
  id?: string;
  user_id: string;           // User identifier
  action: string;            // Action description (e.g., "Visited Survey Page")
  details?: LogDetails;      // Additional JSON data
  timestamp?: string;        // When the action occurred
  created_at?: string;       // Record creation time
}
```

### Core Functions

#### `logUserAction(userId, action, details)`
```typescript
// Log a user action
await logUserAction("user-123", "Submitted Survey", {
  surveyId: "survey-456",
  surveyType: "feedback",
  responseCount: 5
});
```

#### `getUserLogs(userId, limit, offset)`
```typescript
// Fetch user's activity logs
const { success, data, error } = await getUserLogs("user-123", 20, 0);
```

#### `usePageVisitLogger(userId, pageName, details)`
```typescript
// Auto-log page visits in React components
const MyComponent = () => {
  usePageVisitLogger("user-123", "Survey Dashboard", { 
    section: "analytics" 
  });
  
  return <div>Dashboard Content</div>;
};
```

## Integration Examples

### 1. Survey Form Submission
```typescript
const handleSurveySubmit = async (formData) => {
  // Submit survey data
  const surveyResult = await submitSurvey(formData);
  
  // Log the action
  await logUserAction(userId, "Submitted Survey", {
    surveyId: surveyResult.id,
    surveyType: formData.type,
    responseTime: Date.now() - startTime,
    questionCount: formData.responses.length
  });
};
```

### 2. Page Navigation Tracking
```typescript
const SurveyPage = () => {
  const { userId } = useAuth();
  
  // Automatically log page visit
  usePageVisitLogger(userId, "Survey Creation Page", {
    referrer: document.referrer,
    userAgent: navigator.userAgent
  });
  
  return <SurveyBuilder />;
};
```

### 3. Button Click Tracking
```typescript
const AnalyticsButton = () => {
  const handleExportClick = async () => {
    await logUserAction(userId, "Exported Survey Results", {
      exportFormat: "CSV",
      surveyId: currentSurvey.id,
      recordCount: results.length
    });
    
    // Perform export
    exportToCSV(results);
  };
  
  return <Button onClick={handleExportClick}>Export Results</Button>;
};
```

## Converting to Supabase (Production)

To use this with actual Supabase instead of the mock database:

### 1. Create the Database Table
```sql
-- Create user_logs table
CREATE TABLE IF NOT EXISTS public.user_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL,
    action TEXT NOT NULL,
    details JSONB DEFAULT '{}',
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_logs_user_id ON public.user_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_user_logs_timestamp ON public.user_logs(timestamp);
CREATE INDEX IF NOT EXISTS idx_user_logs_action ON public.user_logs(action);

-- Enable RLS
ALTER TABLE public.user_logs ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view their own logs" ON public.user_logs
    FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert their own logs" ON public.user_logs
    FOR INSERT WITH CHECK (auth.uid()::text = user_id);
```

### 2. Update the Logger Implementation
Replace the mock client in `src/lib/userActivityLogger.ts`:

```typescript
// Replace this line:
import { mockDatabase } from './mockDatabase';

// With:
import { supabase } from "@/integrations/supabase/client";

// Remove the mock supabase object and use the real one
```

## Analytics & Insights

With this logging system, you can analyze:

- **User Journey**: Track how users navigate through your survey application
- **Feature Usage**: See which features are most/least used
- **Performance Issues**: Identify where users spend the most time
- **Survey Completion Rates**: Track survey abandonment points
- **User Engagement**: Measure active user sessions and interactions

## Best Practices

1. **Privacy Compliance**: Only log necessary data and respect user privacy
2. **Performance**: Batch log entries for high-frequency actions
3. **Data Retention**: Implement log rotation and cleanup policies
4. **Error Handling**: Always handle logging failures gracefully
5. **Testing**: Test logging in different scenarios and edge cases

## Demo Features

The current demo includes:

- **Interactive Survey Form**: Submit surveys and see logging in action
- **Action Buttons**: Test different types of user interactions
- **Real-time Log Viewer**: See logs appear immediately after actions
- **Professional UI**: Clean, responsive design using Tailwind CSS
- **TypeScript Support**: Full type safety throughout the codebase

Try the demo to see how the system works, then integrate it into your own survey application!