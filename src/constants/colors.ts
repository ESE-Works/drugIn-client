const palette = {
  blue50: '#E8EEFD',
  blue50Alpha30: '#E8EEFD4D',
  blue100: '#D2DEFC',
  blue300: '#648DF5',
  blue500: '#225DF2',
  blue700: '#1B4AC1',
  blue900: '#0D2560',
  blue950: '#0A1B48',

  gray0: '#FFFFFF',
  gray50: '#F9F9F9',
  gray100: '#F0F0F0',
  gray200: '#E0E0E0',
  gray400: '#A0A0A0',
  gray600: '#606060',
  gray900: '#111111',
} as const;

export const colors = {
  // 브랜드
  brand: {
    primary: palette.blue500, // 메인 버튼, 강조
    primaryHover: palette.blue700, // 버튼 hover/press
    primaryLight: palette.blue100, // 배경 강조
    primaryGhost: palette.blue50, // 탭 활성 배경 등 컴포넌트 내부색
    primaryGhostAlpha: palette.blue50Alpha30,
    primarySoft: palette.blue300, // 보조 강조
    primaryDark: palette.blue900, // 텍스트 강조
    primaryDeepest: palette.blue950, // 헤더 등 최상단
  },

  // 텍스트
  text: {
    primary: palette.gray900, // 본문
    secondary: palette.gray600, // 보조 텍스트
    disabled: palette.gray400, // 비활성
    inverse: palette.gray0, // 어두운 배경 위
    brand: palette.blue900, // 브랜드 텍스트
  },

  // 배경
  bg: {
    base: palette.gray0, // 기본 배경
    subtle: palette.blue50Alpha30, // 카드, 섹션
    muted: palette.gray100, // 구분선 배경
    brandSubtle: palette.blue50, //페이지/섹션 단위 배경
  },

  // 선/구분
  border: {
    default: palette.gray200, // 기본 border
    subtle: palette.gray100, // 약한 border
    muted: palette.gray400, // 입력창 등
  },

  // 상태
  status: {
    error: '#FF4D4F',
    warning: '#FAAD14',
    success: '#52C41A',
    info: '#1890FF',
    badge: '#B3261E',
  },

  // 분석 결과
  analysis: {
    danger: { text: '#FF4D4F', bg: '#FFE5E5' },
    safe: { text: '#52C41A', bg: '#EBFAF4' },
    caution: { text: '#FAAD14', bg: '#F9F8E9' },
  },
} as const;

export type Colors = typeof colors;
