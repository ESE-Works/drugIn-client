import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  BackHandler,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { router } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';

import Toast from '@/components/Toast';
import { colors, spacing, fontSize, fontWeight, radius } from '@/constants';
import type { Contract } from '@/types/api';

import type { PickedImage } from './api';
import { useAnalyzeImageMutation, useContractSampleQuery } from './hooks';
import { requireLogin } from '@/lib/authGate';
import AnalysisResultView from './components/AnalysisResultView';
import ImageInputBox from './components/ImageInputBox';
import MarketCheckLanding from '@/features/marketCheck/components/MarketCheckLanding';

type Stage = 'idle' | 'loading' | 'result';
type Tab = 'contract' | 'marketCheck';

function getErrorMessage(error: unknown): string {
  // 백엔드가 반환하는 원문 메시지(라우트 오류, 서버 내부 오류 등)는 사용자에게 그대로 노출하지 않는다.
  const status = (error as { response?: { status?: number } })?.response?.status;
  if (status === 400) {
    return '주거용 임대차 계약서로 인식되지 않았어요. 다른 사진으로 다시 시도해주세요.';
  }
  if (status === 503) {
    return '지금은 분석하기 어려워요. 잠시 후 다시 시도해주세요.';
  }
  return '분석 요청 중 오류가 발생했어요. 잠시 후 다시 시도해주세요.';
}

export default function Contracts() {
  const [activeTab, setActiveTab] = useState<Tab>('contract');
  const [stage, setStage] = useState<Stage>('idle');
  const [image, setImage] = useState<PickedImage | null>(null);
  const [contract, setContract] = useState<Contract | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const analyzeImageMutation = useAnalyzeImageMutation();
  const sampleQuery = useContractSampleQuery(false);

  const handleSubmit = (): void => {
    if (!requireLogin()) {
      return;
    }

    if (!image) {
      setToastMessage('사진을 선택해주세요.');
      return;
    }

    setStage('loading');
    analyzeImageMutation.mutate(image, {
      onSuccess: (result) => {
        setContract(result);
        setStage('result');
      },
      onError: (error) => {
        setToastMessage(getErrorMessage(error));
        setStage('idle');
      },
    });
  };

  const handleViewSample = (): void => {
    setStage('loading');
    sampleQuery
      .refetch()
      .then((result) => {
        if (result.data) {
          setContract(result.data);
          setStage('result');
        } else {
          setToastMessage('샘플을 불러오지 못했어요.');
          setStage('idle');
        }
      })
      .catch(() => {
        setToastMessage('샘플을 불러오지 못했어요.');
        setStage('idle');
      });
  };

  const handleReset = (): void => {
    setContract(null);
    setImage(null);
    setStage('idle');
  };

  // 결과/분석 중 화면에서 하드웨어 뒤로가기를 누르면 탭을 벗어나지 않고 입력 화면으로 돌아간다.
  useFocusEffect(
    useCallback(() => {
      const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
        if (stage === 'idle') {
          return false;
        }
        handleReset();
        return true;
      });
      return () => subscription.remove();
    }, [stage]),
  );

  if (stage === 'result' && contract) {
    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.resultScroll}>
          <AnalysisResultView contract={contract} onRetry={handleReset} />
        </ScrollView>
        <TouchableOpacity style={styles.resetButton} onPress={handleReset} activeOpacity={0.7}>
          <Text style={styles.resetText}>다시 분석하기</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const isLoading = stage === 'loading';

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <View style={styles.tabBar}>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'contract' && styles.tabButtonActive]}
            onPress={() => setActiveTab('contract')}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabLabel, activeTab === 'contract' && styles.tabLabelActive]}>
              계약서 분석
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'marketCheck' && styles.tabButtonActive]}
            onPress={() => setActiveTab('marketCheck')}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabLabel, activeTab === 'marketCheck' && styles.tabLabelActive]}>
              시세 진단
            </Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'marketCheck' ? (
          <MarketCheckLanding />
        ) : (
          <>
            <ImageInputBox
              image={image}
              onPick={setImage}
              onClear={() => setImage(null)}
              onSizeExceeded={() => setToastMessage('10MB 이하의 사진만 업로드할 수 있어요.')}
              disabled={isLoading}
            />

            <View style={styles.belowBox}>
              {isLoading ? (
                <>
                  <Text style={styles.loadingText}>분석 중</Text>
                  <ActivityIndicator size="large" color={colors.brand.primary} />
                </>
              ) : image ? (
                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={handleSubmit}
                  activeOpacity={0.7}
                >
                  <Text style={styles.submitText}>분석하기</Text>
                </TouchableOpacity>
              ) : (
                <Text style={styles.caption}>계약서 사진 한 장이면{'\n'}위험요소를 찾아드려요</Text>
              )}
            </View>

            <View style={styles.footerLinks}>
              <TouchableOpacity onPress={handleViewSample} disabled={isLoading}>
                <Text style={styles.footerLink}>샘플로 먼저 볼까요?</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  if (requireLogin()) {
                    router.push('/analysis/history');
                  }
                }}
                disabled={isLoading}
              >
                <Text style={styles.footerLink}>분석 이력</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        <Toast message={toastMessage} onHide={() => setToastMessage(null)} />
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg.base,
    padding: spacing.lg,
  },
  tabBar: {
    flexDirection: 'row',
    marginBottom: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: colors.bg.muted,
    padding: spacing.xxs,
  },
  tabButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    alignItems: 'center',
  },
  tabButtonActive: {
    backgroundColor: colors.bg.base,
    elevation: 1,
  },
  tabLabel: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text.secondary,
  },
  tabLabelActive: {
    color: colors.brand.primary,
    fontWeight: fontWeight.bold,
  },
  belowBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxxl,
    gap: spacing.lg,
  },
  loadingText: {
    fontSize: fontSize.md,
    color: colors.text.secondary,
  },
  caption: {
    fontSize: fontSize.md,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  submitButton: {
    alignSelf: 'stretch',
    backgroundColor: colors.brand.primary,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  submitText: {
    color: colors.text.inverse,
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
  },
  footerLinks: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.xxl,
    marginTop: 'auto',
    paddingBottom: spacing.lg,
  },
  footerLink: {
    fontSize: fontSize.sm,
    color: colors.brand.primary,
    fontWeight: fontWeight.medium,
  },
  resultScroll: {
    paddingBottom: spacing.lg,
  },
  resetButton: {
    backgroundColor: colors.brand.primary,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  resetText: {
    color: colors.text.inverse,
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
  },
});
