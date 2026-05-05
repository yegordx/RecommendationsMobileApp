import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const PALETTE = ['#4A90E2', '#7B68EE', '#E2844A', '#4AE2A0', '#E24A6B', '#E2C94A'];

function colorForName(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return PALETTE[Math.abs(hash) % PALETTE.length];
}

type Props = {
  name: string;
  size?: number;
  borderRadius?: number;
};

export function Avatar({ name, size = 36, borderRadius = 10 }: Props) {
  const letter = name ? name[0].toUpperCase() : '?';
  const bg = colorForName(name);
  return (
    <View style={[styles.avatar, { width: size, height: size, borderRadius, backgroundColor: bg }]}>
      <Text style={[styles.letter, { fontSize: size * 0.44 }]}>{letter}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: { alignItems: 'center', justifyContent: 'center' },
  letter: { color: '#fff', fontWeight: '700' },
});
