import React, { createContext, useState, useContext } from 'react';

const IconContext = createContext();

export const IconProvider = ({ children }) => {
  const [isIconPressable, setIsIconPressable] = useState(false);
  const [showBottomSheet, setShowBottomSheet] = useState(false);

  return (
    <IconContext.Provider value={{ isIconPressable, setIsIconPressable, showBottomSheet, setShowBottomSheet }}>
      {children}
    </IconContext.Provider>
  );
};

export const useIcon = () => useContext(IconContext);