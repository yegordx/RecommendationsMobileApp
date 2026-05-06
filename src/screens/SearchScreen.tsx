import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View, Text, TextInput, FlatList, TouchableOpacity, Pressable,
  StyleSheet, ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScreenHeader } from '../components/ScreenHeader';
import { PostCard } from '../components/PostCard';
import { PostDetail } from '../components/PostDetail';
import { getClusterTags } from '../api/tags';
import { searchPosts, trackSearch } from '../api/posts';
import { ClusterTag, PostResponse } from '../constants/types';
import { Colors } from '../constants/colors';
import { useAuth } from '../store/AuthContext';
import { useLanguage } from '../store/LanguageContext';

const DEBOUNCE_MS = 400;

export function SearchScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { t } = useLanguage();
  const [query, setQuery] = useState('');
  const [tags, setTags] = useState<ClusterTag[]>([]);
  const [results, setResults] = useState<PostResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [tagsLoading, setTagsLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<PostResponse | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    getClusterTags().then(setTags).catch(() => {}).finally(() => setTagsLoading(false));
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    const trimmed = query.trim();
    if (!trimmed) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const data = await searchPosts(trimmed);
        setResults(data);
        if (user && data.length > 0) {
          trackSearch(trimmed).catch(() => {});
        }
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, DEBOUNCE_MS);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, user]);

  const isSearching = query.trim().length > 0;

  const renderPost = useCallback(
    ({ item }: { item: PostResponse }) => (
      <PostCard post={item} onPress={() => setSelectedPost(item)} />
    ),
    []
  );

  const renderTag = useCallback(
    ({ item }: { item: ClusterTag }) => (
      <TouchableOpacity style={styles.row} onPress={() => setQuery(item.name)}>
        <Text style={styles.tagName}>#{item.name}</Text>
        <Text style={styles.arrow}>↗</Text>
      </TouchableOpacity>
    ),
    []
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScreenHeader />

      <Pressable style={styles.searchWrapper} onPress={() => inputRef.current?.focus()}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          ref={inputRef}
          style={styles.input}
          placeholder={t.searchPlaceholder}
          placeholderTextColor={Colors.secondaryText}
          value={query}
          onChangeText={setQuery}
          autoCorrect={false}
          returnKeyType="search"
        />
        {isSearching && (
          <TouchableOpacity onPress={() => setQuery('')} style={styles.clearBtn}>
            <Text style={styles.clearText}>✕</Text>
          </TouchableOpacity>
        )}
      </Pressable>

      {isSearching ? (
        <>
          <Text style={styles.sectionLabel}>
            {loading ? t.searching : t.results(results.length)}
          </Text>
          {loading ? (
            <ActivityIndicator color={Colors.accent} style={{ marginTop: 20 }} />
          ) : (
            <FlatList
              data={results}
              keyExtractor={(item) => String(item.id)}
              renderItem={renderPost}
              ListEmptyComponent={<Text style={styles.empty}>{t.nothingFound}</Text>}
              ListFooterComponent={<View style={{ height: 100 }} />}
              contentContainerStyle={results.length === 0 ? styles.emptyContainer : undefined}
            />
          )}
        </>
      ) : (
        <>
          <Text style={styles.sectionLabel}>{t.popularTopics}</Text>
          {tagsLoading ? (
            <ActivityIndicator color={Colors.accent} style={{ marginTop: 20 }} />
          ) : (
            <FlatList
              data={tags}
              keyExtractor={(item) => String(item.id)}
              renderItem={renderTag}
              ListFooterComponent={<View style={{ height: 100 }} />}
              contentContainerStyle={styles.list}
            />
          )}
        </>
      )}

      {selectedPost && (
        <PostDetail post={selectedPost} onClose={() => setSelectedPost(null)} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.inputBg,
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 16,
    paddingHorizontal: 12,
  },
  searchIcon: { fontSize: 16, marginRight: 8 },
  input: {
    flex: 1,
    color: Colors.white,
    fontSize: 15,
    paddingVertical: 12,
  },
  clearBtn: { padding: 4 },
  clearText: { color: Colors.secondaryText, fontSize: 16 },
  sectionLabel: {
    fontSize: 11,
    color: Colors.secondaryText,
    letterSpacing: 0.8,
    marginHorizontal: 16,
    marginBottom: 8,
  },
  list: { paddingHorizontal: 16 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  tagName: { color: Colors.white, fontSize: 15 },
  arrow: { color: Colors.accent, fontSize: 18 },
  empty: {
    color: Colors.secondaryText,
    fontSize: 15,
    textAlign: 'center',
    marginTop: 40,
  },
  emptyContainer: { flex: 1 },
});
