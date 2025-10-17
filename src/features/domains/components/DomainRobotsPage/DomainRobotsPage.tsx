"use client";

import { useDomainWithRobots } from '../../hooks/useDomainWithRobots';
import { RobotList } from '@/features/robots';
import Link from 'next/link';
import { Robot } from '@/features/robots/types/robot.types';
import { useRouter } from 'next/navigation';

interface DomainRobotsPageProps {
  slug: string;
  locale: string;
}

export const DomainRobotsPage = ({ slug, locale }: DomainRobotsPageProps) => {
  const { domain, robots, loading, error } = useDomainWithRobots(slug);
   const router = useRouter(); 
 const handleEditRobot = (robot: Robot) => {
  router.push(`/${locale}/admin/robots/${robot.id}/edit`);
};

const handleDeleteRobot = async (robot: Robot) => {
  if (confirm(`Êtes-vous sûr de vouloir supprimer le robot "${robot.name}" ?`)) {
    try {
      const response = await fetch(`/api/robots/Crud/${robot.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        window.location.reload();
      } else {
        const errorData = await response.json();
        alert(`Erreur: ${errorData.error}`);
      }
    } catch (err) {
      alert('Erreur lors de la suppression');
    }
  }
};
const handleCreateRobot = () => {
  router.push(`/${locale}/admin/robots/new?domain=${domain?.id}`);
};

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement du domaine...</p>
        </div>
      </div>
    );
  }

  if (error || !domain) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12 text-red-600">
          <p>Domaine non trouvé</p>
          <Link href={`/${locale}/domaines`} className="text-blue-600 hover:underline mt-4 inline-block">
            ← Retour aux domaines
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <Link 
          href={`/${locale}/domaines`} 
          className="text-blue-600 hover:underline mb-4 inline-block"
        >
          ← Retour aux domaines
        </Link>
        <div className="flex items-start gap-4 mb-6">
          <div className="p-4 bg-blue-100 rounded-xl">
            <span className="text-3xl">{domain.icon}</span>
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-4xl font-bold text-gray-900">{domain.name}</h1>
                <p className="text-gray-600 mt-2 text-lg">{domain.description}</p>
                <div className="flex items-center gap-4 mt-4">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    {domain.robotCount} robot{domain.robotCount !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
              
            
            </div>
          </div>
        </div>
      </div>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Robots dans ce domaine</h2>
        <RobotList 
          robots={robots} 
          emptyMessage={`Aucun robot dans le domaine ${domain.name}`}
          onEditRobot={handleEditRobot}
          onDeleteRobot={handleDeleteRobot}
          onCreateRobot={handleCreateRobot}
          showActions={true} // Activer les actions
        />
      </section>
    </div>
  );
};

export default DomainRobotsPage;