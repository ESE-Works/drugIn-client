import React, { type ReactNode } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  type ViewStyle,
  type TextStyle,
} from 'react-native';
import { colors } from '@/constants/colors';

interface ListItemProps {
  title: string;
  description?: string; // 분석 화면처럼 아래에 작은 글씨가 들어갈 때 사용
  leftContent?: ReactNode; // 왼쪽 아이콘이나 뱃지를 넣을 공간
  rightContent?: ReactNode; // 오른쪽 숫자나 화살표를 넣을 공간
  onPress?: () => void; // 클릭 이벤트 (마이페이지 메뉴 이동 등)
  hasDivider?: boolean; // 리스트 사이에 얇은 선이 필요한지 여부
  style?: ViewStyle; // 필요시 추가 마진 등을 주기 위한 커스텀 스타일
  titleStyle?: TextStyle;
}

export default function ListItem({
  title,
  description,
  leftContent,
  rightContent,
  onPress,
  hasDivider = false,
  style,
  titleStyle,
}: ListItemProps) {
  const Container = onPress ? TouchableOpacity : View;

  return (
    <Container
      activeOpacity={0.7}
      onPress={onPress}
      style={[styles.container, hasDivider && styles.divider, style]}
    >
      {leftContent && <View style={styles.leftSection}>{leftContent}</View>}

      <View style={styles.textSection}>
        <Text style={[styles.title, titleStyle]}>{title}</Text>
        {description && <Text style={styles.description}>{description}</Text>}
      </View>

      {rightContent && <View style={styles.rightSection}>{rightContent}</View>}
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: colors.bg.base,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border.subtle,
  },
  leftSection: {
    marginRight: 12,
  },
  textSection: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  description: {
    fontSize: 13,
    color: colors.text.secondary,
    marginTop: 4,
  },
  rightSection: {
    marginLeft: 12,
  },
});
