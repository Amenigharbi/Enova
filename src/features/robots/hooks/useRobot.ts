"use client";

import { useState, useEffect } from 'react';
import { RobotWithDomain } from '../types/robot.types';

export const useRobot = (slug: string) => {
  const [robot, setRobot] = useState<RobotWithDomain | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRobot = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/robots/${slug}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Robot non trouvé');
          }
          throw new Error('Erreur lors du chargement du robot');
        }
        
        const data = await response.json();
        setRobot(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchRobot();
    }
  }, [slug]);

  return { robot, loading, error };
};