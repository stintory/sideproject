const error = {
  notFoundSample: '데이터가 존재하지 않습니다. - :param',
  notFound: {
    basic: '데이터가 존재하지 않습니다.',
    sdk: 'SDK is not found.',
  },
  usageLimit: 'The project(:params) is restricted by exceeding the limitation of available usage.',
  usageDisabled: 'The :params is disabled.',
  accessDenied: {
    domain: 'The project(:params) is prohibited to download because the request is from not-allowed domain.',
  },
  jwt: {
    signFail: '토큰 발급에 실패했습니다.',
    verifyFail: '토큰 인증에 실패했습니다.',
  },
  auth: {
    auth: '권한이 거부 되었습니다.',
  },
  log: {
    duplicate: 'Log duplicated',
  },
  db: {
    addFail: '데이터 추가에 실패했습니다.',
  },
};

module.exports = error;
