import axios from 'axios';
import { getAPIBaseUrls, isValidETHAddress, walletToPCAIP10 } from '../helpers';
import Constants from '../constants';
import { ChatOptionsType } from '../types';
import { getConnectedUser, getEncryptedRequest } from './helpers';
import { conversationHash } from './conversationHash';
import { start } from './start';

/**
 *  POST /v1/chat/message
 */

export const send = async (options: Omit<ChatOptionsType, 'connectedUser'>) => {
  const {
    messageContent = '',
    messageType = 'Text',
    receiverAddress,
    account,
    privateKey = null,
    env = Constants.ENV.PROD,
  } = options || {};

  try {
    if (!isValidETHAddress(account)) {
      throw new Error(`Invalid address!`);
    }

    const connectedUser = await getConnectedUser(account, privateKey, env);

    const conversationResponse = await conversationHash({
      conversationId: receiverAddress,
      account,
      env,
    });
    if (!conversationResponse) {
      return start({
        messageContent: messageContent,
        messageType: 'Text',
        receiverAddress,
        connectedUser,
        env,
      });
    } else {
      const { message, encryptionType, aesEncryptedSecret, signature } =
        (await getEncryptedRequest(
          receiverAddress,
          { ...connectedUser, privateKey },
          messageContent,
          env
        )) || {};
      const API_BASE_URL = getAPIBaseUrls(env);
      const apiEndpoint = `${API_BASE_URL}/v1/w2w/messages`;

      const body = {
        fromDID: walletToPCAIP10(account),
        toDID: walletToPCAIP10(receiverAddress),
        fromCAIP10: walletToPCAIP10(account),
        toCAIP10: walletToPCAIP10(receiverAddress),
        message,
        messageType,
        signature,
        encType: encryptionType,
        encryptedSecret: aesEncryptedSecret,
        sigType: signature,
      };

      return axios
        .post(apiEndpoint, body)
        .then((response) => {
          return response.data;
        })
        .catch((err) => {
          throw new Error(err);
        });
    }
  } catch (err) {
    console.error(
      `[EPNS-SDK] - API  - Error - send() -: `,
      JSON.stringify(err)
    );
  }
};