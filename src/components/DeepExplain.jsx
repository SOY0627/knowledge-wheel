import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { getDeepContent } from '@/data/deepContent';

const DeepExplain = ({ concept }) => {
  const [openIndex, setOpenIndex] = useState(0);
  const layers = getDeepContent(concept);

  return (
    <div className="flex flex-col gap-2 w-full">
      {layers.map((layer, i) => (
        <div key={i} style={{ border: '1px solid #2A2A2A' }}>
          <button
            onClick={() => setOpenIndex(openIndex === i ? -1 : i)}
            className="w-full flex items-center justify-between p-4 text-left transition-all"
            style={{ background: openIndex === i ? '#1A1A1A' : '#111' }}>
            <span className="text-sm font-medium" style={{ color: openIndex === i ? '#E8E0D5' : '#666', letterSpacing: '0.03em' }}>
              <span style={{ color: '#444', marginRight: 12, fontVariantNumeric: 'tabular-nums' }}>0{i + 1}</span>
              {layer.layer}
            </span>
            {openIndex === i
              ? <ChevronUp size={14} style={{ color: '#555', flexShrink: 0 }} />
              : <ChevronDown size={14} style={{ color: '#333', flexShrink: 0 }} />}
          </button>
          {openIndex === i && (
            <div className="p-5 text-sm"
              style={{ color: '#AAA', lineHeight: 2, background: '#1A1A1A', borderTop: '1px solid #222', whiteSpace: 'pre-wrap' }}>
              {layer.text}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default DeepExplain;
