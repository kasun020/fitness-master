import { createContext, useContext, useState } from "react";

import axios from "axios";

const BASE_URL = "http://localhost:5000/register/"


const GlobalContext = createContext();

export const useGlobalContext = () => useContext(GlobalContext);


export const GlobalProvider = ({children}) => {

    const [ users, setUsers ] = useState(null);


    const getAll = async () => {
        const response = await axios.get(`${BASE_URL}`)
        setUsers(response);
        console.log(response);
    }


    const [activeSection, setActiveSection] = useState("Home"); // State to manage the active section

    const handleSidebarClick = (item) => {
        setActiveSection(item);
    };
    


    return (
        <GlobalContext.Provider value={{
            activeSection,
            setActiveSection,
            handleSidebarClick,
            getAll,
            users
        }}>
            {children}
        </GlobalContext.Provider>
    )
}