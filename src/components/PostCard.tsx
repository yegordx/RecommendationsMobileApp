import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Pressable } from 'react-native';
import { PostResponse } from '../constants/types';
import { Avatar } from './Avatar';
import { Colors } from '../constants/colors';
import { postInteraction } from '../api/interactions';

type Props = {
  post: PostResponse;
  onPress?: () => void;
};

function timeAgo(iso: string): string {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 3600) return `${Math.floor(diff / 60)} хв тому`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} год тому`;
  return `${Math.floor(diff / 86400)} дн тому`;
}

function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return String(n);
}

export function PostCard({ post, onPress }: Props) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(Math.floor(Math.random() * 2000));
  const commentCount = Math.floor(Math.random() * 500);

  async function handleLike() {
    const next = !liked;
    setLiked(next);
    setLikeCount((c) => c + (next ? 1 : -1));
    try {
      await postInteraction(post.id, next ? 3 : 4);
    } catch {}
  }

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && onPress ? styles.cardPressed : null]}
    >
      <View style={styles.header}>
        <View style={styles.userRow}>
          <Avatar name={post.ownerName} size={36} borderRadius={10} />
          <Text style={styles.username}>@{post.ownerName}</Text>
        </View>
        <Text style={styles.time}>{timeAgo(post.createdAt)}</Text>
      </View>

      <Text style={styles.body}>{post.body}</Text>

      {post.userTags?.length > 0 && (
        <View style={styles.userTagsBlock}>
          <View style={styles.tagsRow}>
            {post.userTags.map((t) => (
              <Text key={t.id} style={styles.userTag}>#{t.name}</Text>
            ))}
          </View>
        </View>
      )}

      <View style={styles.actions}>
        <TouchableOpacity onPress={handleLike} style={styles.action}>
          <Text style={[styles.actionIcon, liked && styles.likedIcon]}>{liked ? '♥' : '♡'}</Text>
          <Text style={styles.actionCount}>{formatCount(likeCount)}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.action}>
          <Image
            source={require('../../assets/comment.png')}
            style={styles.commentIcon}
            resizeMode="contain"
          />
          <Text style={styles.actionCount}>{formatCount(commentCount)}</Text>
        </TouchableOpacity>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 14,
    marginHorizontal: 16,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    gap: 10,
  },
  cardPressed: {
    opacity: 0.7,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  username: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: 14,
  },
  time: {
    color: Colors.secondaryText,
    fontSize: 12,
  },
  body: {
    color: Colors.white,
    fontSize: 15,
    lineHeight: 22,
  },
  userTagsBlock: {
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#444444',
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  userTag: {
    color: Colors.white,
    fontSize: 13,
  },
  actions: {
    flexDirection: 'row',
    gap: 20,
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  actionIcon: {
    fontSize: 18,
    color: Colors.secondaryText,
  },
  likedIcon: {
    color: '#e05252',
  },
  commentIcon: {
    width: 18,
    height: 18,
    tintColor: Colors.secondaryText,
  },
  actionCount: {
    color: Colors.secondaryText,
    fontSize: 13,
  },
});
