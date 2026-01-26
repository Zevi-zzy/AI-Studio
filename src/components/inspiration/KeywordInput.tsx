import { useState, KeyboardEvent } from 'react';
import { Search, X } from 'lucide-react';

interface KeywordInputProps {
  onGenerate: (keywords: string[]) => void;
  isGenerating: boolean;
}

export function KeywordInput({ onGenerate, isGenerating }: KeywordInputProps) {
  const [input, setInput] = useState('');
  const [keywords, setKeywords] = useState<string[]>([]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && input.trim()) {
      e.preventDefault();
      if (!keywords.includes(input.trim())) {
        setKeywords([...keywords, input.trim()]);
      }
      setInput('');
    }
  };

  const removeKeyword = (keywordToRemove: string) => {
    setKeywords(keywords.filter(k => k !== keywordToRemove));
  };

  const handleGenerate = () => {
    if (keywords.length > 0) {
      onGenerate(keywords);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
      <div className="flex flex-col gap-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="输入关键词并按回车（例如：'夏日', '旅行'）..."
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>

        {keywords.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {keywords.map(keyword => (
              <span key={keyword} className="inline-flex items-center gap-1 px-3 py-1 bg-primary-50 text-primary rounded-full text-sm">
                {keyword}
                <button onClick={() => removeKeyword(keyword)} className="hover:text-primary-700">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}

        <button
          onClick={handleGenerate}
          disabled={keywords.length === 0 || isGenerating}
          className="self-end px-6 py-2.5 bg-primary text-white rounded-xl font-medium hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm shadow-primary/30"
        >
          {isGenerating ? '生成中...' : '生成灵感'}
        </button>
      </div>
    </div>
  );
}
