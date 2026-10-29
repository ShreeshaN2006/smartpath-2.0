import React from 'react';
import { EmergencyHeader } from './EmergencyHeader';
import { ResponseMode } from '../types';

interface HeaderProps {
  onReset: () => void;
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
  activeObstaclesCount: number;
  responseMode?: ResponseMode;
  onSelectResponseMode?: (mode: ResponseMode) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onReset,
  onToggleSidebar,
  isSidebarOpen,
  activeObstaclesCount,
  responseMode = 'Ambulance',
  onSelectResponseMode = () => {},
}) => {
  return (
    <EmergencyHeader
      responseMode={responseMode}
      onSelectResponseMode={onSelectResponseMode}
      onReset={onReset}
      onToggleSidebar={onToggleSidebar}
      isSidebarOpen={isSidebarOpen}
      activeObstaclesCount={activeObstaclesCount}
    />
  );
};

