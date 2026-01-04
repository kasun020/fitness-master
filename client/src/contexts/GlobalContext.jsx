import { createContext, useContext, useState } from "react";

import { api } from "../services/api";

const GlobalContext = createContext();

export const useGlobalContext = () => useContext(GlobalContext);

export const GlobalProvider = ({ children }) => {
  const [users, setUsers] = useState(null);

  const getAll = async () => {
    // Default admin list: approved registrations (includes older pending records)
    const response = await api.get(`/register/approved`);
    setUsers(response.data);
  };

  const getRejected = async () => {
    const response = await api.get(`/register/rejected`);
    setUsers(response.data);
  };

  const updateStatus = async (id, status, adminNotes) => {
    const response = await api.patch(`/register/${id}/status`, {
      status,
      adminNotes,
    });
    return response.data;
  };

  const [activeSection, setActiveSection] = useState("Home"); // State to manage the active section

  const handleSidebarClick = (item) => {
    setActiveSection(item);
  };

  return (
    <GlobalContext.Provider
      value={{
        activeSection,
        setActiveSection,
        handleSidebarClick,
        getAll,
        getRejected,
        updateStatus,
        users,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
