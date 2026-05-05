import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ScreenHeader } from '../components/ScreenHeader';
import { PostCard } from '../components/PostCard';
import { getPosts } from '../api/posts';
import { PostResponse } from '../constants/types';
import { Colors } from '../constants/colors';
import { useAuth } from '../store/AuthContext';

export function ProfileScreen() {
  const { user, signOut } = useAuth();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [posts, setPosts] = useState<PostResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    getPosts(1, 100)
      .then((data) => setPosts(data.filter((p) => p.ownerId === user.userId)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  const header = (
    <View style={styles.profileHeader}>
      <View style={styles.avatarWrap}>
        <LinearGradient
          colors={['#7B68EE', '#4A90E2']}
          style={styles.avatarGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.avatarIcon}>👤</Text>
        </LinearGradient>
      </View>

      <Text style={styles.username}>@{user?.name ?? 'user'}</Text>
      <Text style={styles.bio}>«Дослідник, творець і любитель кави»</Text>

      <View style={styles.statsRow}>
        {[
          { label: 'пости', value: String(posts.length) },
          { label: 'підписники', value: '1.2K' },
          { label: 'підписки', value: '130' },
        ].map((s) => (
          <View key={s.label} style={styles.statItem}>
            <Text style={styles.statNum}>{s.value}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.editBtn}>
        <Text style={styles.editBtnText}>Редагувати профіль</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.analyticsBtn}
        onPress={() => (navigation as any).navigate('Analytics')}
      >
        <Text style={styles.analyticsBtnText}>📊  Аналітика акаунту</Text>
        <Text style={styles.analyticsArrow}>→</Text>
      </TouchableOpacity>

      <Text style={styles.sectionLabel}>ВАШІ ЗАПИСИ</Text>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScreenHeader onSignOut={signOut} />
      {loading
        ? <ActivityIndicator color={Colors.accent} style={{ marginTop: 40 }} />
        : (
          <FlatList
            data={posts}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => <PostCard post={item} />}
            ListHeaderComponent={header}
            ListFooterComponent={<View style={{ height: 100 }} />}
          />
        )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  profileHeader: { alignItems: 'center', paddingHorizontal: 16, paddingTop: 12 },
  avatarWrap: { marginBottom: 12 },
  avatarGradient: {
    width: 88,
    height: 88,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarIcon: { fontSize: 40 },
  username: { color: Colors.white, fontWeight: '700', fontSize: 18, marginBottom: 4 },
  bio: { color: Colors.secondaryText, fontStyle: 'italic', fontSize: 13, textAlign: 'center', marginBottom: 16 },
  statsRow: { flexDirection: 'row', gap: 32, marginBottom: 20 },
  statItem: { alignItems: 'center' },
  statNum: { color: Colors.white, fontWeight: '700', fontSize: 18 },
  statLabel: { color: Colors.secondaryText, fontSize: 12 },
  editBtn: {
    backgroundColor: Colors.white,
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 24,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  editBtnText: { color: Colors.background, fontWeight: '600', fontSize: 15 },
  analyticsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.card,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    width: '100%',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  analyticsBtnText: { color: Colors.white, fontSize: 15 },
  analyticsArrow: { color: Colors.accent, fontSize: 18 },
  sectionLabel: {
    fontSize: 11,
    color: Colors.secondaryText,
    letterSpacing: 0.8,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
});
