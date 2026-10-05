import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  // Mock auth state
  const [user, setUser] = useState(null);

  const login = (email, password) => {
    // Mock login logic
    if (email && password) {
      setUser({
        name: 'Hasan Mahmud',
        email: email,
        phone: '01711223344'
      });
      return true;
    }
    return false;
  };

  const register = (userData) => {
    // Mock register logic
    setUser({
      name: userData.fullName,
      email: userData.email,
      phone: userData.phone
    });
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  const updateUser = (newDetails) => {
    setUser(prev => ({ ...prev, ...newDetails }));
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoggedIn: !!user,
      login,
      register,
      logout,
      updateUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};
