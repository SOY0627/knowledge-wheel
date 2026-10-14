import React from 'react';
import { getCategoryColor } from '@/data/knowledgeConcepts';

const ConceptCard = ({ concept }) => {
  return (
    <div className="w-full p-6" style={{ background: '#161616', border: '1px solid #2A2A2A' }}>
      <div className="flex items-start justify-between gap-4 mb-4">
        <span className="text-xs px-2.5 py-1 font-medium" style={{
          background: '#1E1E1E',
          color: getCategoryColor(concept.category),
          border: `1px solid ${getCategoryColor(concept.category)}33`,
          letterSpacing: '0.08em',
        }}>
          {concept.category}
        </span>
      </div>
      <h2 className="text-2xl font-light mb-3 tracking-wide" style={{ color: '#E8E0D5', letterSpacing: '0.05em' }}>
        {concept.concept}
      </h2>
      <p className="text-sm leading-relaxed" style={{ color: '#777', lineHeight: 1.9 }}>
        {concept.description}
      </p>
    </div>
  );
};

export default ConceptCard;
