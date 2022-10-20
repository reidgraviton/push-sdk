import { approveIntent } from "../api";
import { ConnectedUser } from "../types";

export function checkConnectedUser(connectedUser: ConnectedUser): boolean {
    if (
        !(
            connectedUser.allowedNumMsg === 0 &&
            connectedUser.numMsg === 0 &&
            connectedUser.about === '' &&
            connectedUser.signature === '' &&
            connectedUser.encryptedPrivateKey === '' &&
            connectedUser.publicKey === ''
        )
    ) {
        return true;
    } else return false;
}

const createUserIfNecessary = async (connectedUser: ConnectedUser): Promise<{ createdUser: ConnectedUser }> => {
    try {
        if (!checkConnectedUser(connectedUser)) {
            // This is a new user
            setBlockedLoading({
                enabled: true,
                title: 'Step 1/4: Generating secure keys for your account',
                progressEnabled: true,
                progress: 30,
                progressNotice:
                    'This step is is only done for first time users and might take a few seconds. PGP keys are getting generated to provide you with secure yet seamless chat',
            });
            await new Promise((r) => setTimeout(r, 200));

            const keyPairs = await generateKeyPair();
            setBlockedLoading({
                enabled: true,
                title: 'Step 2/4: Encrypting your keys',
                progressEnabled: true,
                progress: 60,
                progressNotice: 'Please sign the transaction to continue. Steady lads, chat is almost ready!',
            });

            const walletPublicKey = await CryptoHelper.getPublicKey(account);
            const encryptedPrivateKey = CryptoHelper.encryptWithRPCEncryptionPublicKeyReturnRawData(
                keyPairs.privateKeyArmored,
                walletPublicKey
            );
            const caip10: string = w2wHelper.walletToCAIP10({ account, chainId });
            setBlockedLoading({
                enabled: true,
                title: 'Step 3/4: Syncing account info',
                progressEnabled: true,
                progress: 85,
                progressNotice: 'This might take a couple of seconds as push nodes sync your info for the first time!',
            });

            const createdUser: User = await PushNodeClient.createUser({
                caip10,
                did: caip10,
                publicKey: keyPairs.publicKeyArmored,
                encryptedPrivateKey: JSON.stringify(encryptedPrivateKey),
                encryptionType: 'x25519-xsalsa20-poly1305',
                signature: 'xyz',
                sigType: 'a',
            });
            const createdConnectedUser = { ...createdUser, privateKey: keyPairs.privateKeyArmored };
            setConnectedUser(createdConnectedUser);

            setBlockedLoading({
                enabled: false,
                title: 'Step 4/4: Done, Welcome to Push Chat!',
                spinnerType: LOADER_SPINNER_TYPE.COMPLETED,
                progressEnabled: true,
                progress: 100,
            });
            return { createdUser: createdConnectedUser };
        } else {
            return { createdUser: connectedUser };
        }
    } catch (e) {
        console.log(e);
    }
};

async function ApproveIntent(status: string): Promise<void> {
    setMessageBeingSent(true);
    const { createdUser } = await createUserIfNecessary();
    // We must use createdUser here for getting the wallet instead of using the `account` since the user can be created at the moment of sending the intent
    const updatedIntent: string = await approveIntent(
        currentChat.intentSentBy,
        createdUser.wallets.split(',')[0],
        status,
        '1',
        'sigType'
    );
    let activeChat = currentChat;
    activeChat.intent = updatedIntent;

    await resolveThreadhash();
}