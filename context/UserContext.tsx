import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define a type for the context value
type UserContextType = {
  user: any; // Replace 'any' with a more specific type if possible
  setUser: React.Dispatch<React.SetStateAction<any>>;
};

// Initialize the context with a default value of the correct type
const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null); // Replace 'any' with a more specific type if possible

  useEffect(() => {
    // Load user data from local storage on initial load
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
