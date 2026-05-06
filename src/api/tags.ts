import { request } from './client';
import { KeyTag, ClusterTag } from '../constants/types';

export function getKeyTags() {
  return request<KeyTag[]>('/api/tags/keys');
}

export function getClusterTags(keyTagId?: number) {
  const qs = keyTagId != null ? `?keyTagId=${keyTagId}` : '';
  return request<ClusterTag[]>(`/api/tags/clusters${qs}`);
}

export function searchUserTags(q: string) {
  return request<{ id: number; name: string }[]>(
    `/api/tags/raw/search?q=${encodeURIComponent(q)}`
  );
}
