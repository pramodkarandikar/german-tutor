
import React, { useState, useContext, useRef } from 'react';
import { Upload, Trash2, CheckCircle, AlertCircle, FileSpreadsheet } from 'lucide-react';
import { DataContext } from '../contexts/DataContext';

const Settings = () => {
    const { isCustom, uploadData, resetData, vocabulary, error } = useContext(DataContext);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState(null); // { type: 'success' | 'error', text: '' }
    const fileInputRef = useRef(null);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        setMessage(null);

        try {
            const count = await uploadData(file);
            setMessage({ type: 'success', text: `Successfully loaded ${count} words!` });
            if (fileInputRef.current) fileInputRef.current.value = '';
        } catch (err) {
            setMessage({ type: 'error', text: err.message || "Failed to upload file." });
        } finally {
            setUploading(false);
        }
    };

    const handleReset = () => {
        if (window.confirm("Are you sure you want to delete your custom data and revert to the default vocabulary?")) {
            resetData();
            setMessage({ type: 'success', text: "Reverted to default vocabulary." });
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="flex justify-between items-end mb-8 px-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-text mb-2">Settings</h1>
                    <p className="text-text-muted">Manage your vocabulary data</p>
                </div>
            </div>

            <div className="bg-surface rounded-2xl shadow-xl overflow-hidden border border-border">
                <div className="p-8">
                    <div className="flex items-center gap-4 mb-6">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isCustom ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400' : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'}`}>
                            <FileSpreadsheet size={24} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-text">Current Data Source</h3>
                            <p className="text-text-muted text-sm">
                                {isCustom ? 'Custom File (LocalStorage)' : 'Default App Data'}
                                <span className="mx-2">•</span>
                                {vocabulary.length} words
                            </p>
                        </div>
                    </div>

                    <div className="border-t border-border py-6">
                        <h4 className="font-semibold text-text mb-4">Upload New Data</h4>
                        <p className="text-sm text-text-muted mb-4">
                            Upload an Excel (.xlsx) file with columns: <strong>German</strong>, <strong>English</strong>, <strong>Category</strong>, <strong>Usage</strong>.
                        </p>

                        <div className="flex gap-4 items-center">
                            <label className="flex-1">
                                <input
                                    type="file"
                                    accept=".xlsx, .xls"
                                    onChange={handleFileChange}
                                    ref={fileInputRef}
                                    disabled={uploading}
                                    className="block w-full text-sm text-text-muted
                                      file:mr-4 file:py-2.5 file:px-4
                                      file:rounded-full file:border-0
                                      file:text-sm file:font-semibold
                                      file:bg-blue-50 dark:file:bg-blue-900/30 file:text-blue-700 dark:file:text-blue-300
                                      hover:file:bg-blue-100 dark:hover:file:bg-blue-800/30
                                      cursor-pointer disabled:opacity-50"
                                />
                            </label>
                            {uploading && <span className="text-sm text-text-muted">Processing...</span>}
                        </div>
                    </div>

                    {isCustom && (
                        <div className="border-t border-border pt-6 mt-2">
                            <button
                                onClick={handleReset}
                                className="flex items-center gap-2 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 text-sm font-medium transition-colors"
                            >
                                <Trash2 size={16} />
                                Reset to Default Data
                            </button>
                        </div>
                    )}

                    {message && (
                        <div className={`mt-6 p-4 rounded-xl flex items-start gap-3 ${message.type === 'success' ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'}`}>
                            {message.type === 'success' ? <CheckCircle size={20} className="mt-0.5" /> : <AlertCircle size={20} className="mt-0.5" />}
                            <div>
                                <p className="font-semibold">{message.type === 'success' ? 'Success' : 'Error'}</p>
                                <p className="text-sm opacity-90">{message.text}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl text-sm text-blue-800 dark:text-blue-300 border border-blue-100 dark:border-blue-900/50">
                <h5 className="font-bold flex items-center gap-2 mb-2">
                    <AlertCircle size={16} /> Note on Privacy
                </h5>
                <p>
                    Your uploaded data is processed entirely in your browser and saved to your device's local storage.
                    It serves as a "Dynamic Update" mechanism. No data is sent to any server.
                </p>
            </div>
        </div>
    );
};

export default Settings;
