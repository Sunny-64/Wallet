import React, { useState } from 'react'
import { ethers } from 'ethers';
import { sepolia } from '../chains/sepolia';

const Transaction = ({ account }) => {
    const [receiverAddress, setReceiverAddress] = useState("");
    const [showReceipt, setShowReceipt] = useState(false); 
    const [disableButtonOnSendEth, setDisableButtonOnSendEth] = useState(false); 
    const [txDetails, setTxDetails] = useState({
        blockHash : "", 
        from : "", 
        to : "", 
        logsBloom : ''
    }); 
    // console.log(receiverAddress)

    const sendEth = async (e) => {
        e.preventDefault();
        if (!receiverAddress || receiverAddress.trim() === "") return;
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
            console.log(receipt);
            setTxDetails({
                blockHash : receipt.blockHash, 
                from : receipt.from, 
                to : receipt.to,
                logsBloom : receipt.logsBloom,
            })
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
                    <button type="submit" style={{opacity : disableButtonOnSendEth ? "0.6" : "0.9"}} disabled={disableButtonOnSendEth}>{disableButtonOnSendEth ? "processing..." : "Send"}</button>
                </form>
            </div>
            <hr style={{margin : "20px 0"}}/>
           {
            showReceipt && <>
                <fieldset style={{display : "flex"}}>
                    <legend>Receipt</legend>
                    <p style={{wordWrap : "break-word"}}>Block hash : {txDetails?.blockHash}</p> <br />
                    <p style={{wordWrap : "break-word"}}>From : {txDetails?.from}</p> <br />
                    <p style={{wordWrap : "break-word"}}>To : {txDetails?.to}</p> <br />
                </fieldset>
                </>
            }
        </>
    )
}

export default Transaction