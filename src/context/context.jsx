
import { useContext, useState, createContext } from "react";
export const appContext = createContext()
export const AppContextProvider = ({ children }) => {
    const environment = "PROD"
    //const environment = "DEV"
    let URL;
    if (environment == "DEV") {
        URL = "http://localhost:1000"
    }
    if (environment == "PROD") {
        URL = "https://assignment-b-rust.vercel.app"
        
    }

    const value = {
        URL,
    }
    return <appContext.Provider value={value}>{children}</appContext.Provider>;
}