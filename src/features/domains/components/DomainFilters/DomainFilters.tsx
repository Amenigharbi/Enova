"use client";

import { useState } from 'react';
import { DomainFilters as DomainFiltersType } from '../../types/domain.types';

interface DomainFiltersProps {
  onFiltersChange: (filters: DomainFiltersType) => void;
}

export const DomainFilters = ({ onFiltersChange }: DomainFiltersProps) => {
  const [filters, setFilters] = useState<DomainFiltersType>({
    search: '',
    sortBy: 'name'
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFilters = { ...filters, search: e.target.value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newFilters = { 
      ...filters, 
      sortBy: e.target.value as DomainFiltersType['sortBy'] 
    };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
      <div className="flex-1">
        <input
          type="text"
          placeholder="Rechercher un domaine..."
          value={filters.search}
          onChange={handleSearchChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
    
    </div>
  );
};