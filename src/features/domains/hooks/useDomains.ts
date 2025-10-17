"use client";

import { useState, useEffect } from 'react';
import { Domain } from '../types/domain.types';

export const useDomains = () => {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDomains = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/domaines');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setDomains(data);
      } catch (err) {
        console.error('Error fetching domains:', err);
        setError('Failed to fetch domains');
      } finally {
        setLoading(false);
      }
    };

    fetchDomains();
  }, []);

  return { domains, loading, error };
};