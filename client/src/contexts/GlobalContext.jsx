import { createContext, useContext, useState } from "react";


const GlobalContext = createContext();

export const useGlobalContext = () => useContext(GlobalContext);


export const GlobalProvider = ({children}) => {
    const [activeSection, setActiveSection] = useState("Home"); // State to manage the active section

    const handleSidebarClick = (item) => {
        setActiveSection(item);
    };
    


    return (
        <GlobalContext.Provider value={{
            activeSection,
            setActiveSection,
            handleSidebarClick
        }}>
            {children}
        </GlobalContext.Provider>
    )
}