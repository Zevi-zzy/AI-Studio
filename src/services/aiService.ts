import { GenerateInspirationRequest, Inspiration } from '@/types';

// Initialize DeepSeek API
const DEEPSEEK_API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY;
// Use relative path for proxy, including version
const API_BASE_URL = '/api/deepseek/v1';

// Mock data for fallback
const mockInspirations = [
  {
    title: '夏日穿搭指南',
    description: '分享你最爱的夏日穿搭，重点关注透气面料和鲜艳色彩。包含配饰搭配技巧。',
    keywords: ['夏日', '时尚', '穿搭'],
  },
  {
    title: '极简书桌搭建',
    description: '展示你的高效工作空间。关注理线、灯光和提升整洁感的必备好物。',
    keywords: ['书桌', '效率', '极简'],
  },
  {
    title: '健康早餐食谱',
    description: '忙碌早晨的快速营养早餐创意。果昔碗、燕麦粥变式和牛油果吐司。',
    keywords: ['美食', '健康', '早餐'],
  },
];

export const aiService = {
  generateInspirations: async (request: GenerateInspirationRequest): Promise<Omit<Inspiration, 'id' | 'createdAt' | 'isAdopted'>[]> => {
    if (!DEEPSEEK_API_KEY) {
      console.warn('DeepSeek API key not found, using mock data');
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return mockInspirations.map(item => ({
        ...item,
        keywords: [...item.keywords, ...request.keywords],
      }));
    }

    try {
      const prompt = `
        你是一个专业的小红书内容策划助手。请根据以下关键词生成 ${request.count || 5} 个小红书笔记灵感。
        关键词: ${request.keywords.join(', ')}
        
        请严格按照以下 JSON 格式返回结果（不要包含 Markdown 代码块标记，只返回纯 JSON 数组）：
        [
          {
            "title": "吸引人的标题（带emoji）",
            "description": "简短的笔记内容描述（50字以内）",
            "keywords": ["相关关键词1", "相关关键词2", "相关关键词3"]
          }
        ]
      `;

      const response = await fetch(`${API_BASE_URL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: [{ role: "user", content: prompt }]
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`DeepSeek API error: ${response.status} ${JSON.stringify(errorData)}`);
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data = await response.json() as any;
      const text = data.choices[0].message.content || '[]';
      
      // Clean up markdown formatting if present
      const jsonStr = text.replace(/```json\n?|\n?```/g, '').trim();
      
      const inspirations = JSON.parse(jsonStr);
      
      return inspirations;
    } catch (error) {
      console.error('DeepSeek API call failed:', error);
      // Fallback to mock data on error
      return mockInspirations.map(item => ({
        ...item,
        keywords: [...item.keywords, ...request.keywords],
      }));
    }
  },

  optimizeTitle: async (currentTitle: string): Promise<string> => {
    if (!DEEPSEEK_API_KEY) {
      return currentTitle + ' (AI Optimized)'; // Mock behavior
    }

    try {
      const prompt = `
        请优化以下小红书标题，使其更具吸引力，包含适当的 Emoji，并能引起点击欲望。
        原标题: "${currentTitle}"
        
        请直接返回优化后的标题，不要包含引号或其他解释性文字。
      `;
      
      const response = await fetch(`${API_BASE_URL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: [{ role: "user", content: prompt }]
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`DeepSeek API error: ${response.status} ${JSON.stringify(errorData)}`);
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data = await response.json() as any;
      const text = data.choices[0].message.content || currentTitle;
      
      return text.replace(/^"|"$/g, '').trim();
    } catch (error) {
      console.error('DeepSeek API call failed:', error);
      return currentTitle + ' (AI Optimized)';
    }
  },

  optimizeContent: async (currentContent: string, title?: string): Promise<string> => {
    if (!DEEPSEEK_API_KEY) {
      return currentContent + '<p>✨ (AI Optimized Content)</p>'; // Mock behavior
    }

    try {
      // Strip HTML tags for the prompt to save tokens and avoid confusion, 
      // but we need to ask AI to return HTML format.
      const textContent = currentContent.replace(/<[^>]+>/g, '');
      
      const prompt = `
        你是一个专业的小红书文案专家。请优化或续写以下正文内容，使其更具吸引力、互动性，并符合小红书的种草风格。
        
        ${title ? `标题: ${title}` : ''}
        当前内容: "${textContent}"
        
        要求：
        1. 语气亲切、活泼，适当使用 Emoji。
        2. 结构清晰，分段合理。
        3. 增加互动感（如提问、引导评论）。
        4. 请直接返回优化后的 HTML 内容（使用 <p>, <br>, <strong> 等简单标签即可），不要包含 Markdown 代码块标记。
      `;
      
      const response = await fetch(`${API_BASE_URL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: [{ role: "user", content: prompt }]
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`DeepSeek API error: ${response.status} ${JSON.stringify(errorData)}`);
      }

      const data = await response.json();
      let optimizedContent = data.choices[0].message.content || currentContent;
      
      // Remove markdown code blocks if present
      optimizedContent = optimizedContent.replace(/```html\n?|\n?```/g, '').trim();
      
      return optimizedContent;
    } catch (error) {
      console.error('Content optimization failed:', error);
      alert(`正文优化失败: ${(error as Error).message}`);
      return currentContent;
    }
  },

  generateImage: async (prompt: string): Promise<string> => {
    // DeepSeek API doesn't support image generation natively yet,
    // so we'll mock this or use a placeholder service if available.
    // For a real implementation, you would call DALL-E or Stable Diffusion API here.
    
    console.log('Generating image for prompt:', prompt);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Return a high-quality placeholder image based on keywords (using Unsplash Source or similar)
    // Since Unsplash Source is deprecated, we use a reliable placeholder service
    // const keywords = prompt.split(' ').slice(0, 3).join(',');
    return `https://placehold.co/600x800/FF2442/FFFFFF/png?text=${encodeURIComponent(prompt.substring(0, 10))}`;
  }
};
