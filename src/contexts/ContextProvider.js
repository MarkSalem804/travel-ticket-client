import React, { createContext, useContext, useState, useMemo } from "react";
import PropTypes from "prop-types";

const StateContext = createContext();

export function ContextProvider({ children }) {
  const storedAuth = localStorage.getItem("authCSM");
  const [auth, setAuth] = useState(JSON.parse(storedAuth) || null);
  const [isMainLanding, setIsMainLanding] = useState(false);
  const [closeMenus, setCloseMenus] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");

  const contextValue = useMemo(
    () => ({
      auth,
      setAuth,
      isMainLanding,
      setIsMainLanding,
      closeMenus,
      setCloseMenus,
      selectedCategory,
      setSelectedCategory,
    }),
    [
      auth,
      setAuth,
      isMainLanding,
      setIsMainLanding,
      closeMenus,
      setCloseMenus,
      selectedCategory,
      setSelectedCategory,
    ]
  );

  return (
    <StateContext.Provider value={contextValue}>
      {children}
    </StateContext.Provider>
  );
}

export const useStateContext = () => useContext(StateContext);

ContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
