import React, { type ReactNode } from 'react';
import { View, StyleSheet, TouchableOpacity, type ViewStyle } from 'react-native';
import { colors } from '@/constants/colors';

interface CardProps {
  children: ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
}

export default function Card({ children, onPress, style }: CardProps) {
  //   const Container = onPress ? TouchableOpacity : View;

  //   return (
  //     <Container activeOpacity={0.7} onPress={onPress} style={[styles.card, style]}>
  //       {children}
  //     </Container>
  //   );
  if (!onPress) {
    return <View style={[styles.card, style]}>{children}</View>;
  }
  return (
    <TouchableOpacity activeOpacity={0.7} onPress={onPress} style={[styles.card, style]}>
      {children}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.bg.base,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    elevation: 2,
  },
});
