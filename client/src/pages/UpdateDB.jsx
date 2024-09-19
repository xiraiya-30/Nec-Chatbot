import React, { useState } from 'react';
import Modal from '../components/Modal';

function SearchInterface() {
    const [searchResults, setSearchResults] = useState([
        { id: 'ID01', text: 'Users can input search keywords to find relevant paragraphs from the database.' },
        { id: 'ID02', text: 'Users can input search keywords to find relevant paragraphs from the database.' },
        { id: 'ID03', text: 'Users can input search keywords to find relevant paragraphs from the database.' },
        { id: 'ID04', text: 'Users can input search keywords to find relevant paragraphs from the database.' },
        { id: 'ID03', text: 'Users can input search keywords to find relevant paragraphs from the database.' },
        { id: 'ID04', text: 'Users can input search keywords to find relevant paragraphs from the database.' },
        { id: 'ID04', text: 'Users can input search keywords to find relevant paragraphs from the database.' },
        { id: 'ID03', text: 'Users can input search keywords to find relevant paragraphs from the database.' },
        { id: 'ID04', text: 'Users can input search keywords to find relevant paragraphs from the database.' },
    ]);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSearch = () => {
        // Implement search logic here
    };

    const handleCreateNewEmbedding = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleSaveData = () => {
        // Implement save data logic here
        setIsModalOpen(false);
    };

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-xl font-bold mb-2">Search</h1>
                <p className="mb-4">Find relevant paragraphs from the database by entering keywords below, or add new data to the database.</p>
                <div className="flex items-center">
                    <input 
                        type="text" 
                        placeholder="Enter keywords" 
                        className="border p-2 rounded-l w-full"
                    />
                    <button 
                        onClick={handleSearch}
                        className="bg-gray-500 text-white p-2 rounded-r">
                        Search
                    </button>
                    <button 
                        onClick={handleCreateNewEmbedding}
                        className="bg-blue-500 text-white w-52 p-2 ml-2 rounded">
                        + Add new Data
                    </button>
                </div>
            </div>

            <div>
                <h2 className="text-lg font-semibold mb-4">Search Results :</h2>
                <div className="grid grid-cols-3 gap-4 h-4/5">
                    {searchResults.map(result => (
                        <div key={result.id} className="border rounded p-4">
                            <h3 className="font-bold mb-2">{result.id}</h3>
                            <p className="mb-4">{result.text}</p>
                            <button className="bg-gray-300 p-2 w-full rounded">Edit</button>
                        </div>
                    ))}
                </div>
            </div>

            <Modal 
                isOpen={isModalOpen} 
                onClose={handleCloseModal}
                onSave={handleSaveData}
            />
        </div>
    );
}

export default SearchInterface;
