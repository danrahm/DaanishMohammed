import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
 
// Context
import { UserProvider } from "./UserContext";
import ProtectedRoute from "./ProtectedRoute";
 
// Components
import Admin from "./components/admin.js";
import Customer from "./components/customer.js";
import CreateAccount from "./components/createAccount.js";
import Login from "./components/login.js";
import EmployeePage from "./components/employee.js";
import LoggedOut from "./components/logOut.js";
 
const App = () => {
  return (
    <div className="container">
      <Router>
        <Routes>
            <Route path="/admin" element={<Admin />} />
            <Route path="/login" element={<Login />} />
            <Route path="/customer" element={<Customer />} />
            <Route path="/createAccount" element={<CreateAccount />} />
            <Route path="/employee" element={<EmployeePage />} />
            <Route path="/logOut" element={<LoggedOut />} />
        </Routes>
      </Router>
    </div>
  );
}
 
export default App;