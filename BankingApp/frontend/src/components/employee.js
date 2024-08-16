import React, { useEffect, useState } from "react";
import  { useNavigate } from "react-router";
import "bootstrap/dist/css/bootstrap.min.css";
import "./employee.css";
 
const EmployeePage = () => {
  const [customerId, setCustomerId] = useState("");
  const [amount, setAmount] = useState("");
  const [targetCustomerId, setTargetCustomerId] = useState("");
  const [accountDetails, setAccountDetails] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState("");
  
    const navigate = useNavigate();
  
  useEffect(() => {
    // Checks if the user is logged in
    async function getSession() {
        const loggedIn = await fetch("http://localhost:4000/session_get", // Checks user session data
            {
                method: "GET",
                credentials: "include"
            }
        );
        if(!loggedIn.ok){ // if no session data exists
            navigate("/login"); 

        } else {
            const response = await fetch("http://localhost:4000/getUser", // Gets current user from session data
                {
                    method: "GET",
                    credentials: "include"
                }
            );
            let user = await response.json();
            if(user.role === "Administrator"){ // Checks the current user role
            
            } 
            else if(user.role==='Employee'){
                
            }
            else {
                // if not admin relocate to home page
                
                    navigate("/customer")

            }
        }
    }
    getSession();
    
    return;
},[]); 
  const handleViewAccount = async () => {
    try {
      const response = await fetch(`http://localhost:4000/customer/${customerId}`,{
          method:'GET',
        credentials: 'include',
      });
      const data = await response.json();
      if (response.ok) {
        setAccountDetails(data);
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred');
    }
  };
 
  const handleDeposit = async () => {
    try {
      const response = await fetch(`http://localhost:4000/customer/${customerId}/deposit`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ account: selectedAccount, amount: parseFloat(amount) }),
      });
 
      const data = await response.json();
      if (response.ok) {
        alert(`Deposited $${amount} into ${customerId}'s ${selectedAccount} account`);
        console.log(data);
        setAccountDetails(data); // Update account details with response from backend
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred');
    }
  };
 
  const handleWithdraw = async () => {
    try {
      const response = await fetch(`http://localhost:4000/customer/${customerId}/withdraw`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ account: selectedAccount, amount: parseFloat(amount) }),
      });
 
      const data = await response.json();
      if (response.ok) {
        alert(`Withdrew $${amount} from ${customerId}'s ${selectedAccount} account`);
        console.log(data);
        setAccountDetails(data); // Update account details with response from backend
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred');
    }
  };
 
  const handleTransfer = async () => {
    try {
      const response = await fetch(`http://localhost:4000/customer/${customerId}/transfer`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fromAccount: selectedAccount, // Account from which money is transferred
          targetCustomerId, // Customer ID to which money is transferred
          amount: parseFloat(amount)
        }),
      });
 
      const data = await response.json();
      if (response.ok) {
        alert(`Transferred $${amount} from ${customerId}'s ${selectedAccount} to ${targetCustomerId}`);
        console.log(data);
        setAccountDetails(data); // Update account details with response from backend
      } else {
        alert(data.message); // Show error message from the server
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred');
    }
  };
 
  return (
<div className="container mt-5">
<div className="employee-container p-4">
<h2>Employee Dashboard</h2>
<div className="form-group">
<label>Customer ID</label>
<input
            type="text"
            className="form-control"
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
          />
</div>
<button className="btn btn-primary mb-3" onClick={handleViewAccount}>
          View Account
</button>
        {accountDetails && (
<div className="account-details">
<h4>Account Details</h4>
<p>Savings: ${accountDetails.accounts.savings}</p>
<p>Checking: ${accountDetails.accounts.checking}</p>
<p>Investment: ${accountDetails.accounts.investment}</p>
<h4>Transactions</h4>
<ul>
              {accountDetails.transactions.map((txn, index) => (
<li key={index}>
                  {txn.date} - {txn.type} of ${txn.amount} in {txn.account}
</li>
              ))}
</ul>
</div>
        )}
<div className="form-group">
<label>Amount</label>
<input
            type="number"
            className="form-control"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
</div>
<div className="form-group">
<label>Account Type</label>
<div className="radio-group">
<label>
<input
                type="radio"
                value="savings"
                checked={selectedAccount === "savings"}
                onChange={(e) => setSelectedAccount(e.target.value)}
              />
<span>Savings</span>
</label>
<label>
<input
                type="radio"
                value="checking"
                checked={selectedAccount === "checking"}
                onChange={(e) => setSelectedAccount(e.target.value)}
              />
<span>Checking</span>
</label>
<label>
<input
                type="radio"
                value="investment"
                checked={selectedAccount === "investment"}
                onChange={(e) => setSelectedAccount(e.target.value)}
              />
<span>Investment</span>
</label>
</div>
</div>
<button className="btn btn-success mb-3" onClick={handleDeposit}>
          Deposit
</button>
<button className="btn btn-warning mb-3" onClick={handleWithdraw}>
          Withdraw
</button>
<div className="form-group">
<label>Target Customer ID</label>
<input
            type="text"
            className="form-control"
            value={targetCustomerId}
            onChange={(e) => setTargetCustomerId(e.target.value)}
          />
</div>
<button className="btn btn-info" onClick={handleTransfer}>
          Transfer
</button>
</div>
</div>
  );
};
 
export default EmployeePage;