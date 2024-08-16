import React, { useState, useEffect } from 'react';
import Account from './account';
import Transactions from './transactions';
import 'bootstrap/dist/css/bootstrap.min.css';
import './customer.css';

function GetCustomer() {
    const [customer, setCustomer] = useState(null);
    const [error, setError] = useState(null);
    const [selectedAccount, setSelectedAccount] = useState('savings'); // State to keep track of the selected account


    useEffect(() => {
        async function getCustomer() {
            try {
                const response = await fetch(`http://localhost:4000/customer`, {
                    method: 'GET',
                    credentials: "include"
                });
                if (response.ok) {
                    const customerData = await response.json();
                    setCustomer(customerData);
                } else {
                    const errorData = await response.json();
                    setError(errorData.message);
                }
            } catch (error) {
                setError(error.message);
            }
        }
        getCustomer();
    }, []);

    // Function to clear transactions on the page
    const clearTransactions = async () => {
        const response = await fetch(`http://localhost:4000/customer/clearTransactions`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' }
        });
        const data = await response.json();
        setCustomer(data);
    };

    // Function to deposit money into the account
    const depositTransactions = async (account, amount) => {
        try {
            const response = await fetch(`http://localhost:4000/customer/deposit`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ account, amount })
            });
            if (response.ok) {
                const data = await response.json();
                setCustomer(data);
            } else {
                const errorData = await response.json();
                setError(errorData.message);
            }
        } catch (error) {
            setError(error.message);
        }
    };

    // Function to withdraw money from the account
    const withdrawTransactions = async (account, amount) => {
        try {
            const response = await fetch(`http://localhost:4000/customer/withdraw`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ account, amount })
            });
            if (response.ok) {
                const data = await response.json();
                setCustomer(data);
            } else {
                const errorData = await response.json();
                setError(errorData.message);
            }
        } catch (error) {
            setError(error.message);
        }
    };

    // Function to transfer money between accounts
    const transferTransactions = async (fromAccount, toAccount, amount) => {
        try {
            const response = await fetch(`http://localhost:4000/customer/transfer`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fromAccount, toAccount, amount })
            });
            if (response.ok) {
                const data = await response.json();
                setCustomer(data);
            } else {
                const errorData = await response.json();
                setError(errorData.message);
            }
        } catch (error) {
            setError(error.message);
        }
    };

    // Function to filter transactions based on the selected account
    const filterTransactions = (transactions, account) => {
        return transactions.filter(transaction => transaction.account === account);
    }

    // If customer data is not available, display a warning message
    if (!customer || !customer.accounts) return <div className="alert alert-warning" role="alert">No customer data available</div>;

    return (
        <div className="container">
            <h2 className="my-4 center-heading">Customer Page</h2>
            {error && (
                <div className="alert alert-danger error-message" role="alert">
                    {error}
                    <button type="button" className="close" onClick={() => setError(null)}>
                        <span>&times;</span>
                    </button>
                </div>
            )}
            <div className="row">
                <div className="col-md-4">
                    {customer.accounts && (
                        <Account accountType="savings" balance={customer.accounts.savings} onDeposit={depositTransactions} onWithdraw={withdrawTransactions} />
                    )}
                </div>
                <div className="col-md-4">
                    {customer.accounts && (
                        <Account accountType="checking" balance={customer.accounts.checking} onDeposit={depositTransactions} onWithdraw={withdrawTransactions} />
                    )}
                </div>
                <div className="col-md-4">
                    {customer.accounts && (
                        <Account accountType="investment" balance={customer.accounts.investment} onDeposit={depositTransactions} onWithdraw={withdrawTransactions} />
                    )}
                </div>
            </div>
            <div className="row mt-4">
                <div className="col-md-12">
                    <h3 className="transfer-money-label">Transfer Money</h3>
                    <form onSubmit={(e) => { e.preventDefault(); transferTransactions(e.target.fromAccount.value, e.target.toAccount.value, parseFloat(e.target.amount.value)); }}>
                        <div className="form-group">
                            <label>From Account</label>
                            <select name="fromAccount" className="form-control">
                                <option value="savings">Savings</option>
                                <option value="checking">Checking</option>
                                <option value="investment">Investment</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>To Account</label>
                            <select name="toAccount" className="form-control">
                                <option value="savings">Savings</option>
                                <option value="checking">Checking</option>
                                <option value="investment">Investment</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Amount</label>
                            <input type="number" name="amount" className="form-control" required />
                        </div>
                        <button type="submit" className="btn btn-primary btn-spacing">Transfer</button>
                    </form>
                </div>
            </div>
            <div className="transaction-history">
                <h3 className="overall-transaction-history-label">Full Account Transaction History</h3>
                <Transactions transactions={customer.transactions} />
            </div>
            <div className="row mt-4">
                <div className="col-md-12">
                    <h3 className="transaction-history-label">Individual Account Transactions</h3>
                    <div className="form-group">
                        <label>Select Account</label>
                        <select value={selectedAccount} onChange={(e) => setSelectedAccount(e.target.value)} className="form-control">
                            <option value="savings">Savings</option>
                            <option value="checking">Checking</option>
                            <option value="investment">Investment</option>
                        </select>
                    </div>
                    <Transactions transactions={filterTransactions(customer.transactions, selectedAccount)} />
                </div>
            </div>
            <button className="btn btn-danger mt-4" onClick={clearTransactions}>Clear Page</button>
        </div >
    );
}

export default GetCustomer;
