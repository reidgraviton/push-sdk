export interface URLConfigType {
  [key: number]: string
}

const API_URL = {
  PROD: "https://backend.epns.io/apis",
  STAGING: "https://backend-staging.epns.io/apis"
}

const URLConfig : URLConfigType = {
  1: API_URL.PROD,
  137: API_URL.PROD,
  5: API_URL.STAGING,
  80001: API_URL.STAGING,
  56: API_URL.PROD,
  97: API_URL.STAGING,
  10: API_URL.PROD,
  420: API_URL.STAGING
};

export default {
	EPNS_SDK_EMBED_NAMESPACE: '[EPNS_SDK_EMBED]',
	EPNS_SDK_EMBED_APP_URL: 'https://ethereum-push-notification-service.github.io/embed-dapp',
	EPNS_SDK_EMBED_API_URL: URLConfig,
	EPNS_SDK_EMBED_VIEW_ROOT: 'EPNS_SDK_EMBED_VIEW_ROOT',
	EPNS_SDK_EMBED_STYLE_TAG_ID_PREFIX: 'EPNS_SDK_EMBED_STYLE_TAG_ID_',
	EPNS_SDK_EMBED_IFRAME_ID: 'EPNS_SDK_EMBED_IFRAME_ID',
	EPNS_SDK_EMBED_CSS_ZINDEX_MAX: 2147483638, // MAX value
	EPNS_SDK_EMBED_CHANNEL: 'EPNS_SDK_EMBED_CHANNEL',
	EPNS_SDK_EMBED_CHANNEL_TOPIC_IFRAME_APP_LOADED: 'EPNS_SDK_EMBED_CHANNEL_TOPIC_IFRAME_APP_LOADED',
	EPNS_SDK_EMBED_CHANNEL_TOPIC_IFRAME_APP_CLOSED: 'EPNS_SDK_EMBED_CHANNEL_TOPIC_IFRAME_APP_CLOSED',
	EPNS_SDK_EMBED_CHANNEL_TOPIC_SDK_CONFIG_INIT: 'EPNS_SDK_EMBED_CHANNEL_TOPIC_SDK_CONFIG_INIT',
	EPNS_SDK_EMBED_LOCAL_STORAGE_PREFIX: 'EPNS_SDK_EMBED_LOCAL_STORAGE_'
}
