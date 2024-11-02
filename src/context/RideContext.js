import React, { createContext, useContext, useState } from 'react';

const RideContext = createContext();

export const RideProvider = ({ children }) => {

  const [id, setId] = useState();
  const [token, setToken] = useState();

  return (
    <RideContext.Provider
      value={{
        id, 
        setId,
        token,
        setToken,
      }}
    >
      {children}
    </RideContext.Provider>
  );
};

export const useRideContext = () => {
  const context = useContext(RideContext);
  if (!context) {
    throw new Error('useRideContext must be used within a RideProvider');
  }
  return context;
};
