import React, { useMemo, useState } from 'react';
import { Loader2, Sparkles, X } from 'lucide-react';
import { knowledgeConcepts, getCategoryColor } from '@/data/knowledgeConcepts';
import { useAiChat } from '@/hooks/useAiChat';

const MAIN_CATEGORY_MAP = {
  '食': ['食'],
  '住': ['住'],
  '健康': ['健康'],
  '中国史': ['中国史'],
  '世界史': ['世界史'],
  '法律': ['法律', '法政'],
  '法政': ['法律', '法政'],
  '地理': ['地理'],
  '博物': ['博物'],
  '古书': ['古书'],
};

const getMainCategory = (category = '') => category.split('·')[0];

const ConceptGraph = ({ concept, apiKey, apiProvider }) => {
  const [selectedNode, setSelectedNode] = useState(null);
  const [nodeInfo, setNodeInfo] = useState(null);
  const { chat, loading } = useAiChat(apiKey, apiProvider);

  const relatedConcepts = useMemo(() => {
    const main = getMainCategory(concept.category);
    const prefixes = MAIN_CATEGORY_MAP[main] || [main];

    const sameCategory = knowledgeConcepts.filter(
      c => c.id !== concept.id && c.category === concept.category
    );
    const sameMain = knowledgeConcepts.filter(
      c => c.id !== concept.id && c.category !== concept.category && prefixes.some(p => c.category.startsWith(p))
    );
    const others = knowledgeConcepts.filter(
      c => c.id !== concept.id && !prefixes.some(p => c.category.startsWith(p))
    );

    const picked = [
      ...sameCategory.slice(0, 3),
      ...sameMain.slice(0, 2),
      ...others.slice(0, 1),
    ];
    return picked.length > 0 ? picked : knowledgeConcepts.filter(c => c.id !== concept.id).slice(0, 6);
  }, [concept]);

  const positions = useMemo(() => {
    const angleStep = (2 * Math.PI) / relatedConcepts.length;
    const radius = 118;
    return relatedConcepts.map((_, i) => {
      const angle = -Math.PI / 2 + i * angleStep;
      return {
        x: 160 + radius * Math.cos(angle),
        y: 135 + radius * Math.sin(angle),
      };
    });
  }, [relatedConcepts]);

  const handleNodeClick = async (node) => {
    if (loading && selectedNode?.id === node.id) return;
    setSelectedNode(node);
    setNodeInfo(null);

    if (!apiKey) {
      setNodeInfo({
        title: node.concept,
        text: node.description,
        relation: `它与「${concept.concept}」同属「${getMainCategory(concept.category)}」知识域，可作为继续发散学习的下一个入口。`,
      });
      return;
    }

    const prompt = `你是一位知识关联导师。当前学习者刚学完概念「${concept.concept}」（${concept.category}：${concept.description}）。
现在学习者点击了关联概念「${node.concept}」（${node.category}：${node.description}）。
请用中文输出两部分内容：
1. 用80字以内解释「${node.concept}」；
2. 用80字以内说明它与「${concept.concept}」之间的紧密联系，以及为什么适合作为下一步发散学习。`;

    const result = await chat([{ role: 'user', content: prompt }]);
    setNodeInfo({
      title: node.concept,
      text: result || node.description,
      relation: null,
    });
  };

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="relative mx-auto" style={{ width: 320, height: 270 }}>
        <svg className="absolute inset-0" width="320" height="270" viewBox="0 0 320 270">
          {positions.map((pos, i) => (
            <line
              key={i}
              x1="160"
              y1="135"
              x2={pos.x}
              y2={pos.y}
              stroke={selectedNode?.id === relatedConcepts[i].id ? '#8B7355' : '#2A2A2A'}
              strokeWidth={selectedNode?.id === relatedConcepts[i].id ? 1.6 : 1}
              strokeDasharray="3 4"
            />
          ))}
        </svg>

        {/* 中心气泡 */}
        <div
          className="absolute flex items-center justify-center text-center rounded-full px-4"
          style={{
            left: 160,
            top: 135,
            transform: 'translate(-50%, -50%)',
            width: 104,
            height: 104,
            background: '#1A1A1A',
            border: `1.5px solid ${getCategoryColor(concept.category)}`,
            color: '#E8E0D5',
            boxShadow: '0 0 24px rgba(232,224,213,0.08)',
            fontSize: 12,
            lineHeight: 1.5,
            zIndex: 2,
          }}
        >
          {concept.concept}
        </div>

        {/* 关联气泡 */}
        {relatedConcepts.map((node, i) => {
          const pos = positions[i];
          const active = selectedNode?.id === node.id;
          return (
            <button
              key={node.id}
              onClick={() => handleNodeClick(node)}
              className="absolute flex items-center justify-center text-center rounded-full px-3 transition-all hover:scale-105"
              style={{
                left: pos.x,
                top: pos.y,
                transform: 'translate(-50%, -50%)',
                width: 76,
                height: 76,
                background: active ? '#201A14' : '#111',
                border: `1px solid ${active ? getCategoryColor(node.category) : '#2A2A2A'}`,
                color: active ? '#E8E0D5' : '#999',
                fontSize: 10,
                lineHeight: 1.4,
                zIndex: 2,
              }}
            >
              {node.concept}
            </button>
          );
        })}
      </div>

      {/* 信息面板 */}
      <div className="p-4" style={{ background: '#0F0F0F', border: '1px solid #222', minHeight: 110 }}>
        {!selectedNode && (
          <p className="text-xs text-center" style={{ color: '#555', lineHeight: 1.8 }}>
            点击周围的气泡，探索与「{concept.concept}」紧密关联的概念
            {apiKey ? '，AI 会为你解释并说明两者的联系。' : '。接入 AI 后可获得更深入的关联讲解。'}
          </p>
        )}

        {selectedNode && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles size={13} style={{ color: getCategoryColor(selectedNode.category) }} />
                <span className="text-sm" style={{ color: '#E8E0D5' }}>{selectedNode.concept}</span>
                <span className="text-[10px] px-2 py-0.5" style={{ color: getCategoryColor(selectedNode.category), border: `1px solid ${getCategoryColor(selectedNode.category)}33` }}>
                  {selectedNode.category}
                </span>
              </div>
              <button onClick={() => { setSelectedNode(null); setNodeInfo(null); }} className="hover:opacity-70">
                <X size={14} style={{ color: '#555' }} />
              </button>
            </div>

            {loading ? (
              <div className="flex items-center gap-2 text-xs" style={{ color: '#777' }}>
                <Loader2 size={13} className="animate-spin" /> AI 正在生成关联解释...
              </div>
            ) : nodeInfo ? (
              <div className="text-xs" style={{ color: '#999', lineHeight: 1.9, whiteSpace: 'pre-wrap' }}>
                {nodeInfo.text}
                {nodeInfo.relation && (
                  <p className="mt-2" style={{ color: '#8B7355' }}>{nodeInfo.relation}</p>
                )}
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConceptGraph;
