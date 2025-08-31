import React, { useState, useRef, useEffect } from 'react';
import { Search, X, History, TrendingUp, Clock } from 'lucide-react';
import { SearchSuggestion } from '../types';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: (query: string) => void;
  suggestions: SearchSuggestion[];
  placeholder?: string;
  showSuggestions?: boolean;
  searchHistory?: string[];
  onSuggestionClick?: (suggestion: SearchSuggestion) => void;
  onHistoryClick?: (query: string) => void;
  loading?: boolean;
}

export default function SearchBar({
  value,
  onChange,
  onSearch,
  suggestions = [],
  placeholder = "Tìm kiếm sản phẩm...",
  showSuggestions = true,
  searchHistory = [],
  onSuggestionClick,
  onHistoryClick,
  loading = false
}: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Show dropdown when focused and has content
  useEffect(() => {
    const shouldShow = isFocused && (suggestions.length > 0 || (searchHistory.length > 0 && !value));
    setShowDropdown(shouldShow);
  }, [isFocused, suggestions, searchHistory, value]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onSearch(value.trim());
      setShowDropdown(false);
      inputRef.current?.blur();
    }
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    onChange(suggestion.text);
    onSuggestionClick?.(suggestion);
    setShowDropdown(false);
    onSearch(suggestion.text);
  };

  const handleHistoryClick = (query: string) => {
    onChange(query);
    onHistoryClick?.(query);
    setShowDropdown(false);
    onSearch(query);
  };

  const handleClear = () => {
    onChange('');
    inputRef.current?.focus();
  };

  const getSuggestionIcon = (type: SearchSuggestion['type']) => {
    switch (type) {
      case 'product':
        return '📱';
      case 'category':
        return '📂';
      case 'brand':
        return '🏷️';
      case 'tag':
        return '🏷️';
      default:
        return '🔍';
    }
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 150)}
            placeholder={placeholder}
            className="w-full pl-12 pr-12 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
          />

          {/* Search Icon */}
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={20} className="text-gray-400" />
          </div>

          {/* Loading Indicator */}
          {loading && (
            <div className="absolute inset-y-0 right-0 pr-12 flex items-center">
              <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

          {/* Clear Button */}
          {value && !loading && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
          )}

          {/* Search Button */}
          <button
            type="submit"
            disabled={!value.trim() || loading}
            className="absolute inset-y-0 right-0 mr-2 px-4 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center transition-colors"
          >
            <Search size={16} />
          </button>
        </div>
      </form>

      {/* Dropdown */}
      {showDropdown && showSuggestions && (
        <div
          ref={dropdownRef}
          className="absolute top-full mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto"
        >
          {/* Search Suggestions */}
          {suggestions.length > 0 && (
            <div className="p-2">
              <div className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide">
                Gợi ý tìm kiếm
              </div>
              {suggestions.map((suggestion, index) => (
                <button
                  key={`suggestion-${index}`}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center space-x-3 transition-colors"
                >
                  <span className="text-lg">{getSuggestionIcon(suggestion.type)}</span>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">
                      {suggestion.text}
                    </div>
                    <div className="text-xs text-gray-500 capitalize">
                      {suggestion.type}
                      {suggestion.count && ` • ${suggestion.count} kết quả`}
                    </div>
                  </div>
                  {suggestion.image && (
                    <img
                      src={suggestion.image}
                      alt={suggestion.text}
                      className="w-8 h-8 object-cover rounded"
                    />
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Search History */}
          {searchHistory.length > 0 && !value && (
            <div className="p-2 border-t border-gray-100">
              <div className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide">
                Lịch sử tìm kiếm
              </div>
              {searchHistory.slice(0, 5).map((query, index) => (
                <button
                  key={`history-${index}`}
                  onClick={() => handleHistoryClick(query)}
                  className="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center space-x-3 transition-colors"
                >
                  <Clock size={16} className="text-gray-400" />
                  <span className="text-sm text-gray-900">{query}</span>
                </button>
              ))}
            </div>
          )}

          {/* Popular Searches */}
          {suggestions.length === 0 && value && (
            <div className="p-4 text-center">
              <TrendingUp size={24} className="text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">
                Không tìm thấy gợi ý cho "{value}"
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Thử tìm kiếm với từ khóa khác
              </p>
            </div>
          )}
        </div>
      )}

      {/* Keyboard Shortcuts Hint */}
      <div className="mt-2 text-xs text-gray-500 text-center">
        Nhấn Enter để tìm kiếm • ESC để xóa
      </div>
    </div>
  );
}
