import { request } from './client';
import { InteractionType } from '../constants/types';

export function postInteraction(postId: number, interactionType: InteractionType, viewDurationSeconds?: number) {
  return request('/api/interactions', {
    method: 'POST',
    body: { postId, interactionType, viewDurationSeconds },
    auth: true,
  });
}
