import React, { useEffect, useState } from "react";
import  { useNavigate } from "react-router";
import "./logOut.css";


export default function LogOut () {
    // Used to store the status
    const [status, setStatus] = useState("");
    const navigate = useNavigate();

    useEffect(()=> {
        async function run() {
            // Make a request to the backend to logout the user
            const response = await fetch(`http://localhost:4000/session_delete`,
                {
                    method: "GET",
                    credentials: "include"  
                }
            );
            if(!response.ok){
                // the request fails informs the user
                const message = `An error occurred: ${response.statusText}`;
                window.alert(message);
                return;
            }
            const statusResponse = await response.json();
            setStatus(statusResponse.status);
        }
        run();
        return;
    }, []);

    async function buttonPressed() {
        navigate("/login")
    }


    return (
        <div className="logOut-container">
            <h3 className="logOut-title">Logged out</h3>
            <p className="logOut-p">You have successfully been logged out</p>
            <button 
                className="logOut-button" 
                type="button"
                onClick={buttonPressed}>Go to login page</button>
        </div>
    );
}