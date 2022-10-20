import { MessageIPFS, MessageIPFSWithCID } from "../types"

let BASE_URL = 'https://backend.epns.io/apis'

export const getFromIPFS = async (cid: string): Promise<MessageIPFSWithCID> => {
    const response: any = await fetch(BASE_URL + '/v1/ipfs/' + cid, {
        method: 'GET',
        headers: {
            'content-Type': 'application/json'
        }
    })
    const messageIPFS: MessageIPFS = await response.json()
    const messageIPFSWithCID: MessageIPFSWithCID = { ...messageIPFS, cid }
    return messageIPFSWithCID
}

export const postIPFS = async (data: string): Promise<string> => {
    const response: any = await fetch(BASE_URL + '/v1/ipfs/upload', {
        method: 'POST',
        headers: {
            'content-Type': 'application/json'
        },
        body: JSON.stringify({
            data
        })
    })
    const cidResponse: { cid: string } = await response.json()
    return cidResponse.cid
}
