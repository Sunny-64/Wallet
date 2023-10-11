import React, { useState } from 'react'
import { ethers } from 'ethers';
import { sepolia } from '../chains/sepolia';

const Transaction = ({ account }) => {
    const [receiverAddress, setReceiverAddress] = useState("");
    const [showReceipt, setShowReceipt] = useState(false); 
    const [disableButtonOnSendEth, setDisableButtonOnSendEth] = useState(false); 
    const [amount, setAmount] = useState(0); 
    const [txDetails, setTxDetails] = useState({
        hash : "", 
        from : "", 
        to : "", 
        logsBloom : ''
    }); 

    const sendEth = async (e) => {
        e.preventDefault();
        if (!receiverAddress || receiverAddress.trim() === "") return;
        if(!amount || amount <= 0) return; 
        const provider = new ethers.JsonRpcProvider(sepolia.rpcUrl);
        const signer = new ethers.Wallet(account.privateKey, provider);
        try {
            setDisableButtonOnSendEth(true); 
            const tx = await signer.sendTransaction({
                to: receiverAddress,
                value: ethers.parseEther("0.001")
            });

            // Often you may wish to wait until the transaction is mined
            const receipt = await tx.wait();
            console.log(receipt.logsBloom);
            let txR = {
                hash : receipt.hash, 
                from : receipt.from, 
                to : receipt.to,
                logsBloom : receipt.logsBloom,
                amount : amount,
            }
            setTxDetails(txR); 

            let txArr = localStorage.getItem("receipts") ?? []; 
            txArr.push(txR); 
            localStorage.setItem("receipts", JSON.stringify(txArr)); 
            setDisableButtonOnSendEth(false);
            setShowReceipt(true); 
        }
        catch (err) {
            if (err.message === "no such account") {
                alert("no such account");
                return;
            }
            alert(err.message);
        }
    }

    console.log("txr", JSON.parse(localStorage.getItem("receipts"))); 

    return (
        <>
            <div>
                <p>Send ETH :</p>
                <form className="input-form" onSubmit={sendEth}>
                    <input
                        type="text"
                        placeholder="Enter receiver's Address"
                        value={receiverAddress}
                        onChange={(e) => setReceiverAddress(e.target.value)}
                    />
                    <input
                        type="number"
                        placeholder="Enter Amount in ETH"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                    />
                    <button type="submit" style={{opacity : disableButtonOnSendEth ? "0.6" : "0.9"}} disabled={disableButtonOnSendEth}>{disableButtonOnSendEth ? "processing..." : "Send"}</button>
                </form>
            </div>
            <hr style={{margin : "20px 0"}}/>
           {
            showReceipt && <>
                <fieldset style={{display : "flex", flexDirection : "column", flexWrap : "wrap"}}>
                    <legend>Receipt</legend>
                    <p style={{wordWrap : "break-word", width : "360px"}}>Block hash : <a href={sepolia.blockExplorer + "/tx/" + txDetails.hash}>{txDetails?.hash}</a></p> <br />
                    <p style={{wordWrap : "break-word", width : "360px"}}>From : {txDetails?.from}</p> <br />
                    <p style={{wordWrap : "break-word", width : "360px"}}>To : {txDetails?.to}</p> <br />
                </fieldset>
                </>
            }
        </>
    )
}

export default Transaction