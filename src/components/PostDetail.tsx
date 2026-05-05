import React, { useEffect, useRef } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  Dimensions, Animated, PanResponder,
} from 'react-native';
import { PostResponse } from '../constants/types';
import { Avatar } from './Avatar';
import { Colors } from '../constants/colors';
import { useTabSwipe } from '../store/TabSwipeContext';

type Props = {
  post: PostResponse;
  onClose: () => void;
};

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_CLOSE_THRESHOLD = 80;
const VELOCITY_CLOSE_THRESHOLD = 0.5;
const HORIZONTAL_ACTIVATION = 10;

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString('uk-UA', {
    day: '2-digit',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function PostDetail({ post, onClose }: Props) {
  const translateX = useRef(new Animated.Value(SCREEN_WIDTH)).current;
  const { setSwipeEnabled } = useTabSwipe();

  useEffect(() => {
    Animated.timing(translateX, {
      toValue: 0,
      duration: 220,
      useNativeDriver: true,
    }).start();
  }, [post.id, translateX]);

  useEffect(() => {
    setSwipeEnabled(false);
    return () => setSwipeEnabled(true);
  }, [setSwipeEnabled]);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_evt, gesture) =>
        gesture.dx > HORIZONTAL_ACTIVATION && Math.abs(gesture.dx) > Math.abs(gesture.dy),
      onPanResponderMove: (_evt, gesture) => {
        if (gesture.dx > 0) translateX.setValue(gesture.dx);
      },
      onPanResponderRelease: (_evt, gesture) => {
        const shouldClose =
          gesture.dx > SWIPE_CLOSE_THRESHOLD || gesture.vx > VELOCITY_CLOSE_THRESHOLD;
        if (shouldClose) {
          Animated.timing(translateX, {
            toValue: SCREEN_WIDTH,
            duration: 200,
            useNativeDriver: true,
          }).start(({ finished }) => {
            if (finished) onClose();
          });
        } else {
          Animated.spring(translateX, {
            toValue: 0,
            damping: 20,
            stiffness: 180,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  return (
    <Animated.View
      style={[styles.container, { transform: [{ translateX }] }]}
      {...panResponder.panHandlers}
    >
      <View style={styles.topRow}>
        <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.topTitle}>Публікація</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        <View style={styles.userRow}>
          <Avatar name={post.ownerName} size={44} borderRadius={12} />
          <View style={{ flex: 1 }}>
            <Text style={styles.username}>@{post.ownerName}</Text>
            <Text style={styles.time}>{formatDate(post.createdAt)}</Text>
          </View>
        </View>

        <Text style={styles.text}>{post.body}</Text>

        {post.clusterTags.length > 0 && (
          <View style={styles.tagsRow}>
            {post.clusterTags.map((t) => (
              <Text key={t.id} style={styles.tag}>#{t.name}</Text>
            ))}
          </View>
        )}
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.background,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
  },
  closeBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    color: Colors.white,
    fontSize: 22,
    lineHeight: 24,
  },
  topTitle: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  body: {
    padding: 16,
    gap: 16,
    paddingBottom: 120,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  username: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: 16,
  },
  time: {
    color: Colors.secondaryText,
    fontSize: 13,
    marginTop: 2,
  },
  text: {
    color: Colors.white,
    fontSize: 17,
    lineHeight: 26,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    color: Colors.accent,
    fontSize: 14,
  },
});
