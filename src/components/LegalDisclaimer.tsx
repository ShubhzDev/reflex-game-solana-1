import React from 'react';
import { LEGAL_DISCLAIMER } from '../config/constants';

export const LegalDisclaimer: React.FC = () => {
  return (
    <div className="w-full bg-black/50 overflow-hidden py-2">
      <div className="animate-scroll whitespace-nowrap text-neon-yellow">
        {LEGAL_DISCLAIMER} • {LEGAL_DISCLAIMER}
      </div>
    </div>
  );
};