import React from 'react';
import { View, TouchableOpacity, Image, StyleSheet, ImageSourcePropType } from 'react-native';
import { MaterialTopTabBarProps } from '@react-navigation/material-top-tabs';
import { Colors } from '../constants/colors';

const ICONS: Record<string, ImageSourcePropType> = {
  Feed: require('../../assets/app.png'),
  Search: require('../../assets/search.png'),
  Create: require('../../assets/plus.png'),
  Profile: require('../../assets/person.png'),
};

export function CustomTabBar({ state, navigation }: MaterialTopTabBarProps) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.bar}>
        {state.routes.map((route, index) => {
          const focused = state.index === index;
          const icon = ICONS[route.name];

          const onPress = () => {
            if (focused) {
              navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true } as any);
            } else {
              navigation.navigate(route.name);
            }
          };

          return (
            <TouchableOpacity key={route.key} onPress={onPress} style={styles.tab} activeOpacity={0.7}>
              <View style={[styles.pill, focused && styles.pillActive]}>
                {icon && (
                  <Image
                    source={icon}
                    style={[styles.icon, { tintColor: focused ? '#1a1a1a' : Colors.secondaryText }]}
                    resizeMode="contain"
                  />
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    alignItems: 'center',
  },
  bar: {
    flexDirection: 'row',
    backgroundColor: Colors.navBar,
    borderRadius: 28,
    paddingVertical: 8,
    paddingHorizontal: 8,
    gap: 4,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
  },
  pill: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 48,
  },
  pillActive: {
    backgroundColor: Colors.white,
  },
  icon: {
    width: 22,
    height: 22,
  },
});
