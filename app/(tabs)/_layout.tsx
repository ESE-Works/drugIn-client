import { Tabs } from 'expo-router';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '@/constants/colors';
import Header from '@/components/layout/Header';

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        header: () => <Header />,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: colors.bg.base,
          borderTopWidth: 1,
          borderTopColor: colors.border.default,
          paddingBottom: insets.bottom + 8,
          paddingTop: 15,
          height: 85,
          elevation: 0,
          shadowOpacity: 0,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: '홈',
          tabBarIcon: ({ focused }) => (
            <View style={[styles.iconContainer, focused && styles.activeBackground]}>
              <Ionicons
                name="home-outline"
                size={22}
                color={focused ? colors.text.brand : colors.text.secondary}
              />
              <Text
                style={[
                  styles.iconText,
                  { color: focused ? colors.text.brand : colors.text.secondary },
                ]}
              >
                홈
              </Text>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="analysis"
        options={{
          title: '분석',
          tabBarIcon: ({ focused }) => (
            <View style={[styles.iconContainer, focused && styles.activeBackground]}>
              <Ionicons
                name="clipboard-outline"
                size={22}
                color={focused ? colors.text.brand : colors.text.secondary}
              />
              <Text
                style={[
                  styles.iconText,
                  { color: focused ? colors.text.brand : colors.text.secondary },
                ]}
              >
                분석
              </Text>
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    borderRadius: 12,
    width: 73,
    height: 52,
  },
  activeBackground: {
    backgroundColor: colors.brand.primaryGhost,
  },
  iconText: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 4,
  },
});
