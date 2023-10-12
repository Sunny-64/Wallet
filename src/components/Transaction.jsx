import React, { useEffect, useState } from 'react'
import { ethers } from 'ethers';
import { sepolia } from '../chains/sepolia';

const Transaction = ({ account }) => {
    const [receiverAddress, setReceiverAddress] = useState("");
    const [showReceipt, setShowReceipt] = useState(false);
    const [disableButtonOnSendEth, setDisableButtonOnSendEth] = useState(false);
    const [amount, setAmount] = useState(0);

    const [receipts, setReceipts] = useState(JSON.parse(localStorage.getItem("receipts")));
    const [txDetails, setTxDetails] = useState({
        hash: "",
        from: "",
        to: "",
        logsBloom: ''
    });

    useEffect(() => {
    }, [localStorage.getItem("receipts")])

    const sendEth = async (e) => {
        e.preventDefault();
        if (!receiverAddress || receiverAddress.trim() === "") return;
        if (!amount || amount <= 0) return;
        const provider = new ethers.JsonRpcProvider(sepolia.rpcUrl);
        const signer = new ethers.Wallet(account.privateKey, provider);
        try {
            setDisableButtonOnSendEth(true);
            const tx = await signer.sendTransaction({
                to: receiverAddress,
                value: ethers.parseEther(amount)
            });

            // Often you may wish to wait until the transaction is mined
            const receipt = await tx.wait();
            let txR = {
                hash: receipt.hash,
                from: receipt.from,
                to: receipt.to,
                logsBloom: receipt.logsBloom,
                amount: amount,
            }
            setTxDetails(txR);
            localStorage.setItem("receipts", JSON.stringify([...JSON.parse(localStorage.getItem("receipts")), txR]));
            setDisableButtonOnSendEth(false);
            setShowReceipt(true);
            window.location.reload();
        }
        catch (err) {
            if (err.message === "no such account") {
                alert("no such account");
                return;
            }
            alert(err.message);
        }
    }

    const toggleShowReceipt = (e) => {
        e.preventDefault();
        setShowReceipt(!showReceipt)
    }
    console.log("receipts", JSON.parse(localStorage.getItem("receipts")));

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
                    <button type="submit" style={{ opacity: disableButtonOnSendEth ? "0.6" : "0.9" }} disabled={disableButtonOnSendEth}>{disableButtonOnSendEth ? "processing..." : "Send"}</button>
                </form>
            </div>
            <hr style={{ margin: "20px 0" }} />
            <button onClick={toggleShowReceipt}>Show Receipts..</button>
            {
                showReceipt && <>
                    {JSON.parse(localStorage.getItem("receipts"))?.map((item, index) => 
                            <fieldset key={index} style={{ display: "flex", flexDirection: "column", flexWrap: "wrap" }}>
                                <legend>Receipt</legend>
                                <p style={{ wordWrap: "break-word", width: "360px" }}>Block hash : <a href={sepolia.blockExplorer + "/tx/" + item.hash}>{item?.hash}</a></p> <br />
                                <p style={{ wordWrap: "break-word", width: "360px" }}>From : {item?.from}</p> <br />
                                <p style={{ wordWrap: "break-word", width: "360px" }}>To : {item?.to}</p> <br />
                                <p style={{ wordWrap: "break-word", width: "360px" }}>Amount : {item?.amount}</p> <br />
                            </fieldset>
                    )}
                </>
            }
        </>
    )
}

export default Transaction