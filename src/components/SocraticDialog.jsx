import React, { useState, useRef, useEffect } from 'react';
import { Send, ChevronRight, Loader2, Zap } from 'lucide-react';
import { useAiChat } from '@/hooks/useAiChat';

const FALLBACK_QUESTIONS = [
  (concept) => `你说你了解了「${concept}」，可以用一句话说出它最核心的是什么吗？`,
  (concept) => `这个概念解决了什么问题，或者揭示了什么反常识的现象？为什么它值得被单独命名和研究？`,
  () => `你能举一个生活中具体的、真实发生过的例子来说明这个概念吗？越具体越好。`,
  () => `如果这个概念描述的机制完全反过来运作，世界会有什么不同？这个反例说明了什么？`,
  (concept) => `学完「${concept}」之后，你的哪个既有认知被挑战或修正了？它与你之前知道的什么产生了连接或冲突？`,
];

const buildSocraticSystemPrompt = (concept) => `你是一位严格的苏格拉底式导师，正在对学生进行关于「${concept.concept}」（${concept.category}领域）的追问。

概念描述：${concept.description}

你的任务：
1. 仔细阅读学生的回答，判断其是否准确、深入、有无误解
2. 如果学生有明显错误，温和但直接地指出，不要只是肯定
3. 如果学生的回答停留在表面，追问更深层的机制
4. 如果学生回答得好，在简短肯定后提出更高层次的问题
5. 每次只问一个问题，问题要具体、有挑战性
6. 语言风格：简洁、严谨、有洞察力。不要说废话，不要过度夸奖

重要原则：你的目标是让学生真正思考，而不是让他感觉良好。如果答案有误，必须纠正。`;

const SocraticDialog = ({ concept, onComplete, apiKey, apiProvider }) => {
  const [step, setStep] = useState(0);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([]);
  const [initialInput, setInitialInput] = useState('');
  const [started, setStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const chatEndRef = useRef(null);
  const { chat, loading, error } = useAiChat(apiKey, apiProvider);

  const isAiMode = !!apiKey;

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history, currentQuestion]);

  const getNextQuestion = async (allHistory, stepNum) => {
    if (isAiMode) {
      const messages = [
        { role: 'system', content: buildSocraticSystemPrompt(concept) },
        ...allHistory.map(h => ({ role: h.role === 'user' ? 'user' : 'assistant', content: h.text })),
        { role: 'user', content: '请提出下一个追问。' }
      ];
      const aiReply = await chat(messages);
      return aiReply || FALLBACK_QUESTIONS[Math.min(stepNum, FALLBACK_QUESTIONS.length - 1)](concept.concept);
    }
    return FALLBACK_QUESTIONS[Math.min(stepNum, FALLBACK_QUESTIONS.length - 1)](concept.concept);
  };

  const handleStart = async () => {
    if (!initialInput.trim()) return;
    const userMsg = { role: 'user', text: initialInput };
    const newHistory = [userMsg];
    setHistory(newHistory);
    setStarted(true);
    setInitialInput('');

    const q = await getNextQuestion(newHistory, 0);
    setCurrentQuestion(q);
    setHistory([...newHistory, { role: 'assistant', text: q }]);
  };

  const handleAnswer = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: 'user', text: input };
    const newHistory = [...history, userMsg];
    setInput('');
    setHistory(newHistory);

    const maxSteps = isAiMode ? 5 : FALLBACK_QUESTIONS.length;
    if (step < maxSteps - 1) {
      const nextStep = step + 1;
      setStep(nextStep);
      const q = await getNextQuestion(newHistory, nextStep);
      const botMsg = { role: 'assistant', text: q };
      setHistory([...newHistory, botMsg]);
    } else {
      const closing = { role: 'assistant', text: '你的追问回答已经相当完整。现在进入费曼检验——请你像对一个完全不懂的人解释这个概念。' };
      setHistory([...newHistory, closing]);
      setTimeout(() => onComplete(newHistory), 1200);
    }
  };

  const isComplete = step >= (isAiMode ? 5 : FALLBACK_QUESTIONS.length);

  return (
    <div className="flex flex-col gap-4 w-full">
      {!started ? (
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 text-xs" style={{ color: '#666' }}>
            {isAiMode
              ? <><Zap size={11} style={{ color: '#C17B50' }} /> AI 追问模式已激活 · 问题将根据你的回答动态生成</>
              : <><span style={{ color: '#444' }}>预设问题模式 · 接入 API Key 可激活 AI 追问</span></>
            }
          </div>
          <p className="text-sm leading-relaxed" style={{ color: '#999' }}>
            你在15分钟内学习了「<span style={{ color: '#E8E0D5' }}>{concept.concept}</span>」。<br />
            请先告诉我，你从这段学习中获得了什么认知？
          </p>
          <textarea
            value={initialInput}
            onChange={e => setInitialInput(e.target.value)}
            placeholder="写下你对这个概念的初步认识，尽量具体..."
            className="w-full p-4 text-sm resize-none outline-none"
            style={{ background: '#1A1A1A', color: '#CCC', border: '1px solid #2A2A2A', minHeight: 120, lineHeight: 1.8 }}
            onKeyDown={e => { if (e.key === 'Enter' && e.metaKey) handleStart(); }}
          />
          <button onClick={handleStart} disabled={loading}
            className="self-end flex items-center gap-2 px-6 py-2.5 text-sm font-medium"
            style={{ background: '#E8E0D5', color: '#111', letterSpacing: '0.1em', opacity: loading ? 0.6 : 1 }}>
            {loading ? <Loader2 size={14} className="animate-spin" /> : null}
            开始追问 <ChevronRight size={14} />
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2 max-h-80 overflow-y-auto pr-1">
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
                  {msg.role === 'user' ? '你' : isAiMode ? 'AI 导师' : '导师'}
                </span>
                {msg.text}
              </div>
            ))}
            {loading && (
              <div className="p-4 flex items-center gap-2" style={{ background: '#161616', borderLeft: '2px solid #3A3A3A' }}>
                <Loader2 size={12} className="animate-spin" style={{ color: '#555' }} />
                <span className="text-xs" style={{ color: '#555' }}>AI 正在思考...</span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
          {error && (
            <div className="p-3 text-xs" style={{ background: '#1A0A0A', color: '#AA5555', border: '1px solid #2A1A1A' }}>
              API 错误：{error}。已切换回预设问题模式。
            </div>
          )}
          {!isComplete && (
            <div className="flex gap-2">
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="回答这个问题..."
                className="flex-1 p-3 text-sm resize-none outline-none"
                style={{ background: '#1A1A1A', color: '#CCC', border: '1px solid #2A2A2A', minHeight: 80, lineHeight: 1.8 }}
                onKeyDown={e => { if (e.key === 'Enter' && e.metaKey) handleAnswer(); }}
                disabled={loading}
              />
              <button onClick={handleAnswer} disabled={loading}
                className="px-4 self-end py-3 transition-all flex items-center"
                style={{ background: loading ? '#2A2A2A' : '#E8E0D5', color: loading ? '#666' : '#111' }}>
                {loading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SocraticDialog;
