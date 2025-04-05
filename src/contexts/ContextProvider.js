import React, { createContext, useContext, useState, useMemo } from "react";
import PropTypes from "prop-types";

const StateContext = createContext();

export function ContextProvider({ children }) {
  const storedAuth = localStorage.getItem("authTicket");
  const [auth, setAuth] = useState(JSON.parse(storedAuth) || null);
  const [isMainLanding, setIsMainLanding] = useState(false);
  const [closeMenus, setCloseMenus] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [newTicketsCount, setNewTicketsCount] = useState(0);

  // Method to update the new tickets count
  const updateNewTicketsCount = (count) => {
    setNewTicketsCount(count);
  };

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
      newTicketsCount,
      updateNewTicketsCount, // Added function to update the count
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
      newTicketsCount,
    ]
  );

  console.log(newTicketsCount);

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
