import { Wallet } from "ethers"
export const generateAccount = (seedPhrase) => {
    try {
        if (!seedPhrase) {
            const account = Wallet.createRandom();
            return account;
        }
        return seedPhrase.includes(" ") ? Wallet.fromPhrase(seedPhrase) : new Wallet(seedPhrase);
    }

    catch (err) {
        // console.log(err);
        throw err; 
    }

}