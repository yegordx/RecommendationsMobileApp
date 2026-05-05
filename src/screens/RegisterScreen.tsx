import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, Image, Alert, ActivityIndicator,
} from 'react-native';
import { useAuth } from '../store/AuthContext';
import { register } from '../api/auth';
import { getKeyTags } from '../api/tags';
import { Colors } from '../constants/colors';
import { KeyTag } from '../constants/types';

export function RegisterScreen({ navigation }: any) {
  const { signIn } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [keyTags, setKeyTags] = useState<KeyTag[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getKeyTags().then(setKeyTags).catch(() => {});
  }, []);

  function toggleTag(id: number) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  async function handleRegister() {
    if (!name || !email || !password) return;
    setLoading(true);
    try {
      const user = await register(name.trim(), email.trim(), password, selectedIds);
      await signIn(user);
    } catch (e: any) {
      Alert.alert('Помилка', e.message || 'Не вдалося зареєструватися');
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.logoArea}>
        <Image source={require('../../assets/logo.png')} style={styles.logo} resizeMode="contain" />
        <Text style={styles.appName}>Floo</Text>
      </View>

      <View style={styles.form}>
        <TextInput style={styles.input} placeholder="Ім'я" placeholderTextColor={Colors.secondaryText}
          value={name} onChangeText={setName} />
        <TextInput style={styles.input} placeholder="Email" placeholderTextColor={Colors.secondaryText}
          value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
        <TextInput style={styles.input} placeholder="Пароль" placeholderTextColor={Colors.secondaryText}
          value={password} onChangeText={setPassword} secureTextEntry />
      </View>

      {keyTags.length > 0 && (
        <View style={styles.tagsSection}>
          <Text style={styles.sectionLabel}>ІНТЕРЕСИ</Text>
          <View style={styles.tagsWrap}>
            {keyTags.map((tag) => {
              const active = selectedIds.includes(tag.id);
              return (
                <TouchableOpacity
                  key={tag.id}
                  style={[styles.chip, active && styles.chipActive]}
                  onPress={() => toggleTag(tag.id)}
                >
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>{tag.name}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      )}

      <TouchableOpacity style={styles.primaryBtn} onPress={handleRegister} disabled={loading}>
        {loading
          ? <ActivityIndicator color={Colors.background} />
          : <Text style={styles.primaryBtnText}>Зареєструватися</Text>}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.linkBtn}>
        <Text style={styles.linkText}>Вже є акаунт? Увійти</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { paddingHorizontal: 24, paddingTop: 60, paddingBottom: 40, gap: 16 },
  logoArea: { alignItems: 'center', marginBottom: 24 },
  logo: { width: 80, height: 80, marginBottom: 10 },
  appName: { fontSize: 28, fontWeight: 'bold', color: Colors.white },
  form: { gap: 12 },
  input: {
    backgroundColor: Colors.inputBg,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: Colors.white,
    fontSize: 16,
  },
  tagsSection: { gap: 10 },
  sectionLabel: { fontSize: 11, color: Colors.secondaryText, letterSpacing: 0.8 },
  tagsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  chipActive: { backgroundColor: Colors.accent, borderColor: Colors.accent },
  chipText: { color: Colors.secondaryText, fontSize: 14 },
  chipTextActive: { color: Colors.white, fontWeight: '600' },
  primaryBtn: {
    backgroundColor: Colors.white,
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 4,
  },
  primaryBtnText: { color: Colors.background, fontSize: 16, fontWeight: '600' },
  linkBtn: { alignItems: 'center' },
  linkText: { color: Colors.secondaryText, fontSize: 14 },
});
