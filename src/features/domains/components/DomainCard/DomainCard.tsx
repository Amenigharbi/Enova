"use client";

import Link from 'next/link';
import { Domain } from '../../types/domain.types';
import { useParams } from 'next/navigation';

interface DomainCardProps {
  domain: Domain;
}

export const DomainCard = ({ domain }: DomainCardProps) => {
  const params = useParams();
  const locale = params.locale as string;

  return (
    <Link 
      href={`/${locale}/domaines/${domain.slug}`}  
      className="block p-6 border rounded-lg hover:shadow-lg transition-shadow bg-white"
    >
      <div className="flex items-center mb-3">
        <div className="p-2 bg-blue-100 rounded-lg mr-3">
          <span>{domain.icon}</span>
        </div>
        <h3 className="text-xl font-semibold">{domain.name}</h3>
      </div>
      <p className="text-gray-600 mb-4 line-clamp-2">{domain.description}</p>
      <div className="flex justify-between items-center text-sm text-gray-500">
        <span>{domain.robotCount} robots</span>
        <span className="text-blue-600 hover:text-blue-800">Voir →</span>
      </div>
    </Link>
  );
};