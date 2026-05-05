import { request } from './client';

export interface AnalyticsResponse {
  interactionsByType: Record<string, number>;
  topTopics: { name: string; count: number }[];
  dailyActivity: {
    date: string;
    views: number;
    likes: number;
    dislikes: number;
    saves: number;
  }[];
}

export function getMyAnalytics() {
  return request<AnalyticsResponse>('/api/analytics/my', { auth: true });
}
