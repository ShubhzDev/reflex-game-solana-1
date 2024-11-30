import React from 'react';
import { Position } from '../types';

interface TargetProps {
  position: Position;
  onClick: () => void;
}

export const Target: React.FC<TargetProps> = ({ position, onClick }) => {
  return (
    <button
      onClick={onClick}
      style={{
        position: 'absolute',
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: 'translate(-50%, -50%)',
      }}
      className="w-8 h-8 bg-gradient-to-r from-red-500 to-pink-500 rounded-full cursor-pointer
        hover:scale-110 transition-transform duration-100 ease-out
        animate-pulse shadow-lg shadow-red-500/50"
      aria-label="Click target"
    />
  );
};