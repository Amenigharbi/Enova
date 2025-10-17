"use client";

import { Robot } from '../../types/robot.types';
import { RobotCard } from '../RobotCard';
import { IconPlus } from '@tabler/icons-react';

interface RobotListProps {
  robots: Robot[];
  emptyMessage?: string;
  onEditRobot?: (robot: Robot) => void;
  onDeleteRobot?: (robot: Robot) => void;
  onCreateRobot?: () => void;
  showActions?: boolean;
}

export const RobotList = ({ 
  robots, 
  emptyMessage = "Aucun robot trouvé",
  onEditRobot,
  onDeleteRobot,
  onCreateRobot,
  showActions = true
}: RobotListProps) => {
  if (robots.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg mb-4">{emptyMessage}</div>
        {onCreateRobot && (
          <button
            onClick={onCreateRobot}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            <IconPlus size={20} />
            Créer un nouveau robot
          </button>
        )}
        {!onCreateRobot && (
          <p className="text-gray-400 mt-2">Les robots apparaîtront ici une fois créés</p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Bouton de création */}
      {onCreateRobot && (
        <div className="flex justify-end">
          <button
            onClick={onCreateRobot}
            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            <IconPlus size={18} />
            Nouveau robot
          </button>
        </div>
      )}

      {/* Grille des robots */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {robots.map((robot) => (
          <RobotCard 
            key={robot.id} 
            robot={robot}
            onEdit={onEditRobot}
            onDelete={onDeleteRobot}
            showActions={showActions}
          />
        ))}
      </div>
    </div>
  );
};