import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScreenHeader } from '../components/ScreenHeader';
import { getClusterTags } from '../api/tags';
import { ClusterTag } from '../constants/types';
import { Colors } from '../constants/colors';

export function SearchScreen() {
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const [tags, setTags] = useState<ClusterTag[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getClusterTags().then(setTags).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const filtered = query.trim()
    ? tags.filter((t) => t.name.toLowerCase().includes(query.toLowerCase()))
    : tags;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScreenHeader />

      <View style={styles.searchWrapper}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.input}
          placeholder="Пошук за контентом..."
          placeholderTextColor={Colors.secondaryText}
          value={query}
          onChangeText={setQuery}
        />
      </View>

      <Text style={styles.sectionLabel}>ПОПУЛЯРНІ ТЕМИ</Text>

      {loading
        ? <ActivityIndicator color={Colors.accent} style={{ marginTop: 20 }} />
        : (
          <FlatList
            data={filtered}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.row}>
                <Text style={styles.tagName}>#{item.name}</Text>
                <Text style={styles.arrow}>↗</Text>
              </TouchableOpacity>
            )}
            ListFooterComponent={<View style={{ height: 100 }} />}
            contentContainerStyle={styles.list}
          />
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
});
