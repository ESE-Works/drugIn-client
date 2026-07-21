@AGENTS.md

# CLAUDE.md

Claude Code(claude.ai/code)가 이 저장소에서 작업할 때 참고하는 가이드입니다.

## 🌐 언어 및 커뮤니케이션 규칙

**이 프로젝트에서 Claude와의 모든 상호작용은 다음 규칙을 따릅니다:**

- **기본 응답 언어**: 한국어
  - Claude의 모든 응답, 설명, 피드백은 한국어로 제공됩니다
  - 코드 리뷰, 아키텍처 설명, 오류 메시지 등 모두 한국어

- **코드 주석**: 한국어로 작성
  - 함수, 컴포넌트, 복잡한 로직의 주석은 한국어
  - 예시:
    ```typescript
    /**
     * 계약서 목록 카드.
     * 정책 id를 눌렀을 때 상세 화면으로 이동한다.
     *
     * @param policy 정책 요약 정보
     */
    function PolicyCard({ policy }: PolicyCardProps) {}
    ```

- **문서화**: 한국어로 작성
  - README, 설명서, API 문서의 설명은 한국어

- **변수/함수명**: 영어 (코드 표준 준수)
  - 모든 변수, 함수, 컴포넌트, 훅 이름은 영어
  - 예시: `useAuthStore()`, `contractStatus`, `PolicyCard`

---

## 프로젝트 개요

**임대차 계약 관리 플랫폼 클라이언트** (Rental Contract Management Platform - Client)

Expo(React Native) 기반 모바일 앱입니다. 계약서 분석, 정책/혜택 조회, AI 채팅, 마이페이지 기능을 제공합니다. 현재 초기 단계로 UI/레이아웃 위주로 구현되어 있고, 인증·API 연동·상태관리 레이어는 스캐폴딩만 존재합니다 (아래 "구현 현황" 참고).

## 기술 스택

- **Framework**: Expo ~54.0 (React Native 0.81, React 19) + Expo Router ~6.0 (파일 기반 라우팅)
- **언어**: TypeScript (strict)
- **상태 관리**: zustand (^5) — 아직 스토어 미구현
- **서버 상태/데이터 페칭**: @tanstack/react-query (^5) — 아직 미연동
- **스토리지**: expo-secure-store (토큰 저장용, 아직 미사용)
- **검증**: zod
- **패키지 매니저**: pnpm (npm/yarn 금지 — `pnpm-lock.yaml`, `pnpm-workspace.yaml` 존재)
- **테스트**: Jest + @testing-library/react-native + msw (아직 테스트 파일 없음)
- **코드 품질**: ESLint(eslint-config-expo) + Prettier + Husky(pre-commit) + commitlint
- **모니터링**: @sentry/react-native

## 프로젝트 구조

```
app/                                   # Expo Router 라우트 (파일 = 화면)
├── _layout.tsx                        # 루트 Stack: (tabs), mypage/index 등록
├── index.tsx                          # "/" → "/(tabs)" 리다이렉트
├── (auth)/
│   ├── _layout.tsx                    # 스텁 (미구현)
│   └── login.tsx                      # 스텁 (미구현)
├── (tabs)/
│   ├── _layout.tsx                    # 하단 탭 바 (홈/분석/AI채팅) + 커스텀 Header
│   ├── index.tsx                      # 홈 — 현재 DUMMY_POLICIES 하드코딩 데이터 사용
│   ├── analysis.tsx                   # AI 분석 — 정적 placeholder
│   └── chat.tsx                       # AI 채팅 — 정적 placeholder
└── mypage/
    └── index.tsx                      # 마이페이지 — UI는 완성, 로직(로그아웃 등)은 console.log만

src/
├── components/                        # 공용 UI 컴포넌트
│   ├── Card.tsx / ListItem.tsx / Modal.tsx / Toast.tsx
│   └── layout/Header.tsx, SubHeader.tsx
├── constants/                         # colors.ts, typography.ts, layout.ts (index.ts로 재수출)
├── features/                          # 기능별 폴더 (analysis, auth, chat, contracts, policy)
│   └── contracts/Contracts.tsx        # 유일하게 존재하는 placeholder 컴포넌트, 나머지는 빈 폴더
├── hooks/                             # 비어있음 (스캐폴딩)
├── lib/
│   ├── axios.ts                       # 스텁 — API 클라이언트 미구현
│   ├── queryClient.ts                 # 스텁 — react-query 설정 미구현
│   └── validate.ts                    # 스텁 — zod 검증 헬퍼 미구현
├── store/
│   └── authStore.ts                   # 스텁 — zustand 인증 스토어 미구현
└── types/
    └── api.ts                         # 스텁 — API 타입 미정의
```

## 구현 현황 (중요)

작업 전에 항상 실제 파일 내용을 먼저 확인하세요. 아래는 스캐폴딩만 있고 로직이 비어 있는 부분입니다:

- `src/lib/axios.ts`, `src/lib/queryClient.ts`, `src/lib/validate.ts` — 전부 빈 스텁
- `src/store/authStore.ts` — zustand는 설치되어 있지만 스토어 구현 없음
- `src/types/api.ts` — 타입 정의 없음
- `app/(auth)/` — 로그인 라우트 그룹은 존재하나 내용 없음
- `app/(tabs)/index.tsx` — react-query 대신 하드코딩된 `DUMMY_POLICIES` 사용 중
- `.env.example` 없음, `app.json`에 `extra` 블록 없음 — 환경변수/API base URL 설정 방식이 아직 정해지지 않음
- `src/features/{analysis,auth,chat,policy}/` — `.txt` placeholder만 있는 빈 폴더 (git에 빈 디렉토리 유지용)
- 테스트 파일(`*.test.tsx`) 없음 — jest 설정과 mock(`jest.setup.js`)만 준비된 상태

새 기능을 구현할 때는 이 스텁들을 먼저 채우는 것이 자연스러운 시작점입니다.

## 경로 별칭

`tsconfig.json`에 `@/*` → `./src/*` 별칭만 설정되어 있습니다.

```typescript
import { colors } from '@/constants/colors';
import { ListItem } from '@/components/ListItem';
```

## 자주 사용하는 명령어

```bash
# 개발
pnpm install                    # 의존성 설치 (반드시 pnpm 사용)
pnpm start                      # expo start
pnpm android                    # expo start --android
pnpm ios                        # expo start --ios
pnpm web                        # expo start --web

# 코드 품질
pnpm lint                       # expo lint
pnpm typecheck                  # tsc --noEmit

# 테스트
pnpm test                       # typecheck && test:unit (pre-commit 훅에서도 실행됨)
pnpm test:unit                  # jest --passWithNoTests
```

## 테스트

- **프레임워크**: Jest + @testing-library/react-native + @testing-library/jest-native
- **모킹 API**: msw (아직 실제 사용 없음)
- **jest.setup.js**: `react-native-gesture-handler`, `react-native-reanimated`, `expo-constants`, `expo-router`(Link, router.push/replace/back/dismiss/canGoBack)를 모킹
- 아직 `*.test.tsx` 파일이 없으므로, 테스트 추가 시 위 mock을 기준으로 컴포넌트/훅 테스트를 작성하세요

## 코드 스타일

- **Prettier**: 세미콜론 사용, 싱글 쿼트, trailing comma(all), printWidth 100, tabWidth 2
- **ESLint** (`eslint.config.js`, eslint-config-expo/flat 기반):
  - `@typescript-eslint/no-floating-promises`, `no-misused-promises`, `require-await` → error
  - `@typescript-eslint/consistent-type-imports` 강제 (`import type { Foo } from '...'`)
  - `no-explicit-any` → warn (`fixToUnknown`)
  - `explicit-function-return-type` → warn
- **커밋 전 자동 실행** (Husky `pre-commit`): `pnpm test` (typecheck + jest) 전체 실행
- **lint-staged**: staged된 ts/tsx는 prettier + `eslint --max-warnings=0`, json/md/css/scss는 prettier만

## 커밋 컨벤션

`commitlint.config.js` 기준 Conventional Commits:

- 허용 타입: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`, `wip`, `release`
- 헤더 최대 72자

**브랜치 네이밍**:

- `feat/*` - 기능 개발
- `fix/*` - 버그 수정
- `refactor/*` - 코드 리팩토링
- `chore/*` - 빌드/패키지 변경
- `docs/*` - 문서 수정

## CI

`.github/workflows/notify-caller.yml` — push 시 Discord 알림만 수행. 별도의 lint/test/build CI 워크플로우는 아직 없습니다.

## 주의 사항

1. **Expo SDK 54는 최근 변경사항이 많습니다.** 코드 작성 전 `AGENTS.md`가 안내하는 대로 https://docs.expo.dev/versions/v54.0.0/ 의 최신 문서를 확인하세요.
2. **패키지 매니저는 pnpm만 사용**합니다. `package-lock.json`, `yarn.lock` 생성 금지.
3. **스텁 파일 주의**: `src/lib/*`, `src/store/authStore.ts`, `src/types/api.ts` 등은 내용이 비어 있는 스캐폴딩입니다. "이미 구현되어 있다"고 가정하지 말고 항상 실제 내용을 확인한 뒤 작업하세요.
4. **홈 화면의 더미 데이터**: `app/(tabs)/index.tsx`의 `DUMMY_POLICIES`는 react-query 연동 전 임시 데이터입니다. API 연동 시 교체가 필요합니다.

---

**마지막 업데이트**: 2026-07-18
