import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  // Mock auth state
  const [user, setUser] = useState(null);

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const login = (email, password) => {
    // Mock login logic
    if (email && password) {
      if (email === 'admin@neeramoy.com') {
        setUser({
          name: 'Neeramoy Admin',
          email: email,
          phone: '01911223344',
          role: 'ADMIN'
        });
      } else {
        setUser({
          name: 'Hasan Mahmud',
          email: email,
          phone: '01711223344',
          role: 'CUSTOMER',
          addresses: [
            {
              id: '1',
              name: 'Hasan Mahmud',
              phone: '01711223344',
              address: 'House 42, Road 7/A',
              city: 'Dhaka',
              area: 'Dhanmondi',
              postalCode: '1209',
              isDefault: true
            }
          ],
          address: 'House 42, Road 7/A',
          city: 'Dhaka',
          area: 'Dhanmondi',
          postalCode: '1209'
        });
      }
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
    setIsLoggingOut(true);
    setUser(null);
    setTimeout(() => setIsLoggingOut(false), 100);
  };

  const updateUser = (newDetails) => {
    setUser(prev => ({ ...prev, ...newDetails }));
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoggedIn: !!user,
      isLoggingOut,
      login,
      register,
      logout,
      updateUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};
