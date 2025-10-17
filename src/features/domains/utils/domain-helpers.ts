import { Domain } from '../types/domain.types';

export const filterDomains = (domains: Domain[], search: string): Domain[] => {
  if (!search) return domains;
  
  return domains.filter(domain =>
    domain.name.toLowerCase().includes(search.toLowerCase()) ||
    domain.description.toLowerCase().includes(search.toLowerCase())
  );
};

export const sortDomains = (domains: Domain[], sortBy: 'name' | 'robotCount' | 'createdAt'): Domain[] => {
  return [...domains].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'robotCount':
        return b.robotCount - a.robotCount;
      case 'createdAt':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      default:
        return 0;
    }
  });
};

export const getDomainIcon = (domainName: string): string => {
  const icons: { [key: string]: string } = {
    'industrie': '🏭',
    'indoor': '🏢',
    'outdoor': '🌳',
    'medical': '🏥',
    'logistique': '🚚'
  };
  
  const lowerName = domainName.toLowerCase();
  for (const [key, icon] of Object.entries(icons)) {
    if (lowerName.includes(key)) {
      return icon;
    }
  }
  
  return '🔧'; // Icône par défaut
};