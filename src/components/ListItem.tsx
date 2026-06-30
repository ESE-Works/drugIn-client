import React, { type ReactNode } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  type ViewStyle,
  type TextStyle,
} from 'react-native';
import { colors } from '@/constants/colors'; // 경로 별칭(@)을 쓴다면 이렇게! (안 쓰면 ../constants/colors)

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
      {/* 1. 왼쪽 영역 (아이콘, 뱃지 등) */}
      {leftContent && <View style={styles.leftSection}>{leftContent}</View>}

      {/* 2. 중앙 텍스트 영역 (flex: 1을 줘서 남은 공간을 꽉 채우게 함) */}
      <View style={styles.textSection}>
        <Text style={[styles.title, titleStyle]}>{title}</Text>
        {description && <Text style={styles.description}>{description}</Text>}
      </View>

      {/* 3. 오른쪽 영역 (숫자, 화살표 등) */}
      {rightContent && <View style={styles.rightSection}>{rightContent}</View>}
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center', // 세로 중앙 정렬
    paddingVertical: 16, // 위아래 여백 (디자인에 맞게 조절해!)
    paddingHorizontal: 20,
    backgroundColor: colors.bg.base,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border.subtle, // 연한 회색 선
  },
  leftSection: {
    marginRight: 12, // 텍스트와의 간격
  },
  textSection: {
    flex: 1, // 남는 가로 공간을 모두 차지하도록!
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
    marginTop: 4, // 제목과 설명 사이 간격
  },
  rightSection: {
    marginLeft: 12,
  },
});
