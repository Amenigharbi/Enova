"use client";

import { DomainList, DomainFilters, useDomains } from '@/features/domains';
import { useState } from 'react';
import { DomainFilters as DomainFiltersType } from '@/features/domains/types/domain.types';
import { filterDomains, sortDomains } from '@/features/domains/utils/domain-helpers';

export const DomainsPage = () => {
  const { domains, loading, error } = useDomains();
  const [filters, setFilters] = useState<DomainFiltersType>({
    search: '',
    sortBy: 'name'
  });

  // Appliquer les filtres et le tri
  const filteredDomains = sortDomains(
    filterDomains(domains, filters.search),
    filters.sortBy
  );

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des domaines...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12 text-red-600">
          <p>Erreur: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Domaines</h1>
        <p className="text-gray-600">
          Découvrez les différents domaines de robotique et leurs spécificités
        </p>
      </div>

      <DomainFilters onFiltersChange={setFilters} />
      <DomainList domains={filteredDomains} />
    </div>
  );
};

export default DomainsPage;