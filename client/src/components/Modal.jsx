import React, { useState } from 'react';

function Modal({ isOpen, onClose, onSave }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-1/2 relative">
                <h2 className="text-2xl font-bold mb-4">Create Data</h2>
                <p className="mb-4">Enter the data that needs to be added to the Chat bot DB below:</p>
                <textarea 
                    className="border p-2 w-full h-32 mb-4" 
                    placeholder="New data goes here..."
                />
                <div className="flex justify-end">
                    <button 
                        onClick={onSave}
                        className="bg-blue-500 text-white px-4 py-2 rounded mr-2">
                        Save
                    </button>
                    <button 
                        onClick={onClose}
                        className="bg-gray-300 px-4 py-2 rounded">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Modal;
