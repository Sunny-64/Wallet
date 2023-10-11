import React, { useContext, useState } from 'react';
import { generateAccount } from '../utils/accountUtils';
import AccountDetails from './AccountDetails';
import Transaction from './Transaction'
const SeedAccount = () => {
  // const [accountDetails, setAccountDetails] = useState<Account>();

  const [toggleInput, setToggleInput] = useState(false);
  const [seedPhrase, setSeedPhrase] = useState('');
  const [account, setAccount] = useState({}); 
  const [toggleBal, setToggleBal] = useState(false); 

 

  const createAccount = (e) => {
    e.preventDefault();
    const accountInfo = generateAccount(); 

    setAccount({
      publicKey : accountInfo.address, 
      privateKey : accountInfo.signingKey.privateKey, 
      balance : 0
    });

    setToggleBal(true)

  };

  const handleGetAccountWithSeedPhrase = (e) => {
    e.preventDefault();
    try{
        if (!seedPhrase) return;
        const accountInfo = generateAccount(seedPhrase); 
        setAccount({
          publicKey : accountInfo.address, 
          privateKey : accountInfo.signingKey.privateKey, 
        });
        // setAccountDetails(generateAccount(seedPhrase));
        setToggleBal(true)
    }
    catch(err){
        alert("invalid private key or mnemonic phrase")
    }
  };

  const toggleShowBalance = (e) => {
    e.preventDefault(); 
    setToggleBal(!toggleBal); 
  }

//   console.log(account);

  return (
    <div className="seed-account-card">
      <div className="buttons">
        <button className="create-button" onClick={createAccount}>
          Create Account
        </button>
        <button
          className="recover-button"
          onClick={() => setToggleInput(!toggleInput)}
        >
          Recover Wallet
        </button>
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
        <hr style={{marginTop : "10px", marginBottom : "10px"}}/>
        <button onClick={toggleShowBalance}>Show Balance</button>
      </>
      }
      {toggleBal && <AccountDetails account={account}/>}
      <hr style={{marginTop : "10px"}} />
      {account.publicKey && <Transaction account={account}/>}
    </div>
  );
};

export default SeedAccount;
