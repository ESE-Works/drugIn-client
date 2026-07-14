// app/policy/[id].tsx
import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const APP_NAME = '청출어람';

const POLICY_CONTENT: Record<string, { title: string; content: string }> = {
  privacy: {
    title: '개인정보 수집·이용 동의',
    content: `${APP_NAME}은(는) 서비스 제공을 위해 아래와 같이 개인정보를 수집 및 이용합니다.

1. 수집하는 개인정보 항목
- 필수: 이메일, 닉네임, 프로필 사진, 소셜 로그인 식별자(카카오/구글 고유 ID)
- 자동 수집: 접속 로그, 기기 정보(OS·모델명), 서비스 이용기록, 앱 푸시 토큰

2. 수집 및 이용 목적
- 회원 가입 의사 확인 및 본인 확인
- 서비스 제공(복약 알림, 처방전 관리 등)
- 서비스 부정 이용 방지 및 이용 통계 분석

3. 보유 및 이용 기간
- 회원 탈퇴 시까지 (단, 관계 법령에 따라 별도 보존이 필요한 경우 해당 기간 동안 보관)
- 예: 전자상거래법에 따른 계약·결제 기록 5년, 통신비밀보호법에 따른 로그 기록 3개월

4. 동의 거부 권리 및 불이익
- 이용자는 위 개인정보 수집·이용에 대한 동의를 거부할 권리가 있습니다.
- 다만 필수 항목에 대한 동의를 거부하실 경우 회원가입 및 서비스 이용이 제한될 수 있습니다.`,
  },
  uniqueId: {
    title: '고유식별정보 처리 동의',
    content: `${APP_NAME}은(는) 관계 법령에 따라 본인 인증이 필요한 서비스(처방전 분석 등) 제공을 위해 아래와 같이 고유식별정보를 처리합니다.

1. 처리 목적
- 서비스 이용자에 대한 실명 확인 및 본인 인증

2. 처리 항목
- 이름, 생년월일, 성별, 내외국인 정보, 연계정보(CI/DI) 등
※ 실제 처리 방식(예: PASS 본인인증, 통신사 인증 등)에 맞춰 수정 필요

3. 보유 및 이용 기간
- 인증 목적 달성 후 지체 없이 파기
- 단, 관계 법령에 의무 보존 기간이 명시된 경우 해당 기간 동안 보관

4. 동의 거부 권리 및 불이익
- 이용자는 고유식별정보 처리에 대한 동의를 거부할 권리가 있습니다.
- 동의 거부 시 본인 인증이 필요한 일부 서비스(처방전 분석 등) 이용이 제한될 수 있습니다.`,
  },
  thirdParty: {
    title: '제3자 제공 및 처리 위탁 동의',
    content: `${APP_NAME}은(는) 원활한 서비스 제공을 위해 아래와 같이 개인정보를 제3자에게 제공하거나 처리를 위탁하고 있습니다.

[제3자 제공]
- 제공받는 자: 카카오(주), Google LLC
- 제공 항목: 이메일, 소셜 로그인 식별자
- 제공 목적: 소셜 로그인 인증
- 보유 및 이용 기간: 회원 탈퇴 시까지

[처리 위탁]
- 수탁업체: Amazon Web Services(AWS)
- 위탁 업무: 서버 인프라 운영 및 데이터 보관
- 수탁업체: Firebase(Google)
- 위탁 업무: 푸시 알림(FCM) 발송

※ 이용자는 제3자 제공 및 처리 위탁에 대한 동의를 거부할 권리가 있으나, 소셜 로그인 기반 서비스 특성상 동의 거부 시 서비스 이용이 제한될 수 있습니다.`,
  },
  marketing: {
    title: '마케팅 정보 수신 동의',
    content: `${APP_NAME}의 새로운 소식, 이벤트 안내, 혜택 등 다양한 정보를 제공해 드립니다.

1. 수집 및 이용 목적
- 이벤트·프로모션 안내, 신규 서비스 안내

2. 수집 항목
- 이메일, 앱 푸시 토큰

3. 전달 매체
- 앱 푸시 알림, 이메일

4. 보유 및 이용 기간
- 동의 철회 시 또는 회원 탈퇴 시까지

※ 본 동의는 선택 사항이며, 동의하지 않으셔도 기본 서비스 이용에는 제한이 없습니다.
※ 동의 후에도 앱 내 설정에서 언제든지 수신을 거부하실 수 있습니다.`,
  },
};

export default function PolicyDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const policy = POLICY_CONTENT[id as string];

  if (!policy) {
    return (
      <View style={styles.center}>
        <Stack.Screen options={{ headerShown: false }} />
        <Text>잘못된 접근입니다.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="close" size={28} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>약관 상세</Text>
        <View style={{ width: 28 }} />
      </View>
      <ScrollView style={styles.contentContainer} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>{policy.title}</Text>
        <Text style={styles.content}>{policy.content}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  headerTitle: { fontSize: 16, fontWeight: '600', color: '#111827' },
  contentContainer: { flex: 1 },
  scrollContent: { padding: 24, paddingBottom: 60 },
  title: { fontSize: 20, fontWeight: '700', color: '#1F2937', marginBottom: 20 },
  content: { fontSize: 14, color: '#4B5563', lineHeight: 24 },
});
