export type SocketInputOptions = {
  user: string,
  env: 'dev' | 'staging' | 'prod',
  socketOptions?: SocketOptions
};

export type SocketOptions = {
  autoConnect: boolean,
  reconnectionAttempts?: number
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
