import React from 'react';
import { RotateCw, Timer, MessageSquare, Brain, BookOpen } from 'lucide-react';

const steps = [
  { icon: RotateCw, label: '转盘选题' },
  { icon: Timer, label: '自主学习' },
  { icon: MessageSquare, label: '苏格拉底追问' },
  { icon: Brain, label: '费曼检验' },
  { icon: BookOpen, label: '深度讲解' },
];

const StepIndicator = ({ currentStep }) => {
  return (
    <div className="flex items-center gap-0 w-full">
      {steps.map((step, i) => {
        const Icon = step.icon;
        const isActive = i === currentStep;
        const isDone = i < currentStep;
        return (
          <React.Fragment key={i}>
            <div className="flex flex-col items-center gap-1.5 flex-1">
              <div className="w-8 h-8 flex items-center justify-center transition-all duration-300"
                style={{
                  background: isActive ? '#E8E0D5' : isDone ? '#2A2A2A' : '#1A1A1A',
                  border: isActive ? 'none' : isDone ? '1px solid #444' : '1px solid #222',
                }}>
                <Icon size={14} style={{ color: isActive ? '#111' : isDone ? '#888' : '#333' }} />
              </div>
              <span className="text-xs text-center hidden sm:block" style={{ color: isActive ? '#E8E0D5' : isDone ? '#555' : '#333', letterSpacing: '0.05em', fontSize: 10 }}>
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className="flex-1 h-px mb-4" style={{ background: isDone ? '#333' : '#1E1E1E', maxWidth: 40 }} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default StepIndicator;
