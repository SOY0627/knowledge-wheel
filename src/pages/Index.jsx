import React, { useState } from 'react';
import SpinWheel from '@/components/SpinWheel';
import StudyTimer from '@/components/StudyTimer';
import SocraticDialog from '@/components/SocraticDialog';
import FeynmanTest from '@/components/FeynmanTest';
import DeepExplain from '@/components/DeepExplain';
import ConceptGraph from '@/components/ConceptGraph';
import StepIndicator from '@/components/StepIndicator';
import ConceptCard from '@/components/ConceptCard';
import ApiKeyModal from '@/components/ApiKeyModal';
import { RotateCcw, Key, Zap, Download } from 'lucide-react';
import { generateFullHtml } from '@/utils/generateHtml';
import { knowledgeConcepts } from '@/data/knowledgeConcepts';

const LIBRARY_OPTIONS = ['all', '食', '住', '健康', '中国史', '世界史', '法律', '地理', '博物', '古书'];

const Index = () => {
  const [step, setStep] = useState(0);
  const [concept, setConcept] = useState(null);
  const [selectedLibrary, setSelectedLibrary] = useState('all');
  const [showApiModal, setShowApiModal] = useState(false);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('ks_api_key') || '');
  const [apiProvider, setApiProvider] = useState(() => localStorage.getItem('ks_api_provider') || 'deepseek');
  const handleConceptSelected = (c) => {
    setConcept(c);
    setStep(1);
  };
  const handleTimerEnd = () => setStep(2);
  const handleSocraticComplete = () => setStep(3);
  const handleFeynmanComplete = () => setStep(4);
  const handleReset = () => {
    setStep(0);
    setConcept(null);
  };
  const handleApiKeySave = (key, provider) => {
    setApiKey(key);
    setApiProvider(provider);
    localStorage.setItem('ks_api_key', key);
    localStorage.setItem('ks_api_provider', provider);
  };
  const handleRemoveApiKey = () => {
    setApiKey('');
    localStorage.removeItem('ks_api_key');
    localStorage.removeItem('ks_api_provider');
  }; // 下载 HTML 文件
  const handleDownloadHtml = () => {
    const html = generateFullHtml();
    const blob = new Blob([html], {
      type: 'text/html;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '知识转盘-Knowledge-Studio.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  return (
    <div
      className='min-h-screen flex flex-col'
      style={{
        background: '#0D0D0D',
        color: '#E8E0D5',
      }}
    >
      {/* Header */}
      <header
        className='border-b'
        style={{
          borderColor: '#1A1A1A',
        }}
      >
        <div className='max-w-2xl mx-auto px-6 py-5 flex items-center justify-between'>
          <div>
            <h1
              className='text-sm font-medium tracking-widest uppercase'
              style={{
                color: '#E8E0D5',
                letterSpacing: '0.2em',
                height: '20px',
                flex: '0 0 auto',
                alignSelf: 'auto',
              }}
            >
              知识转盘/Spindle
            </h1>
            <p
              className='text-xs mt-0.5'
              style={{
                color: '#444',
                letterSpacing: '0.08em',
              }}
            >
              Personal Knowledge Studio
            </p>
          </div>
          <div className='flex items-center gap-3'>
            {/* 下载 HTML 按钮 */}
            <button
              onClick={handleDownloadHtml}
              className='flex items-center gap-1.5 text-xs px-3 py-1.5 transition-all hover:opacity-80'
              style={{
                color: '#8B7B6B',
                background: '#111',
                border: '1px solid #2A2218',
                letterSpacing: '0.06em',
              }}
              title='下载为离线 HTML 文件'
            >
              <Download size={11} /> 下载离线版
            </button>

            {apiKey ? (
              <button
                onClick={handleRemoveApiKey}
                className='flex items-center gap-1.5 text-xs px-3 py-1.5'
                style={{
                  color: '#C17B50',
                  background: '#1A1208',
                  border: '1px solid #2A1E0A',
                  letterSpacing: '0.06em',
                }}
              >
                <Zap size={11} /> AI 已接入
              </button>
            ) : (
              <button
                onClick={() => setShowApiModal(true)}
                className='flex items-center gap-1.5 text-xs px-3 py-1.5 transition-all hover:opacity-80'
                style={{
                  color: '#666',
                  background: '#111',
                  border: '1px solid #222',
                  letterSpacing: '0.06em',
                }}
              >
                <Key size={11} /> 接入 AI
              </button>
            )}
            {step > 0 && (
              <button
                onClick={handleReset}
                className='flex items-center gap-2 text-xs transition-all hover:opacity-70'
                style={{
                  color: '#444',
                  letterSpacing: '0.1em',
                }}
              >
                <RotateCcw size={12} /> 重置
              </button>
            )}
          </div>
        </div>
      </header>

      <main className='flex-1 max-w-2xl mx-auto w-full px-6 py-10 flex flex-col gap-8'>
        <StepIndicator currentStep={step} />

        {step === 0 && (
          <div className='flex flex-col gap-8'>
            <div className='text-center'>
              <h2
                className='text-2xl font-light mb-3 tracking-wide'
                style={{
                  color: '#E8E0D5',
                }}
              >
                今天学什么？
              </h2>
              <p
                className='text-sm'
                style={{
                  color: '#555',
                  lineHeight: 1.8,
                  maxWidth: 360,
                  margin: '0 auto',
                }}
              >
                转动转盘，从150个精选知识概念中随机抽取一个，开启15分钟的深度学习之旅。
              </p>
            </div>
            <div
              className='p-4'
              style={{
                background: '#111',
                border: '1px solid #1E1E1E',
              }}
            >
              <p
                className='text-xs mb-3 text-center'
                style={{
                  color: '#555',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                }}
              >
                选择今日词库
              </p>
              <div className='flex flex-wrap justify-center gap-2'>
                {LIBRARY_OPTIONS.map((lib) => {
                  const active = selectedLibrary === lib;
                  const count = lib === 'all'
                    ? knowledgeConcepts.length
                    : knowledgeConcepts.filter(c => c.category.startsWith(lib)).length;
                  return (
                    <button
                      key={lib}
                      onClick={() => setSelectedLibrary(lib)}
                      className='px-3 py-1.5 text-[11px] transition-all hover:opacity-80'
                      style={{
                        background: active ? '#E8E0D5' : '#161616',
                        color: active ? '#111' : '#777',
                        border: `1px solid ${active ? '#E8E0D5' : '#2A2A2A'}`,
                        letterSpacing: '0.05em',
                      }}
                    >
                      {lib === 'all' ? '全部词库' : lib} · {count}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className='flex justify-center'>
              <SpinWheel onConceptSelected={handleConceptSelected} selectedCategory={selectedLibrary} />
            </div>
            <div className='grid grid-cols-3 gap-3 mt-2'>
              {['用15分钟时间不借助AI自主学习', '苏格拉底追问', '费曼验证法'].map((cat, i) => (
                <div
                  key={i}
                  className='p-3 text-center text-[11px]'
                  style={{
                    background: '#111',
                    border: '1px solid #1E1E1E',
                    color: '#444',
                    letterSpacing: '0.05em',
                    paddingBottom: '0px',
                    height: '30px',
                    flex: '0 0 auto',
                    alignSelf: 'auto',
                  }}
                >
                  {cat}
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 1 && concept && (
          <div className='flex flex-col gap-6'>
            <ConceptCard concept={concept} />
            <div
              className='p-6'
              style={{
                background: '#111',
                border: '1px solid #1E1E1E',
              }}
            >
              <p
                className='text-xs mb-6 text-center'
                style={{
                  color: '#555',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                }}
              >
                不借助AI · 15分钟自主探索
              </p>
              <StudyTimer onTimerEnd={handleTimerEnd} />
            </div>
          </div>
        )}

        {step === 2 && concept && (
          <div className='flex flex-col gap-6'>
            <ConceptCard concept={concept} />
            <div
              className='p-6'
              style={{
                background: '#111',
                border: '1px solid #1E1E1E',
              }}
            >
              <div className='flex items-center gap-2 mb-5'>
                <div
                  className='w-1 h-4'
                  style={{
                    background: '#E8E0D5',
                  }}
                />
                <h3
                  className='text-xs font-medium tracking-widest uppercase'
                  style={{
                    color: '#888',
                    letterSpacing: '0.15em',
                  }}
                >
                  苏格拉底追问
                </h3>
              </div>
              <SocraticDialog concept={concept} onComplete={handleSocraticComplete} apiKey={apiKey} apiProvider={apiProvider} />
            </div>
          </div>
        )}

        {step === 3 && concept && (
          <div className='flex flex-col gap-6'>
            <ConceptCard concept={concept} />
            <div
              className='p-6'
              style={{
                background: '#111',
                border: '1px solid #1E1E1E',
              }}
            >
              <div className='flex items-center gap-2 mb-5'>
                <div
                  className='w-1 h-4'
                  style={{
                    background: '#E8E0D5',
                  }}
                />
                <h3
                  className='text-xs font-medium tracking-widest uppercase'
                  style={{
                    color: '#888',
                    letterSpacing: '0.15em',
                  }}
                >
                  费曼检验
                </h3>
              </div>
              <FeynmanTest concept={concept} onComplete={handleFeynmanComplete} apiKey={apiKey} apiProvider={apiProvider} />
            </div>
          </div>
        )}

        {step === 4 && concept && (
          <div className='flex flex-col gap-6'>
            <ConceptCard concept={concept} />
            <div
              className='p-6'
              style={{
                background: '#111',
                border: '1px solid #1E1E1E',
              }}
            >
              <div className='flex items-center gap-2 mb-5'>
                <div
                  className='w-1 h-4'
                  style={{
                    background: '#E8E0D5',
                  }}
                />
                <h3
                  className='text-xs font-medium tracking-widest uppercase'
                  style={{
                    color: '#888',
                    letterSpacing: '0.15em',
                  }}
                >
                  深度讲解
                </h3>
              </div>
              <DeepExplain concept={concept} />
            </div>
            <div
              className='p-6'
              style={{
                background: '#111',
                border: '1px solid #1E1E1E',
              }}
            >
              <div className='flex items-center gap-2 mb-5'>
                <div
                  className='w-1 h-4'
                  style={{
                    background: '#E8E0D5',
                  }}
                />
                <h3
                  className='text-xs font-medium tracking-widest uppercase'
                  style={{
                    color: '#888',
                    letterSpacing: '0.15em',
                  }}
                >
                  概念关联图谱
                </h3>
              </div>
              <ConceptGraph concept={concept} apiKey={apiKey} apiProvider={apiProvider} />
            </div>
            <div
              className='p-6 text-center'
              style={{
                background: '#0A1A0A',
                border: '1px solid #1A2A1A',
              }}
            >
              <p
                className='text-sm mb-1'
                style={{
                  color: '#7AB87A',
                  letterSpacing: '0.05em',
                }}
              >
                本次学习完成
              </p>
              <p
                className='text-xs mt-2 mb-4'
                style={{
                  color: '#4A7A4A',
                }}
              >
                你已完成对「{concept.concept}」的完整学习循环
              </p>
              <button
                onClick={handleReset}
                className='px-6 py-2.5 text-xs font-medium tracking-widest uppercase'
                style={{
                  background: '#E8E0D5',
                  color: '#111',
                  letterSpacing: '0.15em',
                }}
              >
                开始新的学习
              </button>
            </div>
          </div>
        )}
      </main>

      <footer
        className='border-t py-6'
        style={{
          borderColor: '#1A1A1A',
        }}
      >
        <p
          className='text-center text-xs'
          style={{
            color: '#2A2A2A',
            letterSpacing: '0.1em',
            height: '16px',
            flex: '0 0 auto',
            alignSelf: 'auto',
          }}
        >
          KNOWLEDGE STUDIO · 150个精选概念 · 培养自主学习力和辩驳力 · SOY制
        </p>
      </footer>

      {showApiModal && <ApiKeyModal onSave={handleApiKeySave} onClose={() => setShowApiModal(false)} />}
    </div>
  );
};
export default Index;
