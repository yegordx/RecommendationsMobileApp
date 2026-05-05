import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Alert,
  ActivityIndicator, KeyboardAvoidingView, Platform, Keyboard, Modal, Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScreenHeader } from '../components/ScreenHeader';
import { createPost } from '../api/posts';
import { Colors } from '../constants/colors';

export function CreatePostScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const [body, setBody] = useState('');
  const [composerOpen, setComposerOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  function openComposer() {
    setComposerOpen(true);
  }

  function closeComposer() {
    Keyboard.dismiss();
    setComposerOpen(false);
  }

  async function handlePublish() {
    if (!body.trim()) return;
    Keyboard.dismiss();
    setLoading(true);
    try {
      await createPost(body.trim());
      setBody('');
      setComposerOpen(false);
      navigation.navigate('Feed');
    } catch (e: any) {
      Alert.alert('Помилка', e.message || 'Не вдалося опублікувати');
    } finally {
      setLoading(false);
    }
  }

  const canPublish = body.trim().length > 0 && !loading;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScreenHeader />

      <View style={styles.content}>
        <Pressable style={styles.fakeInput} onPress={openComposer}>
          <Text style={[styles.fakeText, !body && styles.fakeTextEmpty]}>
            {body || 'Що у вас нового?'}
          </Text>
        </Pressable>

        <TouchableOpacity
          style={[styles.publishBtn, !canPublish && styles.publishBtnDisabled]}
          onPress={handlePublish}
          disabled={!canPublish}
        >
          {loading
            ? <ActivityIndicator color={Colors.background} />
            : <Text style={styles.publishBtnText}>Опублікувати</Text>}
        </TouchableOpacity>
      </View>

      <Modal
        visible={composerOpen}
        animationType="slide"
        onRequestClose={closeComposer}
        presentationStyle="overFullScreen"
        transparent
      >
        <KeyboardAvoidingView
          style={styles.modalContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={[styles.modalHeader, { paddingTop: insets.top + 8 }]}>
            <TouchableOpacity onPress={closeComposer} style={styles.modalCloseBtn}>
              <Text style={styles.modalClose}>Скасувати</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Новий пост</Text>
            <TouchableOpacity
              onPress={handlePublish}
              disabled={!canPublish}
              style={styles.modalCloseBtn}
            >
              <Text style={[styles.modalPublish, !canPublish && styles.modalPublishDisabled]}>
                {loading ? '...' : 'Опублікувати'}
              </Text>
            </TouchableOpacity>
          </View>

          <TextInput
            style={styles.modalTextarea}
            placeholder="Що у вас нового?"
            placeholderTextColor={Colors.secondaryText}
            value={body}
            onChangeText={setBody}
            multiline
            textAlignVertical="top"
            autoFocus
          />
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { flex: 1, padding: 16, gap: 12 },
  fakeInput: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    minHeight: 120,
  },
  fakeText: {
    color: Colors.white,
    fontSize: 16,
    lineHeight: 22,
  },
  fakeTextEmpty: {
    color: Colors.secondaryText,
  },
  publishBtn: {
    backgroundColor: Colors.white,
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 100,
  },
  publishBtnDisabled: {
    opacity: 0.4,
  },
  publishBtnText: { color: Colors.background, fontWeight: '600', fontSize: 16 },

  modalContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
  },
  modalCloseBtn: {
    minWidth: 80,
  },
  modalClose: {
    color: Colors.secondaryText,
    fontSize: 15,
  },
  modalTitle: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  modalPublish: {
    color: Colors.accent,
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'right',
  },
  modalPublishDisabled: {
    opacity: 0.4,
  },
  modalTextarea: {
    flex: 1,
    color: Colors.white,
    fontSize: 17,
    lineHeight: 24,
    padding: 16,
  },
});
