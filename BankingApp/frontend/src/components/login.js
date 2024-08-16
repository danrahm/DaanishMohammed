import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import "./login.css";

//Define Login 
export default function Login() {
    // Manage Username and Password
  const [form, setForm] = useState({ userID: "", password: "" });

  const navigate = useNavigate();
  

  useEffect(() => {
    // Checks if the user is logged in
    async function getUser() {
        const loggedIn = await fetch("http://localhost:4000/session_get", // Checks user session data
            {
                method: "GET",
                credentials: "include"
            }
        );
        if(loggedIn.ok){ // if session data exists
            const response = await fetch("http://localhost:4000/getUser", // Gets current user from session data
              {
                  method: "GET",
                  credentials: "include"
              }
          );
          let user = await response.json(); 
          switch (user.role) {
            case 'Administrator': 
              navigate("/admin");
              break;
            case 'Customer':
              navigate("/customer");
              break;
            case 'Employee':
              navigate("/employee");
              break;
            default:
              window.alert("Invalid role");
          }

        }
    }
    getUser();
    
    return;
},[]); 


 // function to update form state with new credentials
  function updateForm(jsonObj) {
    setForm(prevJsonObj => ({ ...prevJsonObj, ...jsonObj }));
  }

 // function to handle form submission
  async function onSubmit(e) {
    e.preventDefault(); // prevent default submissions
    const loginInfo = { userID: form.userID, password: form.password };
 
    try {
        // Send login info to server for authentication
      const response = await fetch(`http://localhost:4000/userLogin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginInfo),
      });
      
      if (response.ok) {
        const user = await response.json();
        
        await fetch(`http://localhost:4000/session_set/${user.id}`,
          {
              method: "GET",
              credentials: "include"  
          }
      )
        // Routes based on user's roles
        switch (user.role) {
          case 'Administrator': 
            navigate("/admin");
            break;
          case 'Customer':
            navigate("/customer");
            break;
          case 'Employee':
            navigate("/employee");
            break;
          default:
            window.alert("Invalid role");
        }
      } else {
        window.alert("The username and/or password was not correct");
      }
    } catch (error) {
      window.alert("The username and/or password was not correct");
    }
  }
 
  return (

    <div className="login-container">
    <h3 className="login-title">Login</h3>
    <form onSubmit={onSubmit}>
    <div>
    <label className="login-label">User ID: </label>
    <input
                type="text"
                id="userName"
                className="login-input"
                value={form.userID}
                onChange={(e) => updateForm({ userID: e.target.value })}
            />
    </div>
    <div>
    <label className="login-label">Password: </label>
    <input
                type="password"
                id="password"
                className="login-input"
                value={form.password}
                onChange={(e) => updateForm({ password: e.target.value })}
            />
    </div>
    <br />
    <div>
    <input
                type="submit"
                className="login-submit"
                value="Login"
            />
    </div>
    </form>
    </div>
    );
    }