import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export function AppProvider({ children }) {
    const [apiKey, setApiKey] = useState(() => {
        return localStorage.getItem('groq_api_key') || '';
    });
    const [isDemoMode, setIsDemoMode] = useState(() => {
        const stored = localStorage.getItem('demo_mode');
        return stored !== null ? stored === 'true' : true;
    });
    
    // Uploaded file data (in memory) to pass between Dashboard and Processing
    const [uploadData, setUploadData] = useState(null);

    // Saved decks from localStorage
    const [savedDecks, setSavedDecks] = useState(() => {
        const stored = localStorage.getItem('notecraft_saved_decks');
        try {
            return stored ? JSON.parse(stored) : [];
        } catch (e) {
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem('groq_api_key', apiKey);
    }, [apiKey]);

    useEffect(() => {
        localStorage.setItem('demo_mode', isDemoMode);
    }, [isDemoMode]);

    useEffect(() => {
        localStorage.setItem('notecraft_saved_decks', JSON.stringify(savedDecks));
    }, [savedDecks]);

    return (
        <AppContext.Provider value={{ apiKey, setApiKey, uploadData, setUploadData, isDemoMode, setIsDemoMode, savedDecks, setSavedDecks }}>
            {children}
        </AppContext.Provider>
    );
}

export function useAppContext() {
    return useContext(AppContext);
}
