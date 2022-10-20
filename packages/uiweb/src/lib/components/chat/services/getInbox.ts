import { getFromIPFS, getInbox } from '../api';
import { decryptFeeds } from '../crypto';
import { ConnectedUser, Feeds, InboxChat, MessageIPFS } from '../types';
import { walletToCAIP10 } from '../utils';

const fetchInbox = async (userId: string): Promise<Feeds[] | null> => {
    let inbox: Feeds[] | null = await getInbox(userId)
    if (inbox) {
        inbox = inbox.filter((inbx) => inbx.intent?.includes(userId))
        inbox = await fetchMessagesFromIPFS(inbox)
    }
    return inbox
}

export const fetchInboxApi = async (account: string, chainId: number, connectedUser: ConnectedUser): Promise<Feeds[] | null> => {
    let inboxes: Feeds[] | null = await fetchInbox(walletToCAIP10({ account, chainId }));
    if (inboxes) {
        inboxes = await decryptFeeds({ feeds: inboxes, connectedUser });
    }
    return inboxes;
};

const fetchMessagesFromIPFS = async (inbox: Feeds[]): Promise<Feeds[]> => {
    for (const i in inbox) {
        if (inbox[i]?.threadhash) {
            const current = await getFromIPFS(inbox[i].threadhash!)
            const msgIPFS: MessageIPFS = current as MessageIPFS

            const msg: InboxChat = {
                name: inbox[i].wallets.split(',')[0].toString(),
                profilePicture: inbox[i].profilePicture!,
                lastMessage: msgIPFS.messageContent,
                timestamp: msgIPFS.timestamp!,
                messageType: msgIPFS.messageType,
                signature: msgIPFS.signature,
                signatureType: msgIPFS.sigType,
                encType: msgIPFS.encType,
                fromDID: msgIPFS.fromDID,
                toDID: msgIPFS.toDID,
                encryptedSecret: msgIPFS.encryptedSecret,
                fromCAIP10: msgIPFS.fromCAIP10,
                toCAIP10: msgIPFS.toCAIP10
            }
            // if (msg.lastMessage.length > 25) {
            //   msg.lastMessage = msg.lastMessage.slice(0, 25) + '...'
            // }
            inbox[i] = { ...inbox[i], msg }
        } else {
            const msg: InboxChat = {
                name: inbox[i].wallets.split(',')[0].toString(),
                profilePicture: inbox[i].profilePicture,
                lastMessage: null,
                encType: null,
                timestamp: null,
                messageType: null,
                signature: null,
                signatureType: null,
                fromDID: null,
                toDID: null,
                encryptedSecret: null,
                fromCAIP10: null,
                toCAIP10: null
            }
            inbox[i] = { ...inbox[i], msg }
        }
    }
    inbox?.sort((a, b) => (a.msg?.timestamp! < b.msg?.timestamp! ? 1 : -1))
    return inbox
}