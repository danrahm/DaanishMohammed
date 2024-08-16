import React from "react";

function Transactions({ transactions }) {
    return (
        <div className="mt-4 transaction-history">

            <h4 className="transaction-history-label">Transaction History</h4>
            <table className="table table-striped">
                <thead>
                <tr>
                    <th>Date</th>
                    <th>Account</th>
                    <th>Amount</th>
                    <th>Type</th>
                </tr>
                </thead>
                <tbody>
                {transactions.map((transaction, index) => (
                    <tr key={index}>
                        <td>{new Date(transaction.date).toLocaleString()}</td>
                        <td>{transaction.account}</td>
                        <td>{transaction.amount}</td>
                        <td>{transaction.type}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default Transactions;
