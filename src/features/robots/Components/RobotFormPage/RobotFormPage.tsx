"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Robot, RobotWithDomain } from '../../types/robot.types';
import { useDomains } from '@/features/domains';

interface RobotFormPageProps {
  locale: string;
  robotId?: string;
  domainId?: string;
  isEdit?: boolean;
}

export const RobotFormPage = ({ locale, robotId, domainId, isEdit = false }: RobotFormPageProps) => {
  const router = useRouter();
  const { domains } = useDomains();
  
  const [formData, setFormData] = useState<Partial<Robot>>({
    name: '',
    description: '',
    slug: '',
    githubRepo: '',
    domainId: domainId || '',
    cpu: '',
    gpu: '',
    ram: '',
    storage: '',
    os: '',
    connectivity: '',
    power: '',
    weight: '',
    dimensions: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fetchLoading, setFetchLoading] = useState(isEdit);

  // CORRECTION : Stocker l'ID du robot pour l'édition
  const [currentRobotId, setCurrentRobotId] = useState<string | null>(null);

  // Charger les données du robot en mode édition
  useEffect(() => {
    if (isEdit && robotId) {
      const fetchRobot = async () => {
        try {
          setFetchLoading(true);
          
          // CORRECTION : D'abord récupérer le robot par ID via l'API Crud
          // Ou créer une nouvelle API qui récupère par ID
          const response = await fetch(`/api/robots/by-id/${robotId}`);
          
          if (!response.ok) {
            throw new Error('Robot non trouvé');
          }
          
          const robot: RobotWithDomain = await response.json();
          setFormData(robot);
          setCurrentRobotId(robot.id); // Stocker l'ID pour l'update
          
        } catch (err) {
          setError('Erreur lors du chargement du robot');
          console.error('Error fetching robot:', err);
        } finally {
          setFetchLoading(false);
        }
      };
      fetchRobot();
    }
  }, [isEdit, robotId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // CORRECTION : Utiliser l'ID stocké pour l'update
      const url = isEdit ? `/api/robots/Crud/${currentRobotId || robotId}` : '/api/robots';
      const method = isEdit ? 'PUT' : 'POST';

      console.log('Submitting to:', url, 'with method:', method);

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la sauvegarde');
      }

      const savedRobot = await response.json();
      
      // Rediriger vers la page du domaine
      router.push(`/${locale}/domaines/${savedRobot.domain.slug}`);
      router.refresh();

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    const newSlug = formData.slug === '' || !isEdit ? generateSlug(name) : formData.slug;
    
    setFormData(prev => ({
      ...prev,
      name,
      slug: newSlug
    }));
  };

  if (fetchLoading) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement du robot...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* En-tête */}
      <div className="mb-8">
        <Link 
          href={`/${locale}/domaines`} 
          className="text-blue-600 hover:underline mb-4 inline-block"
        >
          ← Retour aux domaines
        </Link>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {isEdit ? 'Modifier le robot' : 'Créer un nouveau robot'}
        </h1>
        <p className="text-gray-600">
          {isEdit ? 'Modifiez les informations du robot' : 'Remplissez les informations pour créer un nouveau robot'}
        </p>
      </div>

      {/* Formulaire */}
      <form onSubmit={handleSubmit} className="bg-white border rounded-lg p-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Informations de base */}
          <div className="md:col-span-2">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Informations de base</h2>
          </div>

          <div className="md:col-span-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Nom du robot *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name || ''}
              onChange={handleNameChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-2">
              Slug *
            </label>
            <input
              type="text"
              id="slug"
              name="slug"
              value={formData.slug || ''}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">Identifiant unique pour les URLs</p>
          </div>

          <div className="md:col-span-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description || ''}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="domainId" className="block text-sm font-medium text-gray-700 mb-2">
              Domaine *
            </label>
            <select
              id="domainId"
              name="domainId"
              value={formData.domainId || ''}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Sélectionnez un domaine</option>
              {domains.map(domain => (
                <option key={domain.id} value={domain.id}>
                  {domain.name}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label htmlFor="githubRepo" className="block text-sm font-medium text-gray-700 mb-2">
              Repository GitHub *
            </label>
            <input
              type="text"
              id="githubRepo"
              name="githubRepo"
              value={formData.githubRepo || ''}
              onChange={handleChange}
              required
              placeholder="owner/repository-name"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Spécifications techniques */}
          <div className="md:col-span-2 mt-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Spécifications techniques</h2>
          </div>

          <div>
            <label htmlFor="cpu" className="block text-sm font-medium text-gray-700 mb-2">
              Processeur
            </label>
            <input
              type="text"
              id="cpu"
              name="cpu"
              value={formData.cpu || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="gpu" className="block text-sm font-medium text-gray-700 mb-2">
              Carte graphique
            </label>
            <input
              type="text"
              id="gpu"
              name="gpu"
              value={formData.gpu || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="ram" className="block text-sm font-medium text-gray-700 mb-2">
              Mémoire RAM
            </label>
            <input
              type="text"
              id="ram"
              name="ram"
              value={formData.ram || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="storage" className="block text-sm font-medium text-gray-700 mb-2">
              Stockage
            </label>
            <input
              type="text"
              id="storage"
              name="storage"
              value={formData.storage || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="os" className="block text-sm font-medium text-gray-700 mb-2">
              Système d'exploitation
            </label>
            <input
              type="text"
              id="os"
              name="os"
              value={formData.os || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="connectivity" className="block text-sm font-medium text-gray-700 mb-2">
              Connectivité
            </label>
            <input
              type="text"
              id="connectivity"
              name="connectivity"
              value={formData.connectivity || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="power" className="block text-sm font-medium text-gray-700 mb-2">
              Alimentation
            </label>
            <input
              type="text"
              id="power"
              name="power"
              value={formData.power || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-2">
              Poids
            </label>
            <input
              type="text"
              id="weight"
              name="weight"
              value={formData.weight || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="dimensions" className="block text-sm font-medium text-gray-700 mb-2">
              Dimensions
            </label>
            <input
              type="text"
              id="dimensions"
              name="dimensions"
              value={formData.dimensions || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Boutons d'action */}
        <div className="flex justify-end gap-4 mt-8 pt-6 border-t">
          <Link
            href={`/${locale}/domaines`}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Annuler
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Enregistrement...' : (isEdit ? 'Modifier' : 'Créer')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RobotFormPage;