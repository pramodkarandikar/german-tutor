
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
        <div className="max-w-6xl mx-auto p-4 md:p-8 animate-[fade-in_0.5s_cubic-bezier(0.19,1,0.22,1)] pb-24">
            <div className="mb-6 text-center md:text-left">
                <h1 className="text-4xl md:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 mb-3">
                    Settings.
                </h1>
                <p className="text-base md:text-lg text-text-muted max-w-2xl font-light">
                    Manage your vocabulary data and application state.
                </p>
            </div>

            <div className="flex flex-col gap-16">
                <div className="flex flex-col gap-6">
                    <div className="flex items-center gap-6 mb-8 border-b-2 border-subtle dark:border-subtle pb-8">
                        <div className={`w-14 h-14 rounded-full flex items-center justify-center shrink-0 ${isCustom ? 'bg-text text-background' : 'bg-surface border-2 border-subtle text-text'}`}>
                            <FileSpreadsheet size={28} strokeWidth={2} />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-text mb-1 tracking-tight">Current Data Source</h3>
                            <p className="text-text-muted text-lg">
                                {isCustom ? 'Custom File' : 'Default App Data'}
                                <span className="mx-3 opacity-30">•</span>
                                <span className="font-mono bg-text/5 px-2 py-0.5 rounded">{vocabulary.length} words</span>
                            </p>
                        </div>
                    </div>

                    <div className="border-b-2 border-subtle dark:border-subtle pb-12">
                        <h4 className="text-3xl font-bold text-text mb-4 tracking-tight">Upload New Data</h4>
                        <p className="text-lg text-text-muted mb-8 font-light">
                            Upload an Excel (.xlsx) file with columns: <strong>German</strong>, <strong>English</strong>, <strong>Category</strong>, <strong>Usage</strong>.
                        </p>

                        <div className="flex flex-col md:flex-row gap-6 md:items-center">
                            <label className="flex-1 relative">
                                <input
                                    type="file"
                                    accept=".xlsx, .xls"
                                    onChange={handleFileChange}
                                    ref={fileInputRef}
                                    disabled={uploading}
                                    className="block w-full text-base text-text-muted
                                      file:mr-6 file:py-3 file:px-6
                                      file:rounded-full file:border-2 file:border-transparent
                                      file:text-base file:font-bold
                                      file:bg-text file:text-background
                                      hover:file:scale-[1.02] hover:file:shadow-lg file:transition-all
                                      cursor-pointer disabled:opacity-50"
                                />
                            </label>
                            {uploading && <span className="text-lg font-medium animate-pulse text-text-muted">Processing...</span>}
                        </div>
                    </div>

                    {isCustom && (
                        <div className="mt-8">
                            <button
                                onClick={handleReset}
                                className="inline-flex items-center gap-3 text-red-600 dark:text-red-400 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/10 px-6 py-3 rounded-full text-lg font-bold transition-all"
                            >
                                <Trash2 size={20} strokeWidth={2.5} />
                                Reset to Default Data
                            </button>
                        </div>
                    )}

                    {message && (
                        <div className={`mt-8 p-6 rounded-2xl flex items-start gap-4 border-2 ${message.type === 'success' ? 'border-primary/20 bg-primary/5 text-primary' : 'border-red-500/20 bg-red-500/5 text-red-600'}`}>
                            {message.type === 'success' ? <CheckCircle size={24} strokeWidth={2.5} className="mt-1 shrink-0" /> : <AlertCircle size={24} strokeWidth={2.5} className="mt-1 shrink-0" />}
                            <div>
                                <p className="text-lg font-bold">{message.type === 'success' ? 'Success' : 'Error'}</p>
                                <p className="text-lg opacity-90">{message.text}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-24 max-w-2xl border-l-[4px] border-border pl-6 py-2">
                <h5 className="font-bold flex items-center gap-3 mb-3 text-xl tracking-tight">
                    <AlertCircle size={20} strokeWidth={2.5} /> Privacy Note
                </h5>
                <p className="text-text-muted text-lg leading-relaxed font-light">
                    Your uploaded data is processed entirely in your browser and saved to your device's local storage.
                    It serves as a "Dynamic Update" mechanism. No data is sent to any server.
                </p>
            </div>
        </div>
    );
};

export default Settings;
