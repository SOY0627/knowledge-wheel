import React, { useState, useRef } from 'react';
import { knowledgeConcepts } from '@/data/knowledgeConcepts';

const CATEGORIES = [
  '食·烹饪', '食·生活', '住·金融', '住·建筑',
  '健康·心理', '健康·运动', '中国史', '世界史',
  '法律', '地理', '博物', '古书'
];

const SEG_COUNT = CATEGORIES.length;
const SEG_ANGLE = (2 * Math.PI) / SEG_COUNT;

// 转盘各扇区颜色
const WHEEL_COLORS = [
  '#2C2015', '#1A2030', '#1A2015', '#252020',
  '#201A25', '#1A2520', '#252018', '#1E1A25',
  '#1A2025', '#1A2520', '#25201A', '#201E1A',
];

// 文字颜色对应各类
const TEXT_COLORS = [
  '#C4A882', '#8AAACF', '#8EBF92', '#8EB0CF',
  '#B08EC4', '#8EC4A5', '#D4966A', '#B08EC4',
  '#7A9EBF', '#8EC4B0', '#C4A87A', '#B0A08A',
];

const SpinWheel = ({ onConceptSelected, selectedCategory = 'all' }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const rotationRef = useRef(0);

  const isSingleCategory = selectedCategory !== 'all';

  const getConceptPool = () => {
    if (isSingleCategory) {
      return knowledgeConcepts.filter(c => c.category.startsWith(selectedCategory));
    }
    return knowledgeConcepts;
  };

  // 绘制转盘
  const drawWheel = (rot) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const size = 280;
    const center = size / 2;
    const radius = 132;

    ctx.clearRect(0, 0, size, size);

    // 外圈光晕
    const glow = ctx.createRadialGradient(center, center, radius - 10, center, center, radius + 8);
    glow.addColorStop(0, 'rgba(232,224,213,0.05)');
    glow.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.beginPath();
    ctx.arc(center, center, radius + 8, 0, 2 * Math.PI);
    ctx.fillStyle = glow;
    ctx.fill();

    // 绘制扇区
    for (let i = 0; i < SEG_COUNT; i++) {
      const startAngle = rot + i * SEG_ANGLE;
      const endAngle = startAngle + SEG_ANGLE;
      const isActive = !isSingleCategory || CATEGORIES[i] === selectedCategory;

      // 扇区背景
      ctx.beginPath();
      ctx.moveTo(center, center);
      ctx.arc(center, center, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = isActive ? WHEEL_COLORS[i] : '#0A0A0A';
      ctx.fill();
      ctx.strokeStyle = isActive ? '#0D0D0D' : '#151515';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // 扇区文字
      ctx.save();
      ctx.translate(center, center);
      ctx.rotate(startAngle + SEG_ANGLE / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = isActive ? TEXT_COLORS[i] : '#333';
      ctx.font = '500 10.5px -apple-system, "PingFang SC", "Hiragino Sans GB", sans-serif';
      ctx.fillText(CATEGORIES[i], radius - 10, 3.5);
      ctx.restore();
    }

    // 外环装饰圈
    ctx.beginPath();
    ctx.arc(center, center, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = '#2A2A2A';
    ctx.lineWidth = 2;
    ctx.stroke();

    // 内圈遮罩
    ctx.beginPath();
    ctx.arc(center, center, 28, 0, 2 * Math.PI);
    ctx.fillStyle = '#111';
    ctx.fill();
    ctx.strokeStyle = '#3A3A3A';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // 中心小圆点
    ctx.beginPath();
    ctx.arc(center, center, 5, 0, 2 * Math.PI);
    ctx.fillStyle = '#E8E0D5';
    ctx.fill();
  };

  // 指针在右侧（0度方向），转盘顺时针旋转
  const getSegmentAtPointer = (rot) => {
    const normalizedRot = ((rot % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
    const pointerInWheel = ((2 * Math.PI - normalizedRot) % (2 * Math.PI));
    const segIndex = Math.floor(pointerInWheel / SEG_ANGLE) % SEG_COUNT;
    return segIndex;
  };

  const spin = () => {
    if (isSpinning) return;
    const pool = getConceptPool();
    if (pool.length === 0) return;
    setIsSpinning(true);

    const totalRotation = (6 + Math.random() * 4) * 2 * Math.PI + Math.random() * 2 * Math.PI;
    const duration = 4000;
    const startTime = performance.now();
    const startRot = rotationRef.current;

    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      const currentRot = startRot + totalRotation * eased;
      rotationRef.current = currentRot;
      drawWheel(currentRot);

      if (progress < 1) {
        animRef.current = requestAnimationFrame(animate);
      } else {
        setIsSpinning(false);
        let finalPool = pool;
        if (!isSingleCategory) {
          const segIndex = getSegmentAtPointer(currentRot);
          const catName = CATEGORIES[segIndex];
          const mainCat = catName.split('·')[0];
          const filtered = knowledgeConcepts.filter(c => c.category.startsWith(mainCat));
          finalPool = filtered.length > 0 ? filtered : knowledgeConcepts;
        }
        const picked = finalPool[Math.floor(Math.random() * finalPool.length)];
        onConceptSelected(picked);
      }
    };

    animRef.current = requestAnimationFrame(animate);
  };

  // 初始绘制 & 词库变化时重绘
  React.useEffect(() => {
    drawWheel(rotationRef.current);
  }, [selectedCategory]);

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative flex items-center justify-center" style={{ width: 300, height: 300 }}>
        {/* 外环光晕 */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            boxShadow: '0 0 60px rgba(232,224,213,0.06), inset 0 0 40px rgba(0,0,0,0.4)',
          }}
        />

        {/* Canvas 转盘 */}
        <canvas
          ref={canvasRef}
          width={280}
          height={280}
          style={{ borderRadius: '50%' }}
        />

        {/* 指针（右侧，三角形朝左指向转盘） */}
        <div
          className="absolute"
          style={{
            right: 2,
            top: '50%',
            transform: 'translateY(-50%)',
            width: 0,
            height: 0,
            borderTop: '10px solid transparent',
            borderBottom: '10px solid transparent',
            borderRight: '22px solid #E8E0D5',
            filter: 'drop-shadow(0 0 6px rgba(232,224,213,0.6))',
            zIndex: 10,
          }}
        />
      </div>

      <button
        onClick={spin}
        disabled={isSpinning}
        style={{
          background: isSpinning ? '#2A2A2A' : '#E8E0D5',
          color: isSpinning ? '#666' : '#111',
          border: 'none',
          padding: '10px 32px',
          fontSize: 11,
          fontWeight: 500,
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          cursor: isSpinning ? 'not-allowed' : 'pointer',
          transition: 'all 0.3s',
        }}
      >
        {isSpinning ? '旋转中...' : isSingleCategory ? `转动「${selectedCategory}」转盘` : '转动转盘'}
      </button>
    </div>
  );
};

export default SpinWheel;
