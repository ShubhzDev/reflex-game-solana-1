import React from 'react';
import { Position } from '../types';
import { cn } from '../utils/styles';

interface TargetProps {
  position: Position;
  onClick: () => void;
  isInteractive: boolean;
}

export const Target: React.FC<TargetProps> = ({ position, onClick, isInteractive }) => {
  return (
    <button
      onClick={isInteractive ? onClick : undefined}
      style={{
        position: 'absolute',
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: 'translate(-50%, -50%)',
      }}
      className={cn(
        "w-5 h-5 rounded-full transition-all duration-100 ease-out shadow-lg",
        isInteractive ? [
          "bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400",
          "cursor-pointer hover:scale-110",
          "shadow-[0_0_15px_rgba(0,255,255,0.7)]",
          "animate-[pulse_0.5s_ease-in-out_infinite]",
          "border-2 border-white/50"
        ] : [
          "bg-gradient-to-r from-gray-400 to-gray-300",
          "cursor-not-allowed",
          "shadow-gray-500/50",
          "opacity-50"
        ]
      )}
      aria-label={isInteractive ? "Click target" : "Target (spectating)"}
      disabled={!isInteractive}
    />
  );
};