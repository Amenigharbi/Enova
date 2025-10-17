"use client";

import { Domain } from '../../types/domain.types';
import { DomainCard } from '../DomainCard/DomainCard';

interface DomainListProps {
  domains: Domain[];
}

export const DomainList = ({ domains }: DomainListProps) => {
  if (domains.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg">Aucun domaine trouvé</div>
        <p className="text-gray-400 mt-2">Les domaines apparaîtront ici une fois créés</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {domains.map((domain) => (
        <DomainCard key={domain.id} domain={domain} />
      ))}
    </div>
  );
};