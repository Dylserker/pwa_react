/**
 * Composant de barre de recherche
 */

import React, { useState } from 'react';

interface SearchBarProps {
    onSearch: (query: string) => Promise<void>;
    disabled?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, disabled = false }) => {
    const [query, setQuery] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await onSearch(query);
        setQuery('');
    };

    return (
        <form onSubmit={handleSubmit} className="search-bar">
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Entrez un nom de ville..."
                disabled={disabled}
                className="search-input"
                autoComplete="off"
            />
            <button
                type="submit"
                disabled={disabled || !query.trim()}
                className="search-btn"
            >
                Rechercher
            </button>
        </form>
    );
};
