# API 요약 (프론트 참고용)

전체 스펙/실시간 테스트는 Swagger(`/api-docs`)를 참고하세요. 이 문서는 빠르게 훑어볼 용도의 요약입니다.

- **Base URL (로컬)**: `http://localhost:4000`
- **Base URL (개발 서버)**: `http://136.66.69.44:4000`
- **인증 방식**: 로그인 후 받은 `accessToken`을 헤더에 담아 요청

```
Authorization: Bearer <accessToken>
```

- **에러 응답 공통 형식**

```json
{ "statusCode": 400, "message": "에러 설명", "error": "Bad Request" }
```

---

## 1. Auth

| Method | Path            | 인증 | 설명               |
| ------ | --------------- | ---- | ------------------ |
| POST   | `/auth/kakao`   | ❌   | 카카오 로그인/가입 |
| POST   | `/auth/google`  | ❌   | 구글 로그인/가입   |
| POST   | `/auth/refresh` | ❌   | accessToken 재발급 |

**로그인 요청/응답**

```jsonc
// body
{ "accessToken": "카카오/구글 SDK에서 받은 accessToken" }

// response
{ "accessToken": "자체 JWT (7일 만료)", "refreshToken": "재발급용 토큰 (30일 만료)" }
```

**재발급**

```jsonc
// body
{ "refreshToken": "로그인 시 받은 refreshToken" }
// response: 위와 동일한 형식 (refreshToken도 매번 새로 발급됨 — 응답값으로 교체해서 저장)
```

---

## 2. Users

| Method | Path                | 인증 | 설명                        |
| ------ | ------------------- | ---- | --------------------------- |
| GET    | `/users/me`         | ✅   | 내 정보 조회                |
| POST   | `/users/me/profile` | ✅   | 회원가입 추가정보 등록/수정 |

**GET /users/me 응답**

```jsonc
{
  "id": "uuid",
  "nickname": "string",
  "profile_image_url": "string | null",
  "provider": "kakao | google",
  "region": "string | null",
  "age": "number | null",
  "income_range": "string | null",
  "created_at": "date",
}
```

**POST /users/me/profile 요청** (전달한 필드만 갱신, 나머지는 기존 값 유지)

```jsonc
{ "region": "서울시 강남구", "age": 28, "income_range": "3000-4000만원" }
```

---

## 3. Contracts (계약서 분석)

| Method | Path                       | 인증 | 설명                                      |
| ------ | -------------------------- | ---- | ----------------------------------------- |
| POST   | `/contracts/text`          | ✅   | 계약서 전체 텍스트 분석                   |
| POST   | `/contracts/special-terms` | ✅   | 특약 조항만 분석                          |
| GET    | `/contracts/sample`        | ❌   | 샘플 분석 결과 (GPT 호출 없음, 비용 없음) |
| GET    | `/contracts`               | ✅   | 내 분석 이력 목록                         |
| GET    | `/contracts/:id`           | ✅   | 분석 결과 단건 조회                       |

**POST /contracts/text, /contracts/special-terms 요청**

```jsonc
{ "text": "계약서 전체 원문 또는 특약 조항" }
```

**응답 (analysis_result 구조)**

```jsonc
{
  "id": "uuid",
  "status": "COMPLETED | FAILED | ANALYZING",
  "original_text": "string",
  "input_source": "text_paste | text_special_terms",
  "analysis_result": {
    "contract_valid": true,
    "input_mode": "full | special_terms",
    "is_truncated": false,
    "extraction": {
      "lessor_name": "string | null",
      "lessee_name": "string | null",
      "property_address": "string | null",
      "property_type": "apartment | officetel | villa | oneroom | unknown",
      "contract_type": "monthly | lease | semi_lease | unknown",
      "deposit": "number | null (만원 단위)",
      "monthly_rent": "number | null (만원 단위)",
      "contract_start": "YYYY-MM-DD | null",
      "contract_end": "YYYY-MM-DD | null",
      "special_terms": ["string"],
    },
    "missing_check": [
      { "item": "string", "severity": "danger | warning", "description": "string" },
    ],
    "clauses": [
      {
        "id": "string",
        "original_text": "string",
        "type": "danger | warning | safe",
        "reason": "string",
        "law_reference": "string",
        "suggestion": "string",
        "request_guide": "string",
      },
    ],
    "fraud_risk": {
      "detected": true,
      "indicators": [
        { "indicator": "string", "severity": "danger | warning", "description": "string" },
      ],
    },
    "summary": "string",
    "risk_score": "0~100",
    "risk_grade": "safe | warning | danger | critical",
  },
}
```

- 주거용 임대차 계약서가 아니라고 판단되면 `400 (NOT_CONTRACT)` 에러
- AI 응답 파싱 실패(재시도 후에도) 시 `503 (AI_PARSE_FAILED)` 에러
- 특약 조항만 분석 시 `extraction`, `fraud_risk`는 `null`

---

## 4. Notifications (푸시 알림)

| Method | Path                                    | 인증 | 설명                   |
| ------ | --------------------------------------- | ---- | ---------------------- |
| POST   | `/notifications/device-token`           | ✅   | FCM 디바이스 토큰 등록 |
| DELETE | `/notifications/device-token/:fcmToken` | ✅   | 디바이스 토큰 삭제     |
| GET    | `/notifications`                        | ✅   | 내 알림 목록 (최신순)  |

**POST 요청**

```jsonc
{ "fcm_token": "string", "device_type": "ios | android (optional)" }
```

---

## 5. Benefits (청년 지원 혜택)

| Method | Path                    | 인증 | 설명                                             |
| ------ | ----------------------- | ---- | ------------------------------------------------ |
| GET    | `/benefits`             | ❌   | 혜택 목록 (region/age/incomeRange 쿼리로 필터링) |
| GET    | `/benefits/recommended` | ✅   | 내 프로필 기반 추천 혜택                         |
| GET    | `/benefits/:id`         | ❌   | 혜택 상세 조회                                   |

**GET /benefits 쿼리 파라미터** (모두 optional)

```
?region=서울시&age=28&incomeRange=3000-4000만원
```

**응답**

```jsonc
{
  "id": "string",
  "title": "string",
  "description": "string",
  "region": "string | null",
  "minAge": "number | null",
  "maxAge": "number | null",
  "incomeRange": "string | null",
  "applicationDeadline": "YYYY-MM-DD | null",
  "url": "string",
  "source": "string",
}
```

> 현재 mock 데이터로 동작 중 (실제 공공데이터 API 연동 전)

---

## 참고

- 모든 날짜는 ISO 8601 형식
- 보증금/월세는 **만원 단위**
- 인증 필요한 API에 토큰 없이 요청하면 `401 Unauthorized`
