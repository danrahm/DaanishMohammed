import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function AccountBalances() {
    const [users, setUsers] = useState([]);
    const [amount, setAmount] = useState('');
    const [accountType, setAccountType] = useState('checking');
    const navigate = useNavigate();

    async function fetchUsers() {
        try {
            const response = await axios.get('http://localhost:3000/account/users', { withCredentials: true });
            setUsers(response.data); // Assuming response.data is an array of users
        } catch (error) {
            console.error('Error fetching users:', error);
            navigate('/login');
        }
    }
    
    useEffect(() => {
        async function fetchUsers() {
            try {
                const response = await axios.get('http://localhost:3000/account/users', { withCredentials: true });
                setUsers(response.data); // Assuming response.data is an array of users
            } catch (error) {
                console.error('Error fetching users:', error);
                navigate('/login');
            }
        }

        fetchUsers();
    }, [navigate]);

    const handleDeposit = async () => {
        try {
            await axios.post('http://localhost:3000/account/deposit', { amount: parseFloat(amount), accountType }, { withCredentials: true });
            setAmount('');
            // Reload users after deposit
            fetchUsers();
        } catch (error) {
            console.error('Error depositing money:', error);
        }
    };

    const handleWithdraw = async () => {
        try {
            await axios.post('http://localhost:3000/account/withdraw', { amount: parseFloat(amount), accountType }, { withCredentials: true });
            setAmount('');
            // Reload users after withdrawal
            fetchUsers();
        } catch (error) {
            console.error('Error withdrawing money:', error);
        }
    };

    const handleLogout = async () => {
        try {
            await axios.post('http://localhost:3000/account/logout', null, { withCredentials: true });
            sessionStorage.removeItem('userId');
            navigate('/login');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    return (
        <div>
            <h1>Account Balances</h1>
            <Link to="/summary">Account Summary</Link>
            <button onClick={handleLogout}>Logout</button>
            {users.map((user, index) => (
                <div key={index}>
                    <h2>User: {user.firstName} {user.lastName}</h2>
                    <p>Checking: ${user.checking}</p>
                    <p>Savings: ${user.savings}</p>
                </div>
            ))}
            <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Amount"
            />
            <select value={accountType} onChange={(e) => setAccountType(e.target.value)}>
                <option value="checking">Checking</option>
                <option value="savings">Savings</option>
            </select>
            <button onClick={handleDeposit}>Deposit</button>
            <button onClick={handleWithdraw}>Withdraw</button>
        </div>
    );
}

export default AccountBalances;
