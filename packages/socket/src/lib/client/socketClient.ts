import { io, Socket } from 'socket.io-client';
import { API_URLS } from '../config';
import { getCAIPAddress } from '../helpers';
import { Environment, EVENTS, Message, MessageType, SocketInputOptions, UpdateIntent, WebSocketPayload } from '../types';
// import { getEncryptedRequest } from '@pushprotocol/restapi'
import { getConnectedUser, getEncryptedRequest } from 'packages/restapi/src/lib/chat/helpers';
import { IConnectedUser, IUser } from '@pushprotocol/restapi';
import { walletToPCAIP10 } from 'packages/restapi/src/lib/helpers';
import { get } from 'packages/restapi/src/lib/user/getUser';

export function createSocketConnection({
  user,
  env,
  isChat,
  socketOptions
}: SocketInputOptions
) {
  const {
    autoConnect = true,
    reconnectionAttempts = 5,
  } = socketOptions || {};
  const epnsWSUrl = API_URLS[env];
  const transports = ['websocket'];

  let epnsSocket = null;


  try {
    const userAddressInCAIP = getCAIPAddress(env, user, 'User');
    let query: Record<string, string>
    // Nodes only accept CAIP
    if (isChat) {
      query = { mode: 'w2w', did: userAddressInCAIP, address: userAddressInCAIP }
    } else {
      query = { address: userAddressInCAIP };
    }

    epnsSocket = io(epnsWSUrl, {
      transports,
      query,
      autoConnect,
      reconnectionAttempts,
    });

  } catch (e) {
    console.error('[EPNS-SDK] - Socket connection error: ');
    console.error(e);
  } finally {
    // eslint-disable-next-line no-unsafe-finally
    return epnsSocket;
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*
______          _            _           _             _ _    
| ___ \        | |          | |         | |           | | |   
| |_/ /   _ ___| |__     ___| |__   __ _| |_   ___  __| | | __
|  __/ | | / __| '_ \   / __| '_ \ / _` | __| / __|/ _` | |/ /
| |  | |_| \__ \ | | | | (__| | | | (_| | |_  \__ \ (_| |   < 
\_|   \__,_|___/_| |_|  \___|_| |_|\__,_|\__| |___/\__,_|_|\_\
*/
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export class ChatSDK {
  private _env: Environment;
  private _account: string;
  private _socket: Socket;
  private _connectedUser: IConnectedUser

  private constructor(env: Environment, account: string, connectedUser: IConnectedUser) {
    this._env = env;
    this._account = account.includes('eip155') ? account : ('eip155:' + account);
    this._connectedUser = connectedUser;
    this._socket = io(`http://localhost:4000?mode=w2w&did=${this._account}`, {
      query: {
        isSDK: true
      }
    })
  }

  /**
   * 
   * @param env Environment of the sdk: dev, staging or production
   * @param account Your address
   * @param pgpPublicKey Your PGP Public Key
   * @param pgpPrivateKey Your PGP Private Key
   * @returns 
   */
  async initialize(env: Environment, account: string, pgpPublicKey: string, pgpPrivateKey: string): Promise<ChatSDK> {
    const connectedUser = await getConnectedUser(account, pgpPrivateKey, env.toString());
    return new ChatSDK(env, account, connectedUser)
  }

  /**
   * Send your first message to an address
   * @param connectedUser Your user information
   * @param messageContent Content of your message
   * @param messageType Type of your messages
   * @param receiverAddress Receiver of your message
   */
  async sendIntent(messageContent: string, messageType: MessageType, receiverAddress: string): Promise<void> {
    try {
      const { message, encryptionType, aesEncryptedSecret, signature } = (await getEncryptedRequest(receiverAddress, this._connectedUser, messageContent, this._env.toString())) || {};
      const payload: WebSocketPayload<Message> = {
        payload: {
          fromDID: this._connectedUser.wallets.split(',')[0],
          toDID: walletToPCAIP10(receiverAddress),
          fromCAIP10: this._connectedUser.wallets.split(',')[0],
          toCAIP10: walletToPCAIP10(receiverAddress),
          messageContent: message!,
          messageType,
          signature: signature!,
          encType: encryptionType!,
          encryptedSecret: aesEncryptedSecret!,
          sigType: signature!,
        }
      }
      // TODO: Create user if receiver not in nodes. Check how rest-api package did it
      this._socket.emit(EVENTS.W2W_SEND_MESSAGE, { payload })
    } catch (e) {
      console.error(e)
    }
  }

  async sendMessage(connectedUser: IConnectedUser, messageContent: string, messageType: MessageType, receiverAddress: string): Promise<void> {
    const { message, encryptionType, aesEncryptedSecret, signature } = (await getEncryptedRequest(receiverAddress, connectedUser, messageContent, this._env.toString())) || {};
    const payload: WebSocketPayload<Message> = {
      payload: {
        fromDID: connectedUser.wallets.split(',')[0],
        toDID: walletToPCAIP10(receiverAddress),
        fromCAIP10: connectedUser.wallets.split(',')[0],
        toCAIP10: walletToPCAIP10(receiverAddress),
        messageContent: message!,
        messageType,
        signature: signature!,
        encType: encryptionType!,
        encryptedSecret: aesEncryptedSecret!,
        sigType: signature!,
      }
    }
    this._socket.emit(EVENTS.W2W_CREATE_INTENT, { payload })
  }

  async updateIntent(status: 'Approve', senderAddress: string): Promise<void> {
    const [signature, sigType] = ['1', 'sigType']
    const payload: WebSocketPayload<UpdateIntent> = {
      payload: {
        fromDID: this._account,
        toDID: senderAddress,
        sigType,
        signature,
        status,
      }
    }
    this._socket.emit(EVENTS.W2W_UPDATE_INTENT, payload)
  }
}