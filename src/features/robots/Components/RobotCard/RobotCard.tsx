"use client";

import Link from 'next/link';
import { Robot } from '../../types/robot.types';
import { useParams } from 'next/navigation';
import { IconEdit, IconTrash, IconPlus } from '@tabler/icons-react';

interface RobotCardProps {
  robot: Robot;
  onEdit?: (robot: Robot) => void;
  onDelete?: (robot: Robot) => void;
  showActions?: boolean;
}

export const RobotCard = ({ robot, onEdit, onDelete, showActions = true }: RobotCardProps) => {
  const params = useParams();
  const locale = params.locale as string;

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onEdit?.(robot);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete?.(robot);
  };

  return (
    <div className="border border-gray-200 rounded-lg bg-white hover:shadow-lg transition-all duration-300 group">
      {/* Actions d'administration */}
      {showActions && (onEdit || onDelete) && (
        <div className="flex justify-end p-3 border-b bg-gray-50 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex gap-2">
            {onEdit && (
              <button
                onClick={handleEdit}
                className="p-1 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                title="Modifier le robot"
              >
                <IconEdit size={18} />
              </button>
            )}
            {onDelete && (
              <button
                onClick={handleDelete}
                className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                title="Supprimer le robot"
              >
                <IconTrash size={18} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Contenu de la carte */}
      <Link href={`/${locale}/robots/${robot.slug}`}>
        <div className="p-6">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-xl font-semibold text-gray-900">{robot.name}</h3>
            <span className="text-blue-600 hover:text-blue-800 font-medium text-sm">
              Détails →
            </span>
          </div>
          
          <p className="text-gray-600 mb-4 line-clamp-3">{robot.description}</p>
          
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <span>📚</span>
              <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                {robot.githubRepo}
              </code>
            </div>
            <span className="text-xs text-gray-400">
              {new Date(robot.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
};