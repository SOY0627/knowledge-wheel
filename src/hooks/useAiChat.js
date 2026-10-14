import { useState } from 'react';

const DEEPSEEK_API_URL = 'https://api.deepseek.com/chat/completions';
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const ZHIPU_API_URL = 'https://open.bigmodel.cn/api/paas/v4/chat/completions';

export const useAiChat = (apiKey, provider = 'deepseek') => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getApiUrl = () => {
    if (provider === 'openai') return OPENAI_API_URL;
    if (provider === 'zhipu') return ZHIPU_API_URL;
    return DEEPSEEK_API_URL;
  };

  const getModel = () => {
    if (provider === 'openai') return 'gpt-4o-mini';
    if (provider === 'zhipu') return 'glm-4-flash';
    return 'deepseek-chat';
  };

  const chat = async (messages) => {
    if (!apiKey) return null;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(getApiUrl(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: getModel(),
          messages,
          temperature: 0.7,
          max_tokens: 600,
        }),
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error?.message || `API错误: ${response.status}`);
      }
      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;
      if (!content) throw new Error('AI 服务未返回有效内容');
      return content;
    } catch (e) {
      setError(e.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { chat, loading, error };
};
