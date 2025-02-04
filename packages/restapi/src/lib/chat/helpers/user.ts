import Constants, { ENV } from '../../constants';
import { get, create } from '../../user';
import { IConnectedUser, IUser, SignerType, walletType } from '../../types';
import { getAccountAddress } from './wallet';
import { getDecryptedPrivateKey } from '.';

export const createUserIfNecessary = async (
  wallet: walletType,
  env:  ENV,
): Promise<IUser> => {
  const address = await getAccountAddress(wallet);
  const connectedUser = await get({ account: address, env });
  if (!connectedUser?.encryptedPrivateKey) {
    const createUserProps: {
      account?: string;
      signer?: SignerType;
      env?:  ENV;
    } = {};
    if (wallet.account) {
      createUserProps.account = wallet.account;
    }
    if (wallet.signer) {
      createUserProps.signer = wallet.signer;
    }
    createUserProps.env = env;
    const createdUser: IUser = await create(createUserProps);
    return createdUser;
  } else {
    return connectedUser;
  }
};

export const getConnectedUser = async (
  wallet: walletType,
  privateKey: string | null,
  env:  ENV
): Promise<IConnectedUser> => {
  const address = await getAccountAddress(wallet);
  const user = await get({ account: address, env: env || Constants.ENV.PROD });
  if (user?.encryptedPrivateKey) {
    if (privateKey) {
      return { ...user, privateKey };
    }
    else {
      throw new Error(`Decrypted pgp private key required as input`);
    }
  }
  else {
    const createUserProps: {
      account?: string;
      signer?: SignerType;
      env?:  ENV;
    } = {};
    if (wallet.account) {
      createUserProps.account = wallet.account;
    }
    if (wallet.signer) {
      createUserProps.signer = wallet.signer;
    }
    createUserProps.env = env;
    const newUser = await create(createUserProps);
    const decryptedPrivateKey = await getDecryptedPrivateKey(wallet, newUser, address);
    return { ...newUser, privateKey: decryptedPrivateKey };
  }
};


export const getConnectedUserV2 = async (
  wallet: walletType,
  privateKey: string | null,
  env: ENV
): Promise<IConnectedUser> => {
  const address = await getAccountAddress(wallet);
  const user = await get({ account: address, env: env || Constants.ENV.PROD });
  if (user?.encryptedPrivateKey) {
    if (privateKey) {
      return { ...user, privateKey };
    }
    else {
    console.warn("Please note that if you don't pass the pgpPrivateKey parameter, a wallet popup will appear every time the approveRequest endpoint is called. We strongly recommend passing this parameter, and it will become mandatory in future versions of the API.");
    const decryptedPrivateKey = await getDecryptedPrivateKey(wallet, user, address);
    return { ...user, privateKey: decryptedPrivateKey };
    }
  }
  else {
    const createUserProps: {
      account?: string;
      signer?: SignerType;
      env?: ENV;
    } = {};
    if (wallet.account) {
      createUserProps.account = wallet.account;
    }
    if (wallet.signer) {
      createUserProps.signer = wallet.signer;
    }
    createUserProps.env = env;
    const newUser = await create(createUserProps);
    const decryptedPrivateKey = await getDecryptedPrivateKey(wallet, newUser, address);
    return { ...newUser, privateKey: decryptedPrivateKey };
  }
};