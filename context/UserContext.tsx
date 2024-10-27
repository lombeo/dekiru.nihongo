import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define a type for the context value
type UserContextType = {
  user: any; // Replace 'any' with a more specific type if possible
  setUser: React.Dispatch<React.SetStateAction<any>>;
  isLoggedIn: boolean; // Thêm trạng thái đăng nhập
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>; // Thêm phương thức cập nhật trạng thái đăng nhập
};

// Initialize the context with a default value of the correct type
const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null); // Replace 'any' with a more specific type if possible
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false); // Trạng thái đăng nhập

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, isLoggedIn, setIsLoggedIn }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    console.error('useUser must be used within a UserProvider');
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
