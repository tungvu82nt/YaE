import React from 'react';
import { useApp } from '../context/AppContext';
import * as Icons from 'lucide-react';

export default function Navigation() {
  const { state, dispatch } = useApp();

  const handleCategoryClick = (categorySlug: string) => {
    dispatch({ type: 'SET_SELECTED_CATEGORY', payload: categorySlug });
  };

  const getIcon = (iconName: string) => {
    const IconComponent = (Icons as Record<string, React.ComponentType<{ size?: number }>>)[iconName] || Icons.Package;
    return <IconComponent size={20} />;
  };

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center space-x-8 py-3 overflow-x-auto">
          <button
            onClick={() => handleCategoryClick('')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg whitespace-nowrap transition-colors ${
              state.selectedCategory === '' 
                ? 'bg-blue-100 text-blue-600' 
                : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
            }`}
          >
            <Icons.Home size={20} />
            <span>Tất cả</span>
          </button>
          
          {state.categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.slug)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg whitespace-nowrap transition-colors ${
                state.selectedCategory === category.slug 
                  ? 'bg-blue-100 text-blue-600' 
                  : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
              }`}
            >
              {getIcon(category.icon)}
              <span>{category.name}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}