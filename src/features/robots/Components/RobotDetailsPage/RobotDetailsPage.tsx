"use client";

import { useRobot } from '../../hooks/useRobot';
import Link from 'next/link';
import { GitHubViewer } from '../GitHubViewer';

interface RobotDetailsPageProps {
  slug: string;
  locale: string;
}

export const RobotDetailsPage = ({ slug, locale }: RobotDetailsPageProps) => {
  const { robot, loading, error } = useRobot(slug);

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement du robot...</p>
        </div>
      </div>
    );
  }

  if (error || !robot) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12 text-red-600">
          <p>Robot non trouvé</p>
          <Link href={`/${locale}/domaines`} className="text-blue-600 hover:underline mt-4 inline-block">
            ← Retour aux domaines
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {/* Navigation */}
      <div className="mb-8">
        <Link 
          href={`/${locale}/domaines/${robot.domain.slug}`} 
          className="text-blue-600 hover:underline mb-2 inline-block"
        >
          ← Retour à {robot.domain.name}
        </Link>
        
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">{robot.name}</h1>
            <p className="text-gray-600 text-lg mb-4">{robot.description}</p>
            <div className="flex items-center gap-4">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {robot.domain.name}
              </span>
              <span className="text-gray-500 text-sm">
                Créé le {new Date(robot.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Documentation GitHub */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Documentation Software</h2>
        <GitHubViewer 
          githubRepo={robot.githubRepo}
          robotName={robot.name}
        />
      </section>

      {/* Informations techniques */}
      <section className="border-t pt-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Spécifications Techniques</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Processeur */}
          {robot.cpu && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <span>⚡</span> Processeur
              </h3>
              <p className="text-gray-700">{robot.cpu}</p>
            </div>
          )}

          {/* Carte Graphique */}
          {robot.gpu && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <span>🎮</span> Carte Graphique
              </h3>
              <p className="text-gray-700">{robot.gpu}</p>
            </div>
          )}

          {/* Mémoire RAM */}
          {robot.ram && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <span>💾</span> Mémoire RAM
              </h3>
              <p className="text-gray-700">{robot.ram}</p>
            </div>
          )}

          {/* Stockage */}
          {robot.storage && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <span>💿</span> Stockage
              </h3>
              <p className="text-gray-700">{robot.storage}</p>
            </div>
          )}

          {/* Système d'exploitation */}
          {robot.os && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <span>🖥️</span> Système d'exploitation
              </h3>
              <p className="text-gray-700">{robot.os}</p>
            </div>
          )}

          {/* Connectivité */}
          {robot.connectivity && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <span>📡</span> Connectivité
              </h3>
              <p className="text-gray-700">{robot.connectivity}</p>
            </div>
          )}

          {/* Alimentation */}
          {robot.power && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <span>🔋</span> Alimentation
              </h3>
              <p className="text-gray-700">{robot.power}</p>
            </div>
          )}

          {/* Poids */}
          {robot.weight && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <span>⚖️</span> Poids
              </h3>
              <p className="text-gray-700">{robot.weight}</p>
            </div>
          )}

          {/* Dimensions */}
          {robot.dimensions && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <span>📏</span> Dimensions
              </h3>
              <p className="text-gray-700">{robot.dimensions}</p>
            </div>
          )}
        </div>

        {!robot.cpu && !robot.gpu && !robot.ram && (
          <div className="text-center py-8 text-gray-500">
            <p>Aucune spécification technique disponible pour ce robot</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default RobotDetailsPage;