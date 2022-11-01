export type SocketInputOptions = {
  user: string,
  env: string,
  isChat: boolean
  socketOptions?: SocketOptions,
};

export type SocketOptions = {
  autoConnect: boolean,
  reconnectionAttempts?: number,
}

export type Environment = 'dev' | 'staging' | 'prod';
export type MessageType = 'Text';
export const EVENTS = {
  W2W_RECEIVED_MESSAGE: 'w2wReceivedMessage',
  W2W_SEND_MESSAGE: 'w2wSendMessage',
  W2W_CREATE_INTENT: 'w2wCreateIntent',
  W2W_UPDATE_INTENT: 'w2wUpdateIntent',
};

export interface Message {
  fromCAIP10: string;
  toCAIP10: string;
  fromDID: string;
  toDID: string;
  messageType: string;
  messageContent: string;
  signature: string;
  sigType: string;
  timestamp?: number;
  encType: string;
  encryptedSecret: string;
}

export interface UpdateIntent {
  fromDID: string,
  toDID: string,
  signature: string,
  status: string,
  sigType: string,
}

export interface WebSocketPayload<T> {
  payload: T
}

/**
 * TODO define types for 
 * 
 * ServerToClientEvents
 * ClientToServerEvents
 * SocketData
 * 
 * like https://socket.io/docs/v4/typescript/
 */
