# 아키텍처 개요

drugIn-client (임대차 계약 관리 플랫폼) 의 클라이언트 아키텍처를 정리한 문서입니다.
아래 Mermaid 다이어그램은 [Mermaid Live Editor](https://mermaid.live) 등 Mermaid를 지원하는 도구에서
코드 블록을 붙여넣으면 바로 그림으로 렌더링할 수 있습니다.

## 1. 전체 레이어 구조

```mermaid
flowchart TB
    subgraph UI["화면 계층 (app/ — Expo Router)"]
        AUTH["(auth)\nlogin, onboarding"]
        TABS["(tabs)\n홈 / 계약서 분석 / AI채팅"]
        MYPAGE["mypage"]
        POLICY["policy"]
        TERMS["terms"]
    end

    subgraph FEATURES["기능 계층 (src/features)"]
        F_AUTH["auth\nauthApi, userApi, termsApi\nuseSocialLogin"]
        F_CONTRACTS["contracts\nAnalysisDetail/History\napi, hooks, authGate\ncomponents/*"]
        F_POLICY["policy\nbenefitsApi"]
    end

    subgraph SHARED["공용 계층 (src/)"]
        COMPONENTS["components\nCard, ListItem, Modal, Toast\nlayout/Header, SubHeader"]
        STORE["store/authStore\n(zustand)"]
        LIB["lib\naxios(interceptor), queryClient"]
        TYPES["types/api"]
        CONST["constants\ncolors, typography, layout"]
    end

    subgraph EXTERNAL["외부 연동"]
        API["백엔드 REST API"]
        SOCIAL["Google / Kakao 소셜 로그인"]
        SECURE["expo-secure-store\n(토큰 저장)"]
        SENTRY["Sentry\n(모니터링)"]
    end

    UI --> FEATURES
    UI --> COMPONENTS
    FEATURES --> LIB
    FEATURES --> STORE
    FEATURES --> TYPES
    F_AUTH --> SOCIAL
    LIB --> API
    STORE --> SECURE
    LIB --> SECURE
    UI --> SENTRY
    COMPONENTS --> CONST
```

## 2. 라우팅 구조 (Expo Router)

```mermaid
flowchart LR
    ROOT["app/_layout.tsx\nRootLayout\n(QueryClientProvider, initAuth)"]

    ROOT --> AUTH_GROUP["(auth)"]
    ROOT --> TABS_GROUP["(tabs)"]
    ROOT --> MYPAGE_R["mypage/index"]
    ROOT --> POLICY_R["policy/index"]
    ROOT --> TERMS_R["terms/index"]

    AUTH_GROUP --> LOGIN["login.tsx"]
    AUTH_GROUP --> ONBOARDING["onboarding.tsx"]

    TABS_GROUP --> HOME["index.tsx\n(홈)"]
    TABS_GROUP --> ANALYSIS_GROUP["analysis/"]
    TABS_GROUP --> CHAT["chat\n(placeholder)"]

    ANALYSIS_GROUP --> ANALYSIS_IDX["index.tsx\n(분석 입력)"]
    ANALYSIS_GROUP --> ANALYSIS_HIST["history.tsx\n(분석 이력)"]
    ANALYSIS_GROUP --> ANALYSIS_DETAIL["[id].tsx\n(분석 상세)"]
```

## 3. 인증 플로우 (소셜 로그인 + 토큰 갱신)

```mermaid
sequenceDiagram
    participant App as RootLayout
    participant Store as authStore (zustand)
    participant Secure as SecureStore / localStorage(web)
    participant Hook as useSocialLogin
    participant Api as authApi / userApi
    participant Server as 백엔드 API

    App->>Store: initAuth() (앱 최초 마운트 시)
    Store->>Secure: getItem(access_token)
    alt 토큰 있음
        Store->>Api: getUserProfile(accessToken)
        Api->>Server: GET /users/me
        Server-->>Api: user profile
        Store->>Store: set({ user, isLoggedIn: true })
    else 토큰 없음/만료
        Store->>Store: set({ user: null, isLoggedIn: false })
    end

    Note over Hook,Server: 로그인 화면에서 소셜 로그인 시도
    Hook->>Server: Google/Kakao OAuth
    Server-->>Hook: access_token, refresh_token, user
    Hook->>Store: setAuth(user, access_token, refresh_token)
    Store->>Secure: setItem(access_token, refresh_token)

    Note over Api,Server: 이후 API 요청 (axios interceptor)
    Api->>Server: 요청 + Authorization: Bearer accessToken
    Server-->>Api: 401 (토큰 만료)
    Api->>Server: POST /auth/refresh (refresh_token)
    Server-->>Api: 새 access_token/refresh_token
    Api->>Secure: 토큰 갱신 저장
    Api->>Server: 원래 요청 재시도
```

## 4. 계약서 분석(contracts) 기능 흐름

```mermaid
flowchart TB
    ENTRY["analysis/index.tsx\n(사진 업로드 입력)"]
    GATE["authGate.ts\nrequireLogin / useIsLoggedIn"]
    HOOKS["contracts/hooks.ts\n(react-query hooks)"]
    API_C["contracts/api.ts"]
    DETAIL["analysis/[id].tsx\n→ AnalysisDetail.tsx"]
    HIST["analysis/history.tsx\n→ AnalysisHistory.tsx"]

    subgraph RESULT_COMPONENTS["결과 화면 컴포넌트"]
        RESULT["AnalysisResultView"]
        SUMMARY["SummaryCard"]
        RISK["RiskScoreGauge"]
        FRAUD["FraudAlertBanner"]
        CHECKLIST["ChecklistSection"]
        CLAUSES["ClauseDetailList"]
        SEVERITY["SeverityTag"]
        IMGBOX["ImageInputBox"]
    end

    ENTRY --> GATE
    GATE -->|비로그인| LOGINPAGE["(auth)/login"]
    ENTRY --> IMGBOX
    ENTRY --> HOOKS
    HOOKS --> API_C
    API_C --> SERVER["백엔드 API"]
    HOOKS --> DETAIL
    DETAIL --> RESULT
    RESULT --> SUMMARY
    RESULT --> RISK
    RESULT --> FRAUD
    RESULT --> CHECKLIST
    RESULT --> CLAUSES
    CLAUSES --> SEVERITY
    HIST --> HOOKS
```

## 참고

- 화면(라우트)은 `app/` 아래 Expo Router 파일 기반 라우팅을 따릅니다.
- 화면은 `src/features/*` 의 기능 컴포넌트/훅/API를 조립해서 사용합니다.
- 인증 토큰은 `src/store/authStore.ts` (zustand) 가 메모리 상태를, `expo-secure-store`(네이티브)/`localStorage`(web) 가 영속 저장을 담당합니다.
- API 요청은 `src/lib/axios.ts` 의 axios 인스턴스를 통하며, 401 응답 시 인터셉터가 자동으로 refresh token 흐름을 수행합니다.
- 서버 상태 캐싱/동기화는 `@tanstack/react-query` (`src/lib/queryClient.ts`) 로 처리합니다.
