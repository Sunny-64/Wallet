import React, {useContext, useEffect, useState} from "react"; 
import {ethers} from "ethers"; 
import {sepolia} from './../chains/sepolia'

// import AccountContext from '../context/accountContext';

const AccountDetails = ({account}) => {
    // const {account} = useContext(AccountContext); 
    const [balance, setBalance] = useState(0); 
    
    useEffect(() => {
        const fetchData = async () => {
            const provider = new ethers.JsonRpcProvider(sepolia.rpcUrl);
            let accountBalance = await provider.getBalance(account.publicKey);
            setBalance(ethers.formatEther(accountBalance))
        }
        fetchData(); 
 
    }, [])
    return (
        <>
        <div style={{overflow : "hidden"}}>
            <h2 className="address" style={{marginBottom : "10px"}}><a className="text-white txt-4xl font-semibold" href={`https://sepolia.etherscan.io/address/${account?.publicKey}`} target='_blank'>{account?.publicKey}</a></h2>
            {/* <strong>Balance : {parseFloat(balance).toFixed(2).replace(/0+$/, '')}</strong>  */}
            <strong className="font-bold text-2xl text-[#a5f3fc]">BALANCE : {(Math.floor(parseFloat(balance) * 1000) / 1000).toFixed(3)} ETH</strong>
        </div>
        </>
    )
}

export default AccountDetails