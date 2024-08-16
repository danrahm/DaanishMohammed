import React, { useEffect, useState } from "react";
import  { useNavigate } from "react-router";
import "./admin.css"


export default function AccountInfo () {
    // Variables used to store the user information from the backend
    const [form, setForm] = useState({userID: "", role: ""});
    const [firstName, setFirstName] = useState();
    const [lastName, setLastName] = useState();


    // Used to navigate to a new page
    const navigate = useNavigate();

    useEffect(() => {
        // Checks if the user is logged in
        async function getAdmin() {
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
                    setFirstName(user.firstName);
                    setLastName(user.lastName);
                } else {
                    // if not admin relocate to home page
                    console.log(user.role);
                    if(user.role === "Customer"){
                        navigate("/customer")
                    } else {
                        navigate("/employee")
                    }
                }
            }
        }
        getAdmin();
        
        return;
    },[]); 

    // Used to update the Json object from the form
    function updateForm(jsonObj){
        return setForm((prevJsonObj) => {
            return {...prevJsonObj, ...jsonObj};
        });
    }
    

    async function onSubmit(e) {
        let response;
        e.preventDefault();

        // Json object for the login information
        const updatedUser = {
            ...form
        };
        if(updatedUser.user == "" || updatedUser.role == ""){
            window.alert("Please fill out all information");
        } else {
                // sends a request to the backend to login the usr
            response = await fetch(`http://localhost:4000/updateRole`, { // TO DO make route to save updated information
            method: "POST",
            headers: {
                "Content-Type" : "application/json",
            },
            body: JSON.stringify(updatedUser),
        })
        .catch(error => {
            // If the request has an issue
            window.alert(error);
            return;
        });
        // If the role was updated correct
        if(response.status === 200){
           window.alert("User "+ form.userID +" role as been updated")
           setForm({userID: ""});
        } else {
            // If the user was information was incorrect
            window.alert("Not a valid user");
        }
        }
    }

    // HTML page
    return (
    <div className="admin-container">
        <h3>Update Role</h3>
        <p>Hello {firstName} {lastName}</p>
        <p>What user would you like to update?</p>
        <form onSubmit={onSubmit}>
            <div>
                <label>User ID: </label>
                <input
                    type="text"
                    id="user"
                    value={form.userID}
                    onChange={(e) => updateForm({ userID: e.target.value})}
                />
            </div>
            <div>
                <div>
                <label>Role: </label>
                <input 
                        type="radio" 
                        id="Customer" 
                        value= "Customer" 
                        name="role"
                        onChange={(e) => updateForm({role : e.target.value})}/>
                    <label for="Customer">Customer   </label>
                <input 
                        type="radio" 
                        id="Administrator" 
                        value= "Administrator" 
                        name="role"
                        onChange={(e) => updateForm({role : e.target.value})}/>
                    <label for="Administrator">Administrator   </label>
                <input 
                        type="radio" 
                        id="Employee" 
                        value= "Employee" 
                        name="role"
                        onChange={(e) => updateForm({role : e.target.value})}/>
                    <label for="Employee">Employee</label>
                </div>
            </div>
            <br/>
            <div>
                <input
                    type="submit"
                    value="Update Role"
                />
            </div>
            <div>
                <h4>Other available pages</h4>
                <ul>
                    <li><a href="http://localhost:3000/customer">Customers Page</a></li>
                    <li><a href="http://localhost:3000/employee">Employee Page</a></li>
                    <li><a href="http://localhost:3000/createAccount">Create Account Page</a></li>
                </ul>
            </div>
        </form>
    </div>
    );
}
