import React, { useState } from 'react';
import { Key, X, ExternalLink } from 'lucide-react';

const PROVIDERS = {
  deepseek: {
    label: 'DeepSeek',
    keyUrl: 'https://platform.deepseek.com/api_keys',
    placeholder: '输入 sk-... 格式的 API Key',
  },
  openai: {
    label: 'OpenAI GPT',
    keyUrl: 'https://platform.openai.com/api-keys',
    placeholder: '输入 sk-... 格式的 API Key',
  },
  zhipu: {
    label: '智谱 AI',
    keyUrl: 'https://bigmodel.cn/usercenter/proj-mgmt/apikeys',
    placeholder: '输入智谱 AI 的 API Key',
  },
};

const ApiKeyModal = ({ onSave, onClose }) => {
  const [key, setKey] = useState('');
  const [provider, setProvider] = useState('deepseek');
  const providerConfig = PROVIDERS[provider];

  const handleSave = () => {
    if (!key.trim()) return;
    onSave(key.trim(), provider);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)' }}>
      <div className="w-full max-w-md p-8" style={{ background: '#111', border: '1px solid #2A2A2A' }}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Key size={16} style={{ color: '#E8E0D5' }} />
            <h2 className="text-sm font-medium tracking-widest uppercase" style={{ color: '#E8E0D5', letterSpacing: '0.15em' }}>
              接入 AI 对话
            </h2>
          </div>
          <button onClick={onClose} style={{ color: '#555' }}>
            <X size={16} />
          </button>
        </div>

        <div className="flex flex-col gap-5">
          <div className="p-4 text-xs leading-relaxed" style={{ background: '#1A1A1A', color: '#888', lineHeight: 1.8 }}>
            接入 AI 后，苏格拉底追问和费曼检验将由 AI 实时分析你的回答，进行有针对性的追问和纠错，而非固定问题。
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs" style={{ color: '#666', letterSpacing: '0.1em' }}>选择 AI 提供商</label>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(PROVIDERS).map(([id, config]) => (
                <button key={id} onClick={() => setProvider(id)}
                  className="py-2 text-xs font-medium transition-all"
                  style={{
                    background: provider === id ? '#E8E0D5' : '#1A1A1A',
                    color: provider === id ? '#111' : '#666',
                    border: `1px solid ${provider === id ? 'transparent' : '#2A2A2A'}`,
                    letterSpacing: '0.05em',
                  }}>
                  {config.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-xs" style={{ color: '#666', letterSpacing: '0.1em' }}>API Key / Token</label>
              <a href={providerConfig.keyUrl}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs" style={{ color: '#555' }}>
                获取 Key <ExternalLink size={10} />
              </a>
            </div>
            <input
              type="password"
              value={key}
              onChange={e => setKey(e.target.value)}
              placeholder={providerConfig.placeholder}
              className="w-full p-3 text-sm outline-none"
              style={{ background: '#1A1A1A', color: '#CCC', border: '1px solid #2A2A2A', fontFamily: 'monospace' }}
              onKeyDown={e => e.key === 'Enter' && handleSave()}
            />
          </div>

          <div className="p-3 text-xs" style={{ background: '#0D1A0D', color: '#6B9B6B', border: '1px solid #1A2A1A', lineHeight: 1.7 }}>
            Key 仅存储在你的浏览器本地，并直接发送给所选 AI 服务商完成请求。智谱 AI 默认使用 GLM-4-Flash 模型。
          </div>

          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 py-2.5 text-xs"
              style={{ background: 'transparent', color: '#555', border: '1px solid #222' }}>
              暂不使用
            </button>
            <button onClick={handleSave} className="flex-1 py-2.5 text-xs font-medium"
              style={{ background: '#E8E0D5', color: '#111', letterSpacing: '0.1em' }}>
              保存并激活
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyModal;
