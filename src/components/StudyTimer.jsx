import React, { useState, useEffect, useRef } from 'react';
import { Play, Square } from 'lucide-react';

const TOTAL_SECONDS = 15 * 60;

const StudyTimer = ({ onTimerEnd }) => {
  const [seconds, setSeconds] = useState(TOTAL_SECONDS);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (running && seconds > 0) {
      intervalRef.current = setInterval(() => setSeconds(s => s - 1), 1000);
    } else if (seconds === 0) {
      setRunning(false);
      setDone(true);
      onTimerEnd();
    }
    return () => clearInterval(intervalRef.current);
  }, [running, seconds]);

  const start = () => setRunning(true);
  const stop = () => { setRunning(false); setDone(true); onTimerEnd(); };

  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');
  const progress = 1 - seconds / TOTAL_SECONDS;

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative" style={{ width: 160, height: 160 }}>
        <svg width="160" height="160" style={{ transform: 'rotate(-90deg)' }}>
          <circle cx="80" cy="80" r="68" fill="none" stroke="#222" strokeWidth="4" />
          <circle cx="80" cy="80" r="68" fill="none" stroke="#E8E0D5" strokeWidth="4"
            strokeDasharray={`${2 * Math.PI * 68}`}
            strokeDashoffset={`${2 * Math.PI * 68 * (1 - progress)}`}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1s linear' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-light tracking-wider" style={{ color: '#E8E0D5', fontVariantNumeric: 'tabular-nums' }}>
            {mm}:{ss}
          </span>
          <span className="text-xs mt-1" style={{ color: '#666', letterSpacing: '0.1em' }}>自主学习</span>
        </div>
      </div>
      {!done && (
        <div className="flex gap-3">
          {!running ? (
            <button onClick={start} className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium tracking-widest uppercase transition-all"
              style={{ background: '#E8E0D5', color: '#111', letterSpacing: '0.12em' }}>
              <Play size={14} /> 开始计时
            </button>
          ) : (
            <button onClick={stop} className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium tracking-widest uppercase transition-all"
              style={{ background: '#2A2A2A', color: '#888', border: '1px solid #333', letterSpacing: '0.12em' }}>
              <Square size={14} /> 结束学习
            </button>
          )}
        </div>
      )}
      {done && (
        <p className="text-sm" style={{ color: '#888', letterSpacing: '0.05em' }}>学习时间结束，请分享你的认知。</p>
      )}
    </div>
  );
};

export default StudyTimer;
