import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Image,
  Modal, Pressable, Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../constants/colors';
import { useLanguage } from '../store/LanguageContext';

type Props = {
  onSignOut?: () => void;
};

export function ScreenHeader({ onSignOut }: Props) {
  const navigation = useNavigation<any>();
  const [menuOpen, setMenuOpen] = useState(false);
  const { language, t, toggleLanguage } = useLanguage();

  function goHome() {
    navigation.navigate('Feed');
  }

  function handleProfileSettings() {
    setMenuOpen(false);
    Alert.alert(t.comingSoon, t.profileSettingsSoon);
  }

  function handleSignOut() {
    setMenuOpen(false);
    onSignOut?.();
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Floo</Text>
      <View style={styles.icons}>
        <TouchableOpacity onPress={toggleLanguage} style={styles.langBtn} activeOpacity={0.7}>
          <Text style={styles.langText}>{language === 'ua' ? 'EN' : 'UA'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={goHome} style={styles.logoBtn} activeOpacity={0.7}>
          <Image
            source={require('../../assets/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </TouchableOpacity>
        {onSignOut && (
          <TouchableOpacity onPress={() => setMenuOpen(true)} style={styles.iconBtn} activeOpacity={0.7}>
            <Image
              source={require('../../assets/setting.png')}
              style={styles.gearIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
      </View>

      <Modal
        visible={menuOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuOpen(false)}
      >
        <Pressable style={styles.backdrop} onPress={() => setMenuOpen(false)}>
          <Pressable style={styles.menu} onPress={() => {}}>
            <TouchableOpacity style={styles.menuItem} onPress={handleProfileSettings}>
              <Text style={styles.menuItemText}>{t.profileSettings}</Text>
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity style={styles.menuItem} onPress={handleSignOut}>
              <Text style={[styles.menuItemText, styles.dangerText]}>{t.signOut}</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    backgroundColor: Colors.background,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.white,
  },
  icons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  langBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    backgroundColor: Colors.card,
  },
  langText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  logoBtn: {
    padding: 4,
  },
  logo: {
    width: 32,
    height: 32,
  },
  iconBtn: {
    padding: 4,
  },
  gearIcon: {
    width: 24,
    height: 24,
    tintColor: Colors.white,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 70,
    paddingRight: 16,
  },
  menu: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    minWidth: 200,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    overflow: 'hidden',
  },
  menuItem: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  menuItemText: {
    color: Colors.white,
    fontSize: 15,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.cardBorder,
  },
  dangerText: {
    color: Colors.danger,
  },
});
