import React, { useContext, useEffect, useState } from 'react';
import { generateAccount } from '../utils/accountUtils';
import AccountDetails from './AccountDetails';
import Transaction from './Transaction'
import { sepolia } from '../chains/sepolia';
import { ethers } from 'ethers';

const SeedAccount = () => {

  const [toggleInput, setToggleInput] = useState(false);
  const [seedPhrase, setSeedPhrase] = useState('');
  const [account, setAccount] = useState({
    publicKey: JSON.parse(localStorage.getItem("account"))?.publicKey,
    privateKey: JSON.parse(localStorage.getItem("account"))?.privateKey,
    balance: JSON.parse(localStorage.getItem("account"))?.balance
  });
  const [toggleBal, setToggleBal] = useState(false);

  useEffect(() => {
    if (account.publicKey) {
      setToggleBal(true);
    }
  }, [])

  const createAccount = (e) => {
    e.preventDefault();
    const accountInfo = generateAccount();

    let acc = {
      publicKey: accountInfo.address,
      privateKey: accountInfo.signingKey.privateKey,
      balance: 0,
    }
    setAccount(acc);

    localStorage.setItem("account", JSON.stringify(acc));

    setToggleBal(true)
  };

  const handleGetAccountWithSeedPhrase = async (e) => {
    e.preventDefault();
    try {
      if (!seedPhrase) return;

      const accountInfo = generateAccount(seedPhrase);
      // console.log("seed ph ", accountInfo.address)
      const provider = new ethers.JsonRpcProvider(sepolia.rpcUrl);
      let accountBalance = await provider.getBalance("0x8dA5B5B68686c133E0646d024ba7ED681bD18095");

      let acc = {
        publicKey: accountInfo.address,
        privateKey: accountInfo.signingKey.privateKey,
        balance: Number(accountBalance),
      }
      setAccount(acc);

      setToggleBal(true);

      localStorage.setItem("account", JSON.stringify(acc));
    }
    catch (err) {
      console.log(err)
      alert("invalid private key or mnemonic phrase")
    }
  };

  const toggleShowBalance = (e) => {
    e.preventDefault();
    setToggleBal(!toggleBal);
  }

  const logout = (e) => {
    e.preventDefault();
    localStorage.clear();
    window.location.reload();
  }
  return (
    <div className="seed-account-card">
      <div className="buttons">
        {!account?.publicKey &&
          <>
            <button className="create-button" onClick={createAccount}>
              Create Account
            </button>

            <button
              className="recover-button"
              onClick={() => setToggleInput(!toggleInput)}
            >
              Recover Wallet
            </button>
          </>}
      </div>
      {toggleInput && (
        <form className="input-form" onSubmit={handleGetAccountWithSeedPhrase}>
          <input
            type="text"
            placeholder="Enter Mnemonic phrase"
            value={seedPhrase}
            onChange={(e) => setSeedPhrase(e.target.value)}
          />
          <button type="submit">Login</button>
        </form>
      )}

      {account.publicKey &&
        <>
          <hr style={{ marginTop: "10px", marginBottom: "10px" }} />
          <button className='create-button' onClick={toggleShowBalance}>Show Balance</button>
        </>
      }
      {toggleBal && <AccountDetails account={account} />}
      <hr style={{ marginTop: "10px" }} />
      {account.publicKey && <Transaction account={account} />}

      <hr style={{ margin: "20px 0" }} />

      {account.publicKey && <button className='create-button bg-[#4f46e5]'  onClick={logout}>Logout</button>}
    </div>
  );
};

export default SeedAccount;
