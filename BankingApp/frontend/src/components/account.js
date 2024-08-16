import React, { useState } from "react";

function Account({ accountType, balance, onDeposit, onWithdraw }) {
    const [amount, setAmount] = useState(0); // amount to deposit or withdraw

    return (
        <div className="card mb-4 account-card">
            <div className="card-body">
                <h3 className="card-title">{accountType.charAt(0).toUpperCase() + accountType.slice(1)} Account</h3>
                <p className="card-text">Balance: ${balance}</p>
                <div className="form-group">
                    <label>Amount</label>
                    <input type="number" className="form-control" value={amount}
                           onChange={(e) => setAmount(parseFloat(e.target.value))}/>
                </div>
                <button className="btn btn-primary mr-2 mb-2 deposit-button" onClick={() => onDeposit(accountType, amount)}>Deposit</button>
                <button className="btn btn-secondary mb-2" onClick={() => onWithdraw(accountType, amount)}>Withdraw</button>
            </div>
        </div>
    );
}

export default Account;
