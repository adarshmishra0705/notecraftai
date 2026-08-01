import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export function AppProvider({ children }) {
    const [apiKey, setApiKey] = useState(() => {
        return localStorage.getItem('groq_api_key') || '';
    });
    const [isDemoMode, setIsDemoMode] = useState(() => {
        const stored = localStorage.getItem('demo_mode');
        return stored !== null ? stored === 'true' : false;
    });
    
    // Uploaded file data (in memory) to pass between Dashboard and Processing
    const [uploadData, setUploadData] = useState(null);

    useEffect(() => {
        localStorage.setItem('groq_api_key', apiKey);
    }, [apiKey]);

    useEffect(() => {
        localStorage.setItem('demo_mode', isDemoMode);
    }, [isDemoMode]);

    return (
        <AppContext.Provider value={{ apiKey, setApiKey, uploadData, setUploadData, isDemoMode, setIsDemoMode }}>
            {children}
        </AppContext.Provider>
    );
}

export function useAppContext() {
    return useContext(AppContext);
}
