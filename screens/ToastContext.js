// ToastContext.js
import React, { createContext, useState, useContext } from 'react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [globalToast, setGlobalToast] = useState(null);

  return (
    <ToastContext.Provider value={{ globalToast, setGlobalToast }}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);