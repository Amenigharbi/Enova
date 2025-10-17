"use client";

import { useState, useEffect } from 'react';
import { Robot } from '../types/robot.types';

export const useRobots = (domainId?: string) => {
  const [robots, setRobots] = useState<Robot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRobots = async () => {
      try {
        setLoading(true);
        const url = domainId 
          ? `/api/robots?domainId=${domainId}`
          : '/api/robots';
        
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error('Failed to fetch robots');
        }
        
        const data = await response.json();
        setRobots(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch robots');
      } finally {
        setLoading(false);
      }
    };

    fetchRobots();
  }, [domainId]);

  return { robots, loading, error };
};