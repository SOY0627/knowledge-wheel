import { knowledgeConcepts } from '@/data/knowledgeConcepts';
import { deepContentMap } from '@/data/deepContent';

// 针对每个概念的苏格拉底追问（预设模式）
const socraticQuestionsMap = {
  "美拉德反应": [
    (c) => `你说你了解了「${c}」，能用一句话说出：是什么两类物质在什么条件下发生了反应？`,
    () => `为什么蒸和煮永远无法让食物产生焦香味？这与美拉德反应的触发条件有什么直接关系？`,
    () => `你能举一个你亲手做过或吃到过的、能明显感受到美拉德反应结果的例子吗？`,
    () => `如果美拉德反应的温度阈值不是140°C而是60°C，我们的饮食习惯会发生什么本质改变？`,
    () => `学完这个概念，你认为中餐「大火爆炒」背后的科学逻辑是什么？它与美拉德反应如何联系？`,
  ],
  "习得性无助": [
    (c) => `「${c}」这个概念里，「习得」这两个字最关键——它意味着什么？与天生的无助有何本质区别？`,
    () => `塞利格曼实验中，第二组狗在可以逃跑时却不逃跑——它们缺失的不是能力，而是什么？`,
    () => `你在自己或周围人身上，见过类似「习得性无助」的表现吗？那个情境是什么？`,
    () => `如果你要帮一个陷入习得性无助的朋友重建「行动有意义」的信念，你会从哪里开始？`,
    () => `这个概念如何解释「长期高控制型管理」下的员工为何创造力会枯竭？请具体分析机制。`,
  ],
  "峰终定律": [
    (c) => `「${c}」告诉我们，人类对一段体验的记忆是如何被「采样」的？这与「平均体验」有什么根本差距？`,
    () => `卡尼曼说人有两个自我：体验自我和记忆自我。你认为我们日常做决策时，哪个自我在主导？这会带来什么问题？`,
    () => `你有没有一段「过程很痛苦但结尾很好」的体验，事后记忆反而是美好的？那是什么？`,
    () => `「持续时间忽视」意味着：一段2小时的美好旅行和1天的美好旅行，记忆中的好坏程度可能相同。这对你规划体验有什么具体启示？`,
    () => `迪士尼乐园如何利用峰终定律来设计游客体验？请猜测他们可能在哪些环节刻意「优化」了峰值和终值。`,
  ],
  "推恩令的博弈论": [
    (c) => `「${c}」中，汉武帝的核心策略是什么？为什么这比直接武力镇压更高明？`,
    () => `诸侯王面对推恩令，为什么「拒绝」和「接受」都是对中央有利的选择？这个博弈结构叫什么？`,
    () => `你能举一个现代商业或政治中，类似「让对方自愿参与瓦解自己」的案例吗？`,
    () => `推恩令的本质是「用激励结构替代强制力」。你认为这种制度设计的局限性是什么？什么情况下它会失效？`,
    () => `学完这个概念，你如何重新理解「软实力」这个词？它与推恩令的逻辑有何相通之处？`,
  ],
  "通货膨胀税": [
    (c) => `「${c}」为什么被称为「税」？它与正式税收的本质区别是什么？`,
    () => `为什么通货膨胀税对穷人的打击比对富人更重？请从资产结构的角度分析。`,
    () => `美联储在2020年将资产负债表从4万亿扩张到9万亿美元，这对持有美元现金的普通人意味着什么？`,
    () => `为什么几乎所有央行都设定2%通胀目标而非0%？完全不通胀会有什么问题？`,
    () => `理解了通货膨胀税之后，你认为「把钱存银行」是一种什么性质的财务决策？它隐藏了什么代价？`,
  ],
  "default": [
    (concept) => `你说你了解了「${concept}」，可以用一句话说出它最核心的是什么吗？`,
    (concept) => `这个概念解决了什么问题，或者揭示了什么反常识的现象？为什么它值得被单独命名？`,
    () => `你能举一个生活中具体的、真实发生过的例子来说明这个概念吗？越具体越好。`,
    () => `如果这个概念描述的机制完全反过来运作，世界会有什么不同？这个反例说明了什么？`,
    (concept) => `学完「${concept}」之后，你的哪个既有认知被挑战或修正了？`,
  ],
};

// 针对每个概念的费曼检验反馈
const feynmanFeedbackMap = {
  "美拉德反应": [
    (c) => `你的解释提到了关键反应，但「${c}」对非专业人士最难理解的是：为什么烧烤的香味和糖果的焦糖味本质上不同？能用一个具体的厨房场景来区分这两种反应吗？`,
    () => `很好！现在说说：这个反应对你个人下厨有什么具体改变？你之后会调整哪个烹饪习惯？`,
  ],
  "习得性无助": [
    (c) => `你解释了「${c}」的现象，但没有触及最关键的机制：为什么第二组狗「知道」能逃跑却不去做？大脑里发生了什么？能用一个日常的人类例子来类比吗？`,
    () => `很好！这个概念对你个人有什么启示？你有没有一件一直不去做、但其实是因为过去经历让你「学会了放弃」的事？`,
  ],
  "峰终定律": [
    (c) => `你解释了「${c}」的基本概念，但忘记了最反直觉的那个发现：持续时间更长的痛苦体验，记忆中反而可能更好——能用卡尼曼的结肠镜实验来解释这个悖论吗？`,
    () => `说得很好！最后一步：你会如何用峰终定律来改善你生活中某个具体的「体验设计」——比如和朋友的聚会、一次学习、或一次谈话的方式？`,
  ],
  "default": [
    (c) => `你的解释触及了核心，但「${c}」的关键机制对非专业人士来说还不够直观。能加入一个日常生活中的具体比喻吗？避免使用专业术语重新解释一遍。`,
    () => `很好，解释更清晰了。最后一步：这个概念对你个人有什么启示？它改变了你对什么事情的看法？`,
  ],
};

// 获取概念对应的苏格拉底问题（JS字符串格式）
const getSocraticQsCode = (conceptName) => {
  if (socraticQuestionsMap[conceptName]) return conceptName;
  return 'default';
};

// 获取概念对应的费曼反馈（JS字符串格式）
const getFeynmanFbCode = (conceptName) => {
  if (feynmanFeedbackMap[conceptName]) return conceptName;
  return 'default';
};

export const generateFullHtml = () => {
  // 序列化词库
  const conceptsJson = JSON.stringify(knowledgeConcepts.map(c => ({
    id: c.id, category: c.category, concept: c.concept, description: c.description
  })));

  // 序列化深度内容
  const deepContentEntries = Object.entries(deepContentMap)
    .filter(([key]) => key !== '默认')
    .map(([key, val]) => {
      return `${JSON.stringify(key)}: ${JSON.stringify(val.layers)}`;
    }).join(',\n');

  // 序列化苏格拉底问题（针对性）
  const socraticEntries = Object.entries(socraticQuestionsMap)
    .filter(([key]) => key !== 'default')
    .map(([key, fns]) => {
      const fnStrings = fns.map(fn => fn.toString()).join(',\n');
      return `${JSON.stringify(key)}: [\n${fnStrings}\n]`;
    }).join(',\n');

  const defaultSocratic = socraticQuestionsMap['default'].map(fn => fn.toString()).join(',\n');

  // 序列化费曼反馈（针对性）
  const feynmanEntries = Object.entries(feynmanFeedbackMap)
    .filter(([key]) => key !== 'default')
    .map(([key, fns]) => {
      const fnStrings = fns.map(fn => fn.toString()).join(',\n');
      return `${JSON.stringify(key)}: [\n${fnStrings}\n]`;
    }).join(',\n');

  const defaultFeynman = feynmanFeedbackMap['default'].map(fn => fn.toString()).join(',\n');

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
  <title>知识转盘 · Knowledge Studio</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #0D0D0D; color: #E8E0D5; font-family: -apple-system, BlinkMacSystemFont, 'PingFang SC', 'Hiragino Sans GB', sans-serif; min-height: 100vh; }
    .header-wrap { border-bottom: 1px solid #1A1A1A; }
    .header { max-width: 720px; margin: 0 auto; padding: 20px 24px; display: flex; align-items: center; justify-content: space-between; }
    .header-title { font-size: 11px; font-weight: 500; letter-spacing: 0.2em; text-transform: uppercase; color: #E8E0D5; }
    .header-sub { font-size: 10px; color: #444; letter-spacing: 0.08em; margin-top: 3px; }
    .main { max-width: 720px; margin: 0 auto; padding: 40px 24px; display: flex; flex-direction: column; gap: 32px; }
    .step-indicator { display: flex; align-items: center; }
    .step-item { display: flex; flex-direction: column; align-items: center; gap: 6px; flex: 1; }
    .step-icon { width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; font-size: 13px; }
    .step-label { font-size: 10px; letter-spacing: 0.05em; color: #333; text-align: center; }
    .step-label.active { color: #E8E0D5; }
    .step-label.done { color: #555; }
    .step-connector { flex: 1; height: 1px; background: #1E1E1E; max-width: 40px; margin-bottom: 16px; }
    .step-connector.done { background: #333; }
    .card { background: #161616; border: 1px solid #2A2A2A; padding: 24px; }
    .card-tag { display: inline-block; font-size: 10px; padding: 4px 10px; background: #1E1E1E; letter-spacing: 0.08em; margin-bottom: 16px; }
    .card-title { font-size: 24px; font-weight: 300; letter-spacing: 0.05em; margin-bottom: 12px; color: #E8E0D5; }
    .card-desc { font-size: 13px; color: #777; line-height: 1.9; }
    .panel { background: #111; border: 1px solid #1E1E1E; padding: 24px; }
    .panel-header { display: flex; align-items: center; gap: 8px; margin-bottom: 20px; }
    .panel-bar { width: 4px; height: 16px; background: #E8E0D5; flex-shrink: 0; }
    .panel-title { font-size: 10px; font-weight: 500; letter-spacing: 0.15em; text-transform: uppercase; color: #888; }
    .btn-primary { background: #E8E0D5; color: #111; border: none; padding: 10px 24px; font-size: 11px; font-weight: 500; letter-spacing: 0.15em; text-transform: uppercase; cursor: pointer; transition: opacity 0.2s; }
    .btn-primary:hover { opacity: 0.85; }
    .btn-primary:disabled { background: #2A2A2A; color: #666; cursor: not-allowed; }
    .btn-secondary { background: #2A2A2A; color: #888; border: 1px solid #333; padding: 10px 24px; font-size: 11px; letter-spacing: 0.12em; cursor: pointer; }
    .btn-ghost { background: none; border: none; color: #555; font-size: 11px; letter-spacing: 0.1em; cursor: pointer; display: flex; align-items: center; gap: 6px; }
    .btn-ghost:hover { opacity: 0.7; }
    textarea { background: #1A1A1A; color: #CCC; border: 1px solid #2A2A2A; padding: 12px; font-size: 13px; line-height: 1.8; resize: none; outline: none; font-family: inherit; width: 100%; }
    textarea::placeholder { color: #444; }
    .msg-user { background: #222; color: #DDD; padding: 16px; font-size: 13px; line-height: 1.8; margin-bottom: 4px; }
    .msg-bot { background: #1A1A1A; color: #AAA; padding: 16px; font-size: 13px; line-height: 1.8; border-left: 2px solid #3A3A3A; margin-bottom: 4px; }
    .msg-label { font-size: 10px; color: #444; display: block; margin-bottom: 6px; letter-spacing: 0.1em; }
    .chat-wrap { display: flex; flex-direction: column; gap: 4px; max-height: 320px; overflow-y: auto; margin-bottom: 12px; }
    .input-row { display: flex; gap: 8px; }
    .btn-send { background: #E8E0D5; color: #111; border: none; padding: 12px 16px; cursor: pointer; flex-shrink: 0; font-size: 14px; }
    .timer-wrap { display: flex; flex-direction: column; align-items: center; gap: 24px; }
    .timer-text { font-size: 28px; font-weight: 300; letter-spacing: 0.1em; color: #E8E0D5; font-variant-numeric: tabular-nums; }
    .accordion-item { border: 1px solid #2A2A2A; margin-bottom: 4px; }
    .accordion-btn { width: 100%; background: #111; border: none; color: #666; padding: 16px; font-size: 13px; font-weight: 500; text-align: left; cursor: pointer; display: flex; justify-content: space-between; align-items: center; font-family: inherit; }
    .accordion-btn.open { background: #1A1A1A; color: #E8E0D5; }
    .accordion-body { background: #1A1A1A; padding: 20px; font-size: 13px; color: #AAA; line-height: 2; border-top: 1px solid #222; white-space: pre-wrap; }
    .success-box { background: #0A1A0A; border: 1px solid #1A2A1A; padding: 24px; text-align: center; }
    .intro-title { font-size: 22px; font-weight: 300; letter-spacing: 0.05em; color: #E8E0D5; text-align: center; margin-bottom: 12px; }
    .intro-sub { font-size: 13px; color: #555; line-height: 1.8; text-align: center; max-width: 340px; margin: 0 auto 24px; }
    .cat-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
    .cat-item { background: #111; border: 1px solid #1E1E1E; color: #555; font-size: 11px; text-align: center; padding: 12px 8px; letter-spacing: 0.05em; }
    .wheel-wrap { display: flex; flex-direction: column; align-items: center; gap: 24px; }
    .wheel-container { position: relative; display: flex; align-items: center; justify-content: center; }
    .wheel-pointer { position: absolute; right: -2px; top: 50%; transform: translateY(-50%); width: 0; height: 0; border-top: 10px solid transparent; border-bottom: 10px solid transparent; border-right: 22px solid #E8E0D5; filter: drop-shadow(0 0 6px rgba(232,224,213,0.6)); z-index: 10; }
    .footer { border-top: 1px solid #1A1A1A; padding: 24px; text-align: center; }
    .footer p { font-size: 10px; color: #2A2A2A; letter-spacing: 0.1em; }
    @media (max-width: 600px) { .main { padding: 24px 16px; } .header { padding: 16px; } .step-label { display: none; } .card { padding: 16px; } .panel { padding: 16px; } }
  </style>
</head>
<body>
<div class="header-wrap">
  <div class="header">
    <div>
      <div class="header-title">知识转盘</div>
      <div class="header-sub">Personal Knowledge Studio</div>
    </div>
    <button class="btn-ghost" id="resetBtn" style="display:none" onclick="handleReset()">↺ 重新开始</button>
  </div>
</div>
<main class="main">
  <div id="stepIndicator" class="step-indicator"></div>
  <div id="appContent"></div>
</main>
<footer class="footer"><p>KNOWLEDGE STUDIO · 150个精选概念 · 每次15分钟</p></footer>

<script>
// ============================================================
// 词库数据
// ============================================================
const knowledgeConcepts = ${conceptsJson};

const categoryColors = {
  "食": "#8B7355", "住": "#6B8CAE", "健康": "#7A9E7E",
  "中国史": "#C17B50", "世界史": "#9B6B8A",
  "法律": "#5B7B9B", "法政": "#5B7B9B",
  "地理": "#6B9B8A", "博物": "#A0896B", "古书": "#8B7B6B",
};
function getCatColor(cat) {
  const k = Object.keys(categoryColors).find(k => cat.startsWith(k));
  return k ? categoryColors[k] : "#888";
}

// ============================================================
// 针对性苏格拉底问题
// ============================================================
const SOCRATIC_MAP = {
  ${socraticEntries}
};
const SOCRATIC_DEFAULT = [${defaultSocratic}];
function getSocraticQuestions(concept) {
  return SOCRATIC_MAP[concept] || SOCRATIC_DEFAULT;
}

// ============================================================
// 针对性费曼检验反馈
// ============================================================
const FEYNMAN_MAP = {
  ${feynmanEntries}
};
const FEYNMAN_DEFAULT = [${defaultFeynman}];
function getFeynmanFeedback(concept) {
  return FEYNMAN_MAP[concept] || FEYNMAN_DEFAULT;
}

// ============================================================
// 深度内容
// ============================================================
const DEEP_CONTENT = {
  ${deepContentEntries}
};
function getDeepLayers(concept) {
  if (DEEP_CONTENT[concept.concept]) return DEEP_CONTENT[concept.concept];
  return [
    { layer: "表层：基本定义与起源", text: "「" + concept.concept + "」——" + concept.description + "\\n\\n这个概念从何而来？每一个知识概念都有其历史起源和命名逻辑。理解它最初是在什么语境下被提出，是掌握它的第一步。" },
    { layer: "中层：运作机制与内部逻辑", text: "深入到「" + concept.concept + "」的内部，它是如何运作的？\\n\\n" + concept.category + "领域中，这个概念的核心机制值得反复追问：为什么是这样运作，而不是别的方式？有没有例外情况？在哪些边界条件下这个概念会失效？" },
    { layer: "深层：知识迁移与批判性应用", text: "掌握「" + concept.concept + "」的最终意义，是将它的底层逻辑迁移到你尚未遇到的问题中。\\n\\n批判性追问：这个概念有哪些常见误用？哪些看似相关的情况其实并不适用？\\n\\n跨域迁移：" + concept.category + "领域的这个规律，在其他领域有无对应结构？历史、经济、心理——知识的最高境界是发现不同领域中相同的深层模式。" },
  ];
}

// ============================================================
// 应用状态
// ============================================================
let step = 0, concept = null;
let timerSecs = 15*60, timerRunning = false, timerDone = false, timerInterval = null;
let socStarted = false, socHistory = [], socStep = 0;
let feynHistory = [], feynRound = 0, feynPassed = false;
let accordionOpen = 0;
let wheelRot = 0, wheelAnimating = false;

const STEPS = [
  { label: '转盘选题', icon: '⟳' },
  { label: '自主学习', icon: '⏱' },
  { label: '苏格拉底', icon: '✦' },
  { label: '费曼检验', icon: '◎' },
  { label: '深度讲解', icon: '❋' },
];

const WHEEL_CATS = ['食·烹饪','食·生活','住·金融','住·建筑','健康·心理','健康·运动','中国史','世界史','法律','地理','博物','古书'];
const WHEEL_COLORS = ['#2C2015','#1A2030','#1A2015','#252020','#201A25','#1A2520','#252018','#1E1A25','#1A2025','#1A2520','#25201A','#201E1A'];
const TEXT_COLORS = ['#C4A882','#8AAACF','#8EBF92','#8EB0CF','#B08EC4','#8EC4A5','#D4966A','#B08EC4','#7A9EBF','#8EC4B0','#C4A87A','#B0A08A'];

// ============================================================
// 渲染
// ============================================================
function render() {
  renderSteps();
  document.getElementById('resetBtn').style.display = step > 0 ? 'flex' : 'none';
  const el = document.getElementById('appContent');
  if (step === 0) { el.innerHTML = renderStep0(); initWheel(); }
  else if (step === 1) { el.innerHTML = renderStep1(); updateTimer(); }
  else if (step === 2) { el.innerHTML = renderStep2(); }
  else if (step === 3) { el.innerHTML = renderStep3(); }
  else if (step === 4) { el.innerHTML = renderStep4(); }
}

function renderSteps() {
  const el = document.getElementById('stepIndicator');
  let h = '';
  STEPS.forEach((s, i) => {
    const isA = i === step, isD = i < step;
    h += '<div class="step-item">' +
      '<div class="step-icon" style="background:' + (isA ? '#E8E0D5' : isD ? '#2A2A2A' : '#1A1A1A') + ';border:' + (isA ? 'none' : isD ? '1px solid #444' : '1px solid #222') + ';color:' + (isA ? '#111' : isD ? '#888' : '#333') + '">' + s.icon + '</div>' +
      '<div class="step-label ' + (isA ? 'active' : isD ? 'done' : '') + '">' + s.label + '</div>' +
      '</div>';
    if (i < STEPS.length - 1) h += '<div class="step-connector ' + (isD ? 'done' : '') + '"></div>';
  });
  el.innerHTML = h;
}

function conceptCard() {
  const c = concept, col = getCatColor(c.category);
  return '<div class="card"><div style="margin-bottom:16px"><span class="card-tag" style="color:' + col + ';border:1px solid ' + col + '33">' + c.category + '</span></div><div class="card-title">' + c.concept + '</div><div class="card-desc">' + c.description + '</div></div>';
}

// ============================================================
// Step 0
// ============================================================
function renderStep0() {
  return '<div style="display:flex;flex-direction:column;gap:32px">' +
    '<div><div class="intro-title">今天学什么？</div><div class="intro-sub">转动转盘，从150个精选知识概念中随机抽取一个，开启15分钟的深度学习之旅。</div></div>' +
    '<div class="wheel-wrap"><div class="wheel-container"><canvas id="wc" width="280" height="280" style="border-radius:50%"></canvas><div class="wheel-pointer"></div></div>' +
    '<button class="btn-primary" id="spinBtn" onclick="spin()">转动转盘</button></div>' +
    '<div class="cat-grid"><div class="cat-item">食·住·健康</div><div class="cat-item">中国史·世界史</div><div class="cat-item">法律·地理·博物·古书</div></div></div>';
}

function initWheel() { drawWheel(wheelRot); }

function drawWheel(rot) {
  const canvas = document.getElementById('wc');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const size = 280, cx = 140, r = 132, N = 12, sa = (2 * Math.PI) / N;
  ctx.clearRect(0, 0, size, size);
  for (let i = 0; i < N; i++) {
    const a1 = rot + i * sa, a2 = a1 + sa;
    ctx.beginPath(); ctx.moveTo(cx, cx); ctx.arc(cx, cx, r, a1, a2); ctx.closePath();
    ctx.fillStyle = WHEEL_COLORS[i]; ctx.fill();
    ctx.strokeStyle = '#0D0D0D'; ctx.lineWidth = 1.5; ctx.stroke();
    ctx.save(); ctx.translate(cx, cx); ctx.rotate(a1 + sa / 2);
    ctx.textAlign = 'right'; ctx.fillStyle = TEXT_COLORS[i];
    ctx.font = '500 10.5px -apple-system, PingFang SC, sans-serif';
    ctx.fillText(WHEEL_CATS[i], r - 10, 3.5); ctx.restore();
  }
  ctx.beginPath(); ctx.arc(cx, cx, r, 0, 2 * Math.PI);
  ctx.strokeStyle = '#2A2A2A'; ctx.lineWidth = 2; ctx.stroke();
  ctx.beginPath(); ctx.arc(cx, cx, 28, 0, 2 * Math.PI);
  ctx.fillStyle = '#111'; ctx.fill(); ctx.strokeStyle = '#3A3A3A'; ctx.lineWidth = 1.5; ctx.stroke();
  ctx.beginPath(); ctx.arc(cx, cx, 5, 0, 2 * Math.PI); ctx.fillStyle = '#E8E0D5'; ctx.fill();
}

function spin() {
  if (wheelAnimating) return;
  wheelAnimating = true;
  document.getElementById('spinBtn').disabled = true;
  document.getElementById('spinBtn').textContent = '旋转中...';
  const total = (6 + Math.random() * 4) * 2 * Math.PI + Math.random() * 2 * Math.PI;
  const dur = 4000, t0 = performance.now(), r0 = wheelRot;
  function animate(now) {
    const p = Math.min((now - t0) / dur, 1), e = 1 - Math.pow(1 - p, 4);
    wheelRot = r0 + total * e; drawWheel(wheelRot);
    if (p < 1) { requestAnimationFrame(animate); return; }
    wheelAnimating = false;
    const nr = ((wheelRot % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
    const pt = ((2 * Math.PI - nr) % (2 * Math.PI));
    const seg = Math.floor(pt / ((2 * Math.PI) / 12)) % 12;
    const cat = WHEEL_CATS[seg], main = cat.split('·')[0];
    const pool = knowledgeConcepts.filter(c => c.category.startsWith(main));
    concept = (pool.length > 0 ? pool : knowledgeConcepts)[Math.floor(Math.random() * (pool.length > 0 ? pool.length : knowledgeConcepts.length))];
    timerSecs = 15*60; timerRunning = false; timerDone = false; step = 1; render();
  }
  requestAnimationFrame(animate);
}

// ============================================================
// Step 1
// ============================================================
function renderStep1() {
  return '<div style="display:flex;flex-direction:column;gap:24px">' + conceptCard() +
    '<div class="panel" style="text-align:center"><p style="font-size:10px;letter-spacing:0.1em;text-transform:uppercase;color:#555;margin-bottom:24px">不借助AI · 15分钟自主探索</p>' +
    '<div class="timer-wrap"><div style="position:relative;width:160px;height:160px">' +
    '<svg width="160" height="160" style="transform:rotate(-90deg)"><circle cx="80" cy="80" r="68" fill="none" stroke="#222" stroke-width="4"/><circle id="tc" cx="80" cy="80" r="68" fill="none" stroke="#E8E0D5" stroke-width="4" stroke-dasharray="' + (2*Math.PI*68) + '" stroke-dashoffset="' + (2*Math.PI*68) + '" stroke-linecap="round"/></svg>' +
    '<div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center"><span id="td" style="font-size:28px;font-weight:300;letter-spacing:0.1em;color:#E8E0D5;font-variant-numeric:tabular-nums">15:00</span><span style="font-size:11px;color:#666;letter-spacing:0.1em;margin-top:4px">自主学习</span></div></div>' +
    '<div id="tbtn"><button class="btn-primary" onclick="startTimer()">▶ 开始计时</button></div></div></div></div>';
}

function updateTimer() {
  const mm = String(Math.floor(timerSecs / 60)).padStart(2,'0'), ss = String(timerSecs % 60).padStart(2,'0');
  const d = document.getElementById('td'); if (d) d.textContent = mm + ':' + ss;
  const c = document.getElementById('tc'); if (c) c.setAttribute('stroke-dashoffset', 2*Math.PI*68*(1 - (1 - timerSecs/(15*60))));
}

function startTimer() {
  timerRunning = true;
  document.getElementById('tbtn').innerHTML = '<button class="btn-secondary" onclick="stopTimer()">■ 结束学习</button>';
  timerInterval = setInterval(() => { timerSecs--; updateTimer(); if (timerSecs <= 0) { clearInterval(timerInterval); endTimer(); } }, 1000);
}

function stopTimer() { clearInterval(timerInterval); endTimer(); }

function endTimer() {
  timerDone = true;
  const b = document.getElementById('tbtn');
  if (b) b.innerHTML = '<p style="font-size:12px;color:#888">学习时间结束，请分享你的认知。</p>';
  setTimeout(() => { step = 2; socStarted = false; socHistory = []; socStep = 0; render(); }, 1200);
}

// ============================================================
// Step 2: 苏格拉底追问（针对性问题）
// ============================================================
function renderStep2() {
  const questions = getSocraticQuestions(concept.concept);
  let body = '';
  if (!socStarted) {
    body = '<p style="font-size:13px;color:#999;line-height:1.8;margin-bottom:16px">你在15分钟内学习了「<span style="color:#E8E0D5">' + concept.concept + '</span>」。<br/>请先告诉我，你从这段学习中获得了什么认知？</p>' +
      '<textarea id="si" rows="5" placeholder="写下你对这个概念的初步认识，尽量具体..."></textarea>' +
      '<div style="display:flex;justify-content:flex-end;margin-top:12px"><button class="btn-primary" onclick="startSoc()">开始追问 →</button></div>';
  } else {
    let h = '';
    socHistory.forEach(m => {
      h += '<div class="' + (m.r === 'u' ? 'msg-user' : 'msg-bot') + '"><span class="msg-label">' + (m.r === 'u' ? '你' : '导师') + '</span>' + m.t + '</div>';
    });
    const isEnd = socStep >= questions.length;
    const input = isEnd ? '' : '<div class="input-row" style="margin-top:12px"><textarea id="sa" rows="3" placeholder="回答这个问题..."></textarea><button class="btn-send" onclick="answerSoc()">→</button></div>';
    body = '<div class="chat-wrap">' + h + '</div>' + input;
  }
  return '<div style="display:flex;flex-direction:column;gap:24px">' + conceptCard() +
    '<div class="panel"><div class="panel-header"><div class="panel-bar"></div><div class="panel-title">苏格拉底追问</div></div>' + body + '</div></div>';
}

function startSoc() {
  const v = document.getElementById('si').value.trim(); if (!v) return;
  const qs = getSocraticQuestions(concept.concept);
  socHistory = [{ r: 'u', t: v }, { r: 'a', t: qs[0](concept.concept) }];
  socStarted = true; socStep = 0; render();
}

function answerSoc() {
  const v = document.getElementById('sa').value.trim(); if (!v) return;
  const qs = getSocraticQuestions(concept.concept);
  socHistory.push({ r: 'u', t: v }); socStep++;
  if (socStep < qs.length) {
    socHistory.push({ r: 'a', t: qs[socStep](concept.concept) }); render();
  } else {
    socHistory.push({ r: 'a', t: '你的追问回答已经相当完整。现在进入费曼检验——请你像对一个完全不懂的人解释这个概念。' }); render();
    setTimeout(() => { step = 3; feynHistory = []; feynRound = 0; feynPassed = false; render(); }, 1400);
  }
}

// ============================================================
// Step 3: 费曼检验（针对性反馈）
// ============================================================
function renderStep3() {
  const fbs = getFeynmanFeedback(concept.concept);
  let body = '<p style="font-size:13px;color:#999;line-height:1.8;margin-bottom:16px">进入 <span style="color:#E8E0D5">费曼检验</span>——请用最简单的语言，向一个完全不懂的人解释「<span style="color:#E8E0D5">' + concept.concept + '</span>」。禁止使用专业术语。</p>';
  let h = '';
  feynHistory.forEach((m, i) => {
    h += '<div class="' + (m.r === 'u' ? 'msg-user' : 'msg-bot') + '"><span class="msg-label">' + (m.r === 'u' ? '你' : '评审') + '</span>' + m.t + '</div>';
  });
  if (h) body += '<div style="display:flex;flex-direction:column;gap:4px;margin-bottom:12px">' + h + '</div>';
  if (feynPassed) {
    body += '<div style="background:#0A1A0A;border:1px solid #1A2A1A;padding:16px;color:#7AB87A;font-size:13px">✓ 费曼检验通过。你已真正掌握这个概念。</div>';
  } else {
    body += '<div class="input-row"><textarea id="fi" rows="4" placeholder="用最简单的语言解释这个概念，不能使用专业术语..."></textarea><button class="btn-send" onclick="submitFeyn()">→</button></div>';
  }
  return '<div style="display:flex;flex-direction:column;gap:24px">' + conceptCard() +
    '<div class="panel"><div class="panel-header"><div class="panel-bar"></div><div class="panel-title">费曼检验</div></div>' + body + '</div></div>';
}

function submitFeyn() {
  const v = document.getElementById('fi').value.trim(); if (!v) return;
  const fbs = getFeynmanFeedback(concept.concept);
  feynHistory.push({ r: 'u', t: v });
  if (feynRound < fbs.length) {
    feynHistory.push({ r: 'a', t: fbs[feynRound](concept.concept) });
    feynRound++; render();
  } else {
    feynPassed = true; render();
    setTimeout(() => { step = 4; accordionOpen = 0; render(); }, 1200);
  }
}

// ============================================================
// Step 4: 深度讲解
// ============================================================
function renderStep4() {
  const layers = getDeepLayers(concept);
  let acc = '';
  layers.forEach((l, i) => {
    const isO = accordionOpen === i;
    acc += '<div class="accordion-item"><button class="accordion-btn ' + (isO ? 'open' : '') + '" onclick="toggleAcc(' + i + ')"><span><span style="color:#444;margin-right:12px">0' + (i+1) + '</span>' + l.layer + '</span><span>' + (isO ? '▲' : '▼') + '</span></button>' +
      (isO ? '<div class="accordion-body">' + l.text + '</div>' : '') + '</div>';
  });
  return '<div style="display:flex;flex-direction:column;gap:24px">' + conceptCard() +
    '<div class="panel"><div class="panel-header"><div class="panel-bar"></div><div class="panel-title">深度讲解</div></div>' + acc + '</div>' +
    '<div class="success-box"><p style="color:#7AB87A;font-size:13px;margin-bottom:4px">本次学习完成</p><p style="color:#4A7A4A;font-size:12px;margin-bottom:16px">你已完成对「' + concept.concept + '」的完整学习循环</p>' +
    '<button class="btn-primary" onclick="handleReset()">开始新的学习</button></div></div>';
}

function toggleAcc(i) { accordionOpen = accordionOpen === i ? -1 : i; render(); }

// ============================================================
// 重置
// ============================================================
function handleReset() {
  step = 0; concept = null; clearInterval(timerInterval);
  timerSecs = 15*60; timerRunning = false; timerDone = false;
  socStarted = false; socHistory = []; socStep = 0;
  feynHistory = []; feynRound = 0; feynPassed = false;
  accordionOpen = 0; render();
}

render();
</script>
</body>
</html>`;
};
