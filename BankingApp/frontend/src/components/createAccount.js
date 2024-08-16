import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import "./createAccount.css"
 
export default function NewAccount () {
    // Used to move to another page
    const navigate = useNavigate();
 
    // a Json object to store a new account
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        userName: "",
        phoneNumber: "",
        password: "",
        role: ""
    });
 
    // Updates the Json object
    function updateForm(jsonObj){
        return setForm((prevJsonObj) => {
            return {...prevJsonObj, ...jsonObj};
        });
    }
 
    useEffect(() => {
        async function getUser() {
            const loggedIn = await fetch("http://localhost:4000/session_get", // Checks loggin status
                {
                    method: "GET",
                    credentials: "include"
                }
            );
            if(loggedIn.status === 200)
            {
                const currentUser = await fetch("http://localhost:4000/getUser", // gets current user from session data
                    {
                        method: "GET",
                        credentials: "include"
                    }
                );
                const user = await currentUser.json();
                if(user.role === "Customer"){
                    navigate("/customer");
                }
            } else {
                navigate("/login");
            }
            
        }
        getUser();
 
        return;
    })
    //  Gets called once the submit button is clicked
    // Send the data to the backend to save the new object
    // If the email entered is already in the use it will let the user know
    async function onSubmit(e) {
        e.preventDefault();
        // Creates the object to send to the backend
        const newPerson = {...form};

        if(newPerson.firstName === "" || newPerson.lastName === "" || newPerson.email === "" || newPerson.userName === "" 
            || newPerson.phoneNumber === "" || newPerson.password === "" || newPerson.role === ""){
            window.alert("Please fill out all infomation");
        } else {
                    // Creates a request to the backend to add the new user
            const response = await fetch("http://localhost:4000/createUser", { // Place holder for backend
                method: "POST",
                credentials: "include",  
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newPerson),
            })
            .catch(error => {
                // Lets the user know if something went wrong with the request
                window.alert(error);
                return;
            });
            // If the status returns ok status
            if(response.ok){
                const newUser = await response.json();
                let userID = newUser.id;
                // Display the account number from the backend
                window.alert("User was successfully added and there user id is: " + userID);
                setForm( {firstName: "",
                    lastName: "",
                    email: "",
                    userName: "",
                    phoneNumber: "",
                    password: ""})
            } else {
                // Notifies the user that the email is already taken
                window.alert("The user already exists in the system");
            }
        }
 
    }
    // HTML for the page and functionality it needs to work
    return (
        <div className="createAccount-container">
            <h3>Create Account</h3>
            <form onSubmit={onSubmit}>
            <div>
                <label>First Name: </label>
                <input
                        type="text"
                        id="firstName"
                        value={form.firstName}
                        onChange={(e) => updateForm({ firstName: e.target.value})}
                    />
                </div>
            <div>
                <label>Last Name: </label>
                <input
                        type="text"
                        id="lastName"
                        value={form.lastName}
                        onChange={(e) => updateForm({ lastName: e.target.value})}
                    />
                </div>
            <div>
                <label>User Name: </label>
                <input
                        type="text"
                        id="userName"
                        value={form.userName}
                        onChange={(e) => updateForm({ userName: e.target.value})}
                    />
            </div>
            <div>
                <label>Email: </label>
                <input
                        type="text"
                        id="email"
                        value={form.email}
                        onChange={(e) => updateForm({ email: e.target.value})}
                    />
            </div>
 
            <div>
                <label>Phone Number: </label>
                <input
                        type="text"
                        id="phoneNumber"
                        value={form.phoneNumber}
                        onChange={(e) => updateForm({ phoneNumber: e.target.value})}
                    />
            </div>
 
            <div>
                <label>Password: </label>
                <input
                        type="text"
                        id="password"
                        value={form.password}
                        onChange={(e) => updateForm({ password: e.target.value})}
                    />
            </div>
            <div className="role-section">
                <div className="radio-group">
                    <input
                            type="radio"
                            id="Customer"
                            value="Customer"
                            name="role"
                            onChange={(e) => updateForm({role : e.target.value})}/>
                    <label htmlFor="Customer">Customer</label>
                </div>
                <div className="radio-group">
                    <input
                            type="radio"
                            id="Administrator"
                            value="Administrator"
                            name="role"
                            onChange={(e) => updateForm({role : e.target.value})}/>
                    <label htmlFor="Administrator">Administrator</label>
                </div>
                <div className="radio-group">
                    <input
                            type="radio"
                            id="Employee"
                            value="Employee"
                            name="role"
                            onChange={(e) => updateForm({role : e.target.value})}/>
                    <label htmlFor="Employee">Employee</label>
                </div>
            </div>
        <br/>
    <div>
        <input
                        type="submit"
                        value="Create Account"
                    />
        </div>
    </form>
</div>
    );
}