import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, View, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScreenHeader } from '../components/ScreenHeader';
import { PostCard } from '../components/PostCard';
import { PostDetail } from '../components/PostDetail';
import { getRecommendations, getPosts } from '../api/posts';
import { PostResponse } from '../constants/types';
import { Colors } from '../constants/colors';
import { useAuth } from '../store/AuthContext';
import { useViewTimeTracker } from '../hooks/useViewTimeTracker';

const PAGE_SIZE = 20;
const PREFETCH_DISTANCE = 5;

const VIEWABILITY_CONFIG = {
  itemVisiblePercentThreshold: 60,
  minimumViewTime: 100,
};

export function FeedScreen({ navigation }: any) {
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const [posts, setPosts] = useState<PostResponse[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [selectedPost, setSelectedPost] = useState<PostResponse | null>(null);

  const seenIdsRef = useRef<Set<number>>(new Set());
  const flatListRef = useRef<FlatList<PostResponse>>(null);

  const { onViewableItemsChanged, flushAll } = useViewTimeTracker();

  const viewabilityConfigCallbackPairs = useRef([
    { viewabilityConfig: VIEWABILITY_CONFIG, onViewableItemsChanged },
  ]);

  const loadMore = useCallback(
    async (reset = false) => {
      if (!reset && (loadingMore || !hasMore)) return;
      if (!reset) setLoadingMore(true);
      const excludeIds = reset ? [] : Array.from(seenIdsRef.current);
      const requestPage = reset ? 1 : page;

      try {
        const data = user
          ? await getRecommendations(PAGE_SIZE, excludeIds)
          : await getPosts(requestPage, PAGE_SIZE, excludeIds);

        const fresh = data.filter((p) => !seenIdsRef.current.has(p.id));

        if (reset) {
          seenIdsRef.current = new Set(fresh.map((p) => p.id));
          setPosts(fresh);
          setPage(2);
          setHasMore(data.length > 0);
        } else {
          fresh.forEach((p) => seenIdsRef.current.add(p.id));
          setPosts((prev) => [...prev, ...fresh]);
          setPage((p) => p + 1);
          if (data.length === 0) setHasMore(false);
        }
      } catch {
        // silent
      } finally {
        if (!reset) setLoadingMore(false);
      }
    },
    [user, page, hasMore, loadingMore]
  );

  useEffect(() => {
    loadMore(true).finally(() => setLoading(false));
  }, []);

  useFocusEffect(
    useCallback(() => {
      return () => {
        flushAll();
      };
    }, [flushAll])
  );

  useEffect(() => {
    const unsub = navigation.addListener('tabPress', () => {
      flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
      setHasMore(true);
      loadMore(true);
    });
    return unsub;
  }, [navigation, loadMore]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setHasMore(true);
    await loadMore(true);
    setRefreshing(false);
  }, [loadMore]);

  const onEndReached = useCallback(() => {
    if (hasMore && !loading && !loadingMore) loadMore(false);
  }, [hasMore, loading, loadingMore, loadMore]);

  const endReachedThreshold = useMemo(() => {
    if (posts.length === 0) return 0.1;
    return PREFETCH_DISTANCE / posts.length;
  }, [posts.length]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScreenHeader />
      <View style={styles.feedArea}>
        <FlatList
          ref={flatListRef}
          data={posts}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <PostCard post={item} onPress={() => setSelectedPost(item)} />
          )}
          ListEmptyComponent={
            loading ? <ActivityIndicator color={Colors.accent} style={{ marginTop: 40 }} /> : null
          }
          ListFooterComponent={
            <View style={{ paddingVertical: 20, paddingBottom: 100 }}>
              {loadingMore && <ActivityIndicator color={Colors.accent} />}
            </View>
          }
          contentContainerStyle={styles.list}
          onEndReached={onEndReached}
          onEndReachedThreshold={endReachedThreshold}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.accent} />}
          viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
        />
        {selectedPost && (
          <PostDetail post={selectedPost} onClose={() => setSelectedPost(null)} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  feedArea: { flex: 1 },
  list: { paddingTop: 8 },
});
