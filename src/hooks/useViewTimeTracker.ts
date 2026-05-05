import { useCallback, useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import type { ViewToken } from 'react-native';
import { postInteraction } from '../api/interactions';

const MIN_REPORTABLE_SECONDS = 0.5;

const sessionReportedIds = new Set<number>();

type Tracker = {
  onViewableItemsChanged: (info: { viewableItems: ViewToken[]; changed: ViewToken[] }) => void;
  flushAll: () => void;
};

export function useViewTimeTracker(): Tracker {
  const startTimes = useRef<Map<number, number>>(new Map());

  const reportAndForget = useCallback((postId: number) => {
    const start = startTimes.current.get(postId);
    if (start == null) return;
    startTimes.current.delete(postId);
    if (sessionReportedIds.has(postId)) return;
    const seconds = (Date.now() - start) / 1000;
    if (seconds < MIN_REPORTABLE_SECONDS) return;
    sessionReportedIds.add(postId);
    const rounded = Math.round(seconds * 10) / 10;
    postInteraction(postId, 1, rounded).catch(() => {
      sessionReportedIds.delete(postId);
    });
  }, []);

  const flushAll = useCallback(() => {
    const ids = Array.from(startTimes.current.keys());
    ids.forEach(reportAndForget);
  }, [reportAndForget]);

  const onViewableItemsChanged = useCallback(
    ({ changed }: { viewableItems: ViewToken[]; changed: ViewToken[] }) => {
      const now = Date.now();
      changed.forEach((token) => {
        const id = (token.item as { id?: number })?.id;
        if (typeof id !== 'number') return;
        if (token.isViewable) {
          if (sessionReportedIds.has(id)) return;
          if (!startTimes.current.has(id)) startTimes.current.set(id, now);
        } else {
          reportAndForget(id);
        }
      });
    },
    [reportAndForget]
  );

  useEffect(() => {
    const sub = AppState.addEventListener('change', (state: AppStateStatus) => {
      if (state === 'background' || state === 'inactive') {
        flushAll();
      }
    });

    return () => {
      sub.remove();
      flushAll();
    };
  }, [flushAll]);

  return { onViewableItemsChanged, flushAll };
}
