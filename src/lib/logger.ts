/* eslint-disable no-console */

// __DEV__는 RN/Expo가 제공하는 전역 플래그로, 프로덕션 빌드(배포 환경 포함)에서는 항상 false다.
// 토큰/API 응답 등 민감한 내용이 배포 환경 콘솔에 그대로 노출되는 것을 막기 위해
// console.* 대신 이 logger를 통해서만 로그를 남긴다.
export const logger = {
  log: (...args: unknown[]): void => {
    if (__DEV__) console.log(...args);
  },
  warn: (...args: unknown[]): void => {
    if (__DEV__) console.warn(...args);
  },
  error: (...args: unknown[]): void => {
    if (__DEV__) console.error(...args);
  },
};
