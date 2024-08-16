import React, { createContext, useContext, useState, useEffect } from 'react';
 
const UserContext = createContext();
 
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Retrieve user from local storage if available
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
 
  useEffect(() => {
    // Store user in local storage when it changes
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);
 
  return (
<UserContext.Provider value={{ user, setUser }}>
      {children}
</UserContext.Provider>
  );
};
 
export const useUser = () => {
  return useContext(UserContext);
};