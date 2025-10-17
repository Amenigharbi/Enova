"use client";

import { useState, useEffect } from 'react';
import { Domain } from '../types/domain.types';
import type { Robot } from '@/features/robots/types/robot.types'; 

interface DomainWithRobots extends Domain {
  robots: Robot[]; 
}

export const useDomainWithRobots = (slug: string) => {
  const [domain, setDomain] = useState<DomainWithRobots | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDomainWithRobots = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/domaines/${slug}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Domaine non trouvé');
          }
          throw new Error('Erreur lors du chargement du domaine');
        }
        
        const data = await response.json();
        setDomain(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchDomainWithRobots();
    }
  }, [slug]);

  return { 
    domain, 
    robots: domain?.robots || [], 
    loading, 
    error 
  };
};