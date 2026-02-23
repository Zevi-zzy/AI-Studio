import { useState, KeyboardEvent } from 'react';
import { Hash, X } from 'lucide-react';

interface HashtagManagerProps {
  hashtags: string[];
  onChange: (tags: string[]) => void;
}

export function HashtagManager({ hashtags, onChange }: HashtagManagerProps) {
  const [input, setInput] = useState('');

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && input.trim()) {
      e.preventDefault();
      addTag(input.trim());
    }
  };

  const addTag = (tag: string) => {
    const cleanTag = tag.replace(/^#/, '');
    if (cleanTag && !hashtags.includes(cleanTag)) {
      onChange([...hashtags, cleanTag]);
      setInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    onChange(hashtags.filter(tag => tag !== tagToRemove));
  };

  const suggestedTags = ['穿搭', '日常', '生活方式', '旅行', '美食'];

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">话题标签</label>
      
      <div className="flex flex-wrap gap-2">
        {hashtags.map(tag => (
          <span key={tag} className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm">
            #{tag}
            <button onClick={() => removeTag(tag)} className="hover:text-blue-800">
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        
        <div className="relative flex items-center">
          <Hash className="absolute left-2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="添加标签..."
            className="pl-8 pr-3 py-1 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-primary w-32"
          />
        </div>
      </div>

      <div className="flex gap-2 items-center text-xs text-gray-500">
        <span>推荐：</span>
        {suggestedTags.map(tag => (
          <button
            key={tag}
            onClick={() => addTag(tag)}
            className="hover:text-primary transition-colors"
          >
            #{tag}
          </button>
        ))}
      </div>
    </div>
  );
}
