const { withProjectBuildGradle } = require('@expo/config-plugins');

const KAKAO_REPO = "maven { url 'https://devrepo.kakao.com/nexus/content/groups/public/' }";

module.exports = function withKakaoMavenRepo(config) {
  return withProjectBuildGradle(config, (config) => {
    if (config.modResults.language === 'groovy') {
      if (!config.modResults.contents.includes('devrepo.kakao.com')) {
        config.modResults.contents = config.modResults.contents.replace(
          /allprojects\s*{\s*repositories\s*{/,
          (match) => `${match}\n        ${KAKAO_REPO}`,
        );
      }
    }
    return config;
  });
};
