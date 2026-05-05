import { request } from './client';
import { PostResponse } from '../constants/types';

function buildExcludeQs(excludeIds?: number[]): string {
  if (!excludeIds || excludeIds.length === 0) return '';
  return `&exclude=${excludeIds.join(',')}`;
}

export function getPosts(page = 1, pageSize = 20, excludeIds?: number[]) {
  return request<PostResponse[]>(
    `/api/posts?page=${page}&pageSize=${pageSize}${buildExcludeQs(excludeIds)}`
  );
}

export function getRecommendations(count = 20, excludeIds?: number[]) {
  return request<PostResponse[]>(
    `/api/recommendations/fyp?count=${count}${buildExcludeQs(excludeIds)}`,
    { auth: true }
  );
}

export function createPost(body: string) {
  return request<PostResponse>('/api/posts', { method: 'POST', body: { body }, auth: true });
}

export function deletePost(id: number) {
  return request<void>(`/api/posts/${id}`, { method: 'DELETE', auth: true });
}
