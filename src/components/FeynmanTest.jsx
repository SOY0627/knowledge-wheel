import React, { useState, useRef, useEffect } from 'react';
import { Send, CheckCircle, Loader2, Zap } from 'lucide-react';
import { useAiChat } from '@/hooks/useAiChat';

const buildFeynmanSystemPrompt = (concept) => `你是一位严格的费曼检验评审官，正在评估学生是否真正理解了「${concept.concept}」（${concept.category}领域）。

概念描述：${concept.description}

评估标准：
1. 学生是否能用外行人也能理解的语言解释这个概念？
2. 解释中有无本质性错误或重大遗漏？
3. 有无用到恰当的日常类比？

你的任务：
- 如果解释有明显错误，直接指出哪里错了，并给出正确理解的方向（但不要直接给答案）
- 如果解释正确但太专业，要求重新用更简单的语言
- 如果解释正确且通俗但不完整，指出缺失了哪个关键点
- 如果解释完整、准确、通俗，输出以下格式：
  【通过】[你的简短评价，指出解释中最精彩的部分]

第一轮结束后，无论通过与否，请追问：「现在，请说出这个概念对你个人的启示——它改变了你对什么的看法？」
如果学生的启示回答有深度，输出：【完成】[最终评价]`;

const FALLBACK_FEEDBACK = [
  (c) => `你的解释触及了核心，但「${c}」的关键机制对非专业人士来说还不够直观。能加入一个日常生活中的具体比喻吗？避免使用专业术语重新解释一遍。`,
  () => `很好，解释更清晰了。最后一步：这个概念对你个人有什么启示？它改变了你对什么事情的看法？`,
];

const FeynmanTest = ({ concept, onComplete, apiKey, apiProvider }) => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([]);
  const [passed, setPassed] = useState(false);
  const [round, setRound] = useState(0);
  const chatEndRef = useRef(null);
  const { chat, loading, error } = useAiChat(apiKey, apiProvider);

  const isAiMode = !!apiKey;

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleSubmit = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: 'user', text: input };
    const newHistory = [...history, userMsg];
    setInput('');
    setHistory(newHistory);
    setRound(r => r + 1);

    if (isAiMode) {
      const messages = [
        { role: 'system', content: buildFeynmanSystemPrompt(concept) },
        ...newHistory.map(h => ({ role: h.role === 'user' ? 'user' : 'assistant', content: h.text })),
      ];
      const aiReply = await chat(messages);
      if (!aiReply) {
        const fb = FALLBACK_FEEDBACK[Math.min(round, FALLBACK_FEEDBACK.length - 1)](concept.concept);
        setHistory([...newHistory, { role: 'assistant', text: fb }]);
        if (round >= 1) { setPassed(true); setTimeout(() => onComplete(), 1200); }
        return;
      }
      if (aiReply.includes('【完成】') || (aiReply.includes('【通过】') && round >= 1)) {
        setHistory([...newHistory, { role: 'assistant', text: aiReply }]);
        setPassed(true);
        setTimeout(() => onComplete(), 1500);
      } else {
        setHistory([...newHistory, { role: 'assistant', text: aiReply }]);
      }
    } else {
      const maxRounds = FALLBACK_FEEDBACK.length;
      if (round < maxRounds) {
        const fb = FALLBACK_FEEDBACK[round](concept.concept);
        setHistory([...newHistory, { role: 'assistant', text: fb }]);
      } else {
        setPassed(true);
        setHistory([...newHistory, { role: 'assistant', text: '费曼检验通过。你已能用通俗语言完整解释这个概念，并联系到了个人启示。' }]);
        setTimeout(() => onComplete(), 1200);
      }
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex items-center gap-2 text-xs" style={{ color: '#666' }}>
        {isAiMode
          ? <><Zap size={11} style={{ color: '#C17B50' }} /> AI 评审模式 · 将根据你的解释进行针对性反馈</>
          : <span style={{ color: '#444' }}>预设反馈模式</span>
        }
      </div>
      <p className="text-sm leading-relaxed" style={{ color: '#999' }}>
        进入 <span style={{ color: '#E8E0D5' }}>费曼检验</span>——请用最简单的语言，向一个完全不懂的人解释「<span style={{ color: '#E8E0D5' }}>{concept.concept}</span>」。禁止使用专业术语。
      </p>

      <div className="flex flex-col gap-2">
        {history.map((msg, i) => (
          <div key={i} className="p-4 text-sm"
            style={{
              background: msg.role === 'user' ? '#1E1E1E' : '#161616',
              color: msg.role === 'user' ? '#DDD' : '#AAA',
              borderLeft: msg.role === 'assistant' ? '2px solid #3A3A3A' : 'none',
              lineHeight: 1.8,
              whiteSpace: 'pre-wrap',
            }}>
            <span style={{ fontSize: 10, color: '#444', display: 'block', marginBottom: 6, letterSpacing: '0.1em' }}>
              {msg.role === 'user' ? '你' : isAiMode ? 'AI 评审' : '评审'}
            </span>
            {msg.text}
          </div>
        ))}
        {loading && (
          <div className="p-4 flex items-center gap-2" style={{ background: '#161616', borderLeft: '2px solid #3A3A3A' }}>
            <Loader2 size={12} className="animate-spin" style={{ color: '#555' }} />
            <span className="text-xs" style={{ color: '#555' }}>AI 正在评审...</span>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {error && (
        <div className="p-3 text-xs" style={{ background: '#1A0A0A', color: '#AA5555', border: '1px solid #2A1A1A' }}>
          API 错误：{error}
        </div>
      )}

      {passed ? (
        <div className="flex items-center gap-3 p-4" style={{ background: '#0A1A0A', color: '#7AB87A', border: '1px solid #1A2A1A' }}>
          <CheckCircle size={16} />
          <span className="text-sm">费曼检验通过。你已真正掌握这个概念。</span>
        </div>
      ) : (
        <div className="flex gap-2">
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="用最简单的语言解释这个概念，不能使用专业术语..."
            className="flex-1 p-3 text-sm resize-none outline-none"
            style={{ background: '#1A1A1A', color: '#CCC', border: '1px solid #2A2A2A', minHeight: 100, lineHeight: 1.8 }}
            onKeyDown={e => { if (e.key === 'Enter' && e.metaKey) handleSubmit(); }}
            disabled={loading}
          />
          <button onClick={handleSubmit} disabled={loading}
            className="px-4 self-end py-3 flex items-center"
            style={{ background: loading ? '#2A2A2A' : '#E8E0D5', color: loading ? '#666' : '#111' }}>
            {loading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
          </button>
        </div>
      )}
    </div>
  );
};

export default FeynmanTest;
