export const walletToCAIP10 = ({ account, chainId }: { account: string; chainId: number }): string => {
    if (account.includes('eip155:')) {
        return account
    }
    return 'eip155:' + account
}

export const caip10ToWallet = (wallet: string): string => {
    wallet = wallet.replace('eip155:', '')
    return wallet
}

