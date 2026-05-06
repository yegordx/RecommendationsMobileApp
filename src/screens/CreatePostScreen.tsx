import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Alert,
  ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScreenHeader } from '../components/ScreenHeader';
import { createPost } from '../api/posts';
import { searchUserTags } from '../api/tags';
import { Colors } from '../constants/colors';
import { useLanguage } from '../store/LanguageContext';

export function CreatePostScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { t } = useLanguage();
  const [body, setBody] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [suggestions, setSuggestions] = useState<{ id: number; name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchSuggestions = useCallback((q: string) => {
    if (searchTimer.current) clearTimeout(searchTimer.current);
    if (!q.trim()) { setSuggestions([]); return; }
    searchTimer.current = setTimeout(async () => {
      try {
        const results = await searchUserTags(q.trim());
        setSuggestions(results.filter((r) => !tags.includes(r.name)));
      } catch {
        setSuggestions([]);
      }
    }, 250);
  }, [tags]);

  useEffect(() => {
    fetchSuggestions(tagInput);
  }, [tagInput, fetchSuggestions]);

  function addTag(name: string) {
    const normalized = name.trim().toLowerCase().replace(/^#+/, '');
    if (!normalized || tags.includes(normalized) || tags.length >= 10) return;
    setTags((prev) => [...prev, normalized]);
    setTagInput('');
    setSuggestions([]);
  }

  function removeTag(name: string) {
    setTags((prev) => prev.filter((t) => t !== name));
  }

  function handleTagInputChange(text: string) {
    if (text.endsWith(',') || text.endsWith(' ')) {
      addTag(text.slice(0, -1));
    } else {
      setTagInput(text);
    }
  }

  async function handlePublish() {
    if (!body.trim()) return;
    setLoading(true);
    try {
      await createPost(body.trim(), tags.length > 0 ? tags : undefined);
      setBody('');
      setTags([]);
      setTagInput('');
      navigation.navigate('Feed');
    } catch (e: any) {
      Alert.alert(t.errorTitle, e.message || t.publishFailed);
    } finally {
      setLoading(false);
    }
  }

  const canPublish = body.trim().length > 0 && !loading;

  return (
    <KeyboardAvoidingView
      style={[styles.container, { paddingTop: insets.top }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScreenHeader />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <TextInput
          style={styles.bodyInput}
          placeholder={t.postPlaceholder}
          placeholderTextColor={Colors.secondaryText}
          value={body}
          onChangeText={setBody}
          multiline
          textAlignVertical="top"
        />

        <View style={styles.tagCard}>
          <Text style={styles.tagLabel}>{t.tagsLabel}</Text>

          <View style={styles.tagInputRow}>
            <TextInput
              style={styles.tagInput}
              placeholder={t.addTagPlaceholder}
              placeholderTextColor={Colors.secondaryText}
              value={tagInput}
              onChangeText={handleTagInputChange}
              onSubmitEditing={() => addTag(tagInput)}
              returnKeyType="done"
              autoCapitalize="none"
              autoCorrect={false}
              blurOnSubmit={false}
            />
            {tagInput.trim().length > 0 && (
              <TouchableOpacity style={styles.addTagBtn} onPress={() => addTag(tagInput)}>
                <Text style={styles.addTagBtnText}>+</Text>
              </TouchableOpacity>
            )}
          </View>

          {suggestions.length > 0 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.suggestionsRow}
              keyboardShouldPersistTaps="always"
            >
              {suggestions.map((s) => (
                <TouchableOpacity
                  key={s.id}
                  style={styles.suggestionChip}
                  onPress={() => addTag(s.name)}
                >
                  <Text style={styles.suggestionText}>#{s.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}

          {tags.length > 0 && (
            <View style={styles.selectedTagsRow}>
              {tags.map((t) => (
                <TouchableOpacity key={t} style={styles.selectedTag} onPress={() => removeTag(t)}>
                  <Text style={styles.selectedTagText}>#{t}</Text>
                  <Text style={styles.selectedTagRemove}> ×</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <TouchableOpacity
          style={[styles.publishBtn, !canPublish && styles.publishBtnDisabled]}
          onPress={handlePublish}
          disabled={!canPublish}
        >
          {loading
            ? <ActivityIndicator color={Colors.background} />
            : <Text style={styles.publishBtnText}>{t.publish}</Text>}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1 },
  content: {
    padding: 16,
    gap: 12,
    paddingBottom: 120,
  },

  bodyInput: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    color: Colors.white,
    fontSize: 16,
    lineHeight: 22,
    minHeight: 140,
    textAlignVertical: 'top',
  },

  tagCard: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    gap: 10,
  },
  tagLabel: {
    color: Colors.secondaryText,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.8,
  },
  tagInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tagInput: {
    flex: 1,
    color: Colors.white,
    fontSize: 15,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: Colors.background,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  addTagBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addTagBtnText: {
    color: Colors.white,
    fontSize: 22,
    lineHeight: 26,
  },
  suggestionsRow: {
    flexGrow: 0,
  },
  suggestionChip: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.accent,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginRight: 8,
  },
  suggestionText: {
    color: Colors.accent,
    fontSize: 13,
  },
  selectedTagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  selectedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  selectedTagText: {
    color: Colors.white,
    fontSize: 13,
  },
  selectedTagRemove: {
    color: Colors.secondaryText,
    fontSize: 15,
  },

  publishBtn: {
    backgroundColor: Colors.white,
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 4,
  },
  publishBtnDisabled: {
    opacity: 0.4,
  },
  publishBtnText: { color: Colors.background, fontWeight: '600', fontSize: 16 },
});
