
import React, { createContext, useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import defaultVocabulary from '../data/vocabulary.json';

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
    const [vocabulary, setVocabulary] = useState([]);
    const [isCustom, setIsCustom] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = () => {
        setLoading(true);
        try {
            const storedData = localStorage.getItem('customVocabulary');
            if (storedData) {
                const parsed = JSON.parse(storedData);
                setVocabulary(parsed);
                setIsCustom(true);
            } else {
                setVocabulary(defaultVocabulary);
                setIsCustom(false);
            }
        } catch (err) {
            console.error("Failed to load data", err);
            setVocabulary(defaultVocabulary);
        } finally {
            setLoading(false);
        }
    };

    const uploadData = async (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = (e) => {
                try {
                    const data = new Uint8Array(e.target.result);
                    const workbook = XLSX.read(data, { type: 'array' });
                    const sheetName = workbook.SheetNames[0];
                    const worksheet = workbook.Sheets[sheetName];
                    const jsonData = XLSX.utils.sheet_to_json(worksheet);

                    // Basic validation and transformation
                    const formattedData = jsonData.map((row, index) => ({
                        id: index,
                        german: row['German'] || row['german'] || '',
                        english: row['English'] || row['english'] || '',
                        category: row['Category'] || row['category'] || 'Uncategorized',
                        usage: row['Usage'] || row['usage'] || ''
                    })).filter(item => item.german && item.english); // Filter empty rows

                    if (formattedData.length === 0) {
                        throw new Error("No valid data found in file. Ensure columns are named 'German', 'English', 'Category'.");
                    }

                    localStorage.setItem('customVocabulary', JSON.stringify(formattedData));
                    setVocabulary(formattedData);
                    setIsCustom(true);
                    setError(null);
                    resolve(formattedData.length);
                } catch (err) {
                    setError(err.message);
                    reject(err);
                }
            };

            reader.onerror = (err) => {
                setError("File reading failed");
                reject(err);
            };

            reader.readAsArrayBuffer(file);
        });
    };

    const resetData = () => {
        localStorage.removeItem('customVocabulary');
        setVocabulary(defaultVocabulary);
        setIsCustom(false);
        setError(null);
    };

    return (
        <DataContext.Provider value={{ vocabulary, isCustom, loading, error, uploadData, resetData }}>
            {children}
        </DataContext.Provider>
    );
};
