import React, { useState, useCallback } from 'react';
import { X, Search } from 'lucide-react';

interface CustomSearchProps {
    value: string;
    onChange: (value: string) => void;
    onSearch: (value: string) => void;
    placeholder?: string;
    error?: string | null;
    onClear?: () => void;
    className?: string;
    inputClassName?:string
}

const CustomSearch: React.FC<CustomSearchProps> = ({
    value,
    onChange,
    onSearch,
    placeholder = "Search...",
    error,
    onClear,
    className = "",
    inputClassName =""
}) => {
    const [isFocused, setIsFocused] = useState(false);

    const handleKeyPress = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            onSearch(value.trim());
        }
    }, [value, onSearch]);

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const trimmedValue = e.target.value.trim();
        onChange(trimmedValue);
    }, [onChange]);

    const handleClear = useCallback(() => {
        onChange('');
        onClear?.();
    }, [onChange, onClear]);

    const handleSearch = useCallback(() => {
        onSearch(value.trim());
    }, [value, onSearch]);

    return (
        <div className={`relative ${className}`}>
            <div className={`relative flex items-center w-full rounded-lg border transition-all duration-200 ${
                error 
                    ? 'border-red-500 focus-within:border-red-600' 
                    : isFocused 
                        ? 'border-blue-500 focus-within:border-blue-600' 
                        : 'border-gray-300 focus-within:border-gray-400'
            }`}>
                <input
                    type="text"
                    value={value}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => {
                        setIsFocused(false);
                        if (value !== value.trim()) {
                            onChange(value.trim());
                        }
                    }}
                    placeholder={placeholder}
                    className={`w-full h-9 px-4 pr-20 text-sm sm:text-base rounded-lg outline-none bg-white ${
                        error ? 'text-red-900 placeholder-red-300' : 'text-gray-900 placeholder-gray-400'
                    } ${inputClassName}`}
                />
                <div className="absolute right-0 flex items-center h-full">
                    {value && (
                        <button
                            onClick={handleClear}
                            className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200 bg-transparent outline-none border-none"
                            aria-label="Clear input"
                        >
                            <X size={18} className="stroke-[2.5]" />
                        </button>
                    )}
                    <button
                        onClick={handleSearch}
                        className={`h-full px-4 flex items-center justify-center rounded-r-lg transition-colors duration-200 bg-transparent border-none outline-none ${
                            error
                                ? 'bg-red-500 text-white'
                                : ' text-white'
                        }`}
                        aria-label="Search"
                    >
                        <Search size={18} className="stroke-[2.5]" />
                    </button>
                </div>
            </div>
            {error && (
                <div className="text-red-600 text-xs mt-1">{error}</div>
            )}
        </div>
    );
};

export default CustomSearch; 