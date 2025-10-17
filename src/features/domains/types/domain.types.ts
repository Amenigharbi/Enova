export interface Domain {
  id: string;
  name: string;
  description: string;
  slug: string;
  icon: string;
  robotCount: number;
  createdAt: Date;
}

export interface DomainFilters {
  search: string;
  sortBy: 'name' | 'robotCount' | 'createdAt';
}