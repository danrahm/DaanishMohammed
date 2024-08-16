import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from './UserContext';
 
const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user } = useUser();
 
    console.log("User:", user); // Debugging line
    console.log("Allowed Roles:", allowedRoles); // Debugging line
 
    if (!user) {
        console.log("No user, redirecting to login"); // Debugging line
        return <Navigate to="/login" />;
    }
 
    if (!allowedRoles.includes(user.role)) {
        console.log("User role not allowed, redirecting to login"); // Debugging line
        return <Navigate to="/login" />;
    }
 
    return children;
};
 
export default ProtectedRoute;