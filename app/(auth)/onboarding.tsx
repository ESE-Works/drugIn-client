import React, { useState, useRef, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import BottomSheet, { BottomSheetFlatList, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '@/constants/colors';
import { useAuthStore } from '@/store/authStore';
import { updateUserProfile } from '@/features/auth/api/userApi';
import { postTermsConsents } from '@/features/auth/api/termsApi';

const REGION_OPTIONS = [
  '서울',
  '경기',
  '인천',
  '부산',
  '대구',
  '광주',
  '대전',
  '울산',
  '제주',
  '세종',
  '경기도',
  '강원도',
  '충청북도',
  '충청남도',
  '전라북도',
  '전라남도',
  '경상북도',
  '경상남도',
];
const AGE_OPTIONS = ['10대', '20대', '30대', '40대', '50대 이상'];
const INCOME_OPTIONS = [
  '3,000만원 미만',
  '3,000만원 - 5,000만원',
  '5,000만원 - 8,000만원',
  '8,000만원 이상',
];
const TERMS = [
  {
    id: 'privacy',
    title: '[필수] 개인정보 수집·이용 동의',
    required: true,
    type: 'PRIVACY_REQUIRED',
    version: '1.0',
  },
  {
    id: 'uniqueId',
    title: '[필수] 고유식별정보 처리 동의',
    required: true,
    type: 'UNIQUE_ID',
    version: '1.0',
  },
  {
    id: 'thirdParty',
    title: '[필수] 제3자 제공 및 처리 위탁 동의',
    required: true,
    type: 'THIRD_PARTY',
    version: '1.0',
  },
  {
    id: 'privacyOptional',
    title: '[선택] 수집·이용 동의',
    required: false,
    type: 'PRIVACY_OPTIONAL',
    version: '1.0',
  },
  {
    id: 'marketing',
    title: '[선택] 마케팅 정보 수신 동의',
    required: false,
    type: 'MARKETING',
    version: '1.0',
  },
] as const;

type TermId = (typeof TERMS)[number]['id'];

export default function OnboardingScreen() {
  const router = useRouter();

  // react-hook-form 이나 전역 상태 고려
  const [region, setRegion] = useState('');
  const [age, setAge] = useState('');
  const [incomeRange, setIncomeRange] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const updateProfile = useAuthStore((state) => state.updateProfile);

  type BottomSheetType = 'region' | 'age' | 'income' | null;
  const [activeSheet, setActiveSheet] = useState<BottomSheetType>(null);

  const bottomSheetRef = useRef<BottomSheet>(null); //바텀 시트 높이 설정
  const snapPoints = useMemo(() => ['50%'], []);

  // --- 약관 동의 상태 관리 ---
  const [agreements, setAgreements] = useState<Record<TermId, boolean>>({
    privacy: false,
    uniqueId: false,
    thirdParty: false,
    privacyOptional: false,
    marketing: false,
  });

  const isAllChecked = TERMS.every((term) => agreements[term.id]);
  const isAllRequiredChecked = TERMS.filter((t) => t.required).every((t) => agreements[t.id]);

  const toggleAll = () => {
    const newValue = !isAllChecked;
    setAgreements({
      privacy: newValue,
      uniqueId: newValue,
      thirdParty: newValue,
      privacyOptional: newValue,
      marketing: newValue,
    });
  };

  const toggleItem = (id: TermId) => {
    setAgreements((prev) => ({ ...prev, [id]: !prev[id] }));
  };
  // -------------------------

  const openBottomSheet = (type: BottomSheetType) => {
    setActiveSheet(type);
    bottomSheetRef.current?.expand();
  };

  const closeBottomSheet = () => {
    bottomSheetRef.current?.close();
    setActiveSheet(null);
  };

  const handleSelect = (item: string) => {
    if (activeSheet === 'region') setRegion(item);
    if (activeSheet === 'age') setAge(item);
    if (activeSheet === 'income') setIncomeRange(item);
    closeBottomSheet();
  };

  const handleSubmit = async () => {
    if (isLoading) return;

    if (!isAllRequiredChecked) {
      Alert.alert('알림', '필수 약관에 모두 동의해 주세요.');
      return;
    }

    try {
      setIsLoading(true);

      const consentsPayload = TERMS.map((term) => ({
        termType: term.type,
        version: term.version,
        agreed: agreements[term.id],
      }));

      const numericAge = parseInt(age.replace(/[^0-9]/g, ''), 10) || 0;
      const profilePayload = {
        region: region,
        age: numericAge,
        income_range: incomeRange,
      };

      console.log(
        '🚀 [전송하는 약관 데이터]:',
        JSON.stringify({ consents: consentsPayload }, null, 2),
      );

      const updatedUser = await updateUserProfile(profilePayload);
      await postTermsConsents(consentsPayload);

      updateProfile({
        region: updatedUser.region,
        age: updatedUser.age,
        income_range: updatedUser.income_range,
      });

      router.replace('/(tabs)');
    } catch (error: any) {
      console.error('온보딩 정보 등록 실패:', error);

      if (error.response) {
        // 서버가 응답을 줬는데 에러인 경우 (400, 500 등)
        console.error('서버 에러 상태 코드:', error.response.status);
        console.error('서버 상세 에러 메시지:', error.response.data);
      } else {
        // 네트워크 문제 등으로 서버에 아예 닿지 못한 경우
        console.error('에러 내용:', error.message);
      }

      Alert.alert(
        '등록 실패',
        '정보를 저장하는 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentOptions = () => {
    switch (activeSheet) {
      case 'region':
        return REGION_OPTIONS;
      case 'age':
        return AGE_OPTIONS;
      case 'income':
        return INCOME_OPTIONS;
      default:
        return [];
    }
  };

  const currentOptions = getCurrentOptions();

  // 바텀 시트 배경(Backdrop) 설정 (바깥 영역 클릭 시 닫히도록)
  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        pressBehavior="close"
      />
    ),
    [],
  );

  return (
    <View style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent} // 패딩은 여기에 적용
        showsVerticalScrollIndicator={false} // 스크롤바 숨기기 (선택사항)
      >
        <View style={styles.header}>
          <Text style={styles.title}>거의 다 왔어요! 🎉</Text>
          <Text style={styles.subtitle}>
            맞춤형 서비스를 위해{'\n'}조금 더 당신에 대해 알려주세요.
          </Text>
        </View>
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>지역</Text>
            <TouchableOpacity
              style={styles.selectBox}
              activeOpacity={0.7}
              onPress={() => openBottomSheet('region')}
            >
              <Text style={region ? styles.inputText : styles.placeholderText}>
                {region || '거주하시는 지역을 선택해 주세요'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>연령대</Text>
            <TouchableOpacity
              style={styles.selectBox}
              activeOpacity={0.7}
              onPress={() => openBottomSheet('age')}
            >
              <Text style={age ? styles.inputText : styles.placeholderText}>
                {age || '연령대를 선택해 주세요'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>소득 구간</Text>
            <TouchableOpacity
              style={styles.selectBox}
              activeOpacity={0.7}
              onPress={() => openBottomSheet('income')}
            >
              <Text style={incomeRange ? styles.inputText : styles.placeholderText}>
                {incomeRange || '소득 구간을 선택해 주세요'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* 약관 동의 섹션 */}
          <View style={styles.termsSection}>
            <TouchableOpacity style={styles.allAgreeRow} onPress={toggleAll} activeOpacity={0.7}>
              <Ionicons
                name={isAllChecked ? 'checkmark-circle' : 'checkmark-circle-outline'}
                size={24}
                color={isAllChecked ? colors.brand.primary : colors.border.default}
              />
              <Text style={styles.allAgreeText}>약관 전체 동의</Text>
            </TouchableOpacity>
            <View style={styles.divider} />

            {TERMS.map((term) => (
              <View key={term.id} style={styles.termRow}>
                <TouchableOpacity
                  style={styles.checkboxContainer}
                  onPress={() => toggleItem(term.id)}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name="checkmark"
                    size={20}
                    color={agreements[term.id] ? colors.brand.primary : colors.border.default}
                  />
                  <Text style={[styles.termText, agreements[term.id] && styles.termTextChecked]}>
                    {term.title}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.push('/policy')}>
                  <Text style={styles.detailText}>보기</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>

          <View style={styles.footer}>
            <TouchableOpacity
              style={[
                styles.submitButton,
                (!region || !age || !incomeRange) && styles.submitButtonDisabled,
              ]}
              activeOpacity={0.8}
              onPress={() => void handleSubmit()}
              disabled={!region || !age || !incomeRange || isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={colors.text.inverse} />
              ) : (
                <Text style={styles.submitButtonText}>시작하기</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        enableDynamicSizing={false}
        backdropComponent={renderBackdrop}
        backgroundStyle={styles.bottomSheetBackground}
      >
        <BottomSheetFlatList
          data={currentOptions}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.bottomSheetItem} onPress={() => handleSelect(item)}>
              <Text style={styles.bottomSheetItemText}>{item}</Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.bottomSheetListContainer}
        />
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.bg.base,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 60, //+ insets.bottom,
    flexGrow: 1,
  },
  header: {
    marginTop: 60,
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text.secondary,
    lineHeight: 24,
  },
  form: {
    gap: 24,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
  },
  selectBox: {
    height: 52,
    borderWidth: 1,
    borderColor: colors.border.default,
    borderRadius: 12,
    paddingHorizontal: 16,
    justifyContent: 'center',
    backgroundColor: colors.bg.base,
  },
  inputText: {
    fontSize: 16,
    color: colors.text.primary,
  },
  placeholderText: {
    fontSize: 16,
    color: colors.text.disabled,
  },
  footer: {
    paddingBottom: 20,
  },
  submitButton: {
    height: 56,
    backgroundColor: colors.brand.primary,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: colors.border.muted,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.inverse,
  },
  // 바텀 시트 관련 스타일
  bottomSheetBackground: {
    backgroundColor: colors.bg.base,
    borderRadius: 24,
  },
  bottomSheetListContainer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  bottomSheetItem: {
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.subtle,
  },
  bottomSheetItemText: {
    fontSize: 16,
    color: colors.text.primary,
    textAlign: 'center',
  },

  // --- 약관 동의 섹션 스타일 ---
  termsSection: {
    backgroundColor: colors.bg.base,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
  allAgreeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  allAgreeText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text.primary,
    marginLeft: 8,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border.subtle,
    marginVertical: 12,
  },
  termRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  termText: {
    fontSize: 14,
    color: colors.text.secondary,
    marginLeft: 8,
  },
  termTextChecked: {
    color: colors.text.primary,
  },
  detailText: {
    fontSize: 12,
    color: colors.text.disabled,
    textDecorationLine: 'underline',
  },
  // -----------------------------
});
