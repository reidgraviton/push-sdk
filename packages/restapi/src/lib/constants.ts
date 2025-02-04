export enum ENV {
  PROD = 'prod',
  STAGING = 'staging',
  DEV = 'dev'
}

const Constants = {
  ENV,
  PAGINATION: {
    INITIAL_PAGE: 1,
    LIMIT: 10,
    LIMIT_MIN: 1,
    LIMIT_MAX: 50
  },
  DEFAULT_CHAIN_ID: 5,
  DEV_CHAIN_ID: 99999,
  NON_ETH_CHAINS: [137, 80001, 56, 97, 10, 420],
  ETH_CHAINS: [1, 5]
};

export default Constants;