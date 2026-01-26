import { Wand2 } from 'lucide-react';

interface TitleEditorProps {
  value: string;
  onChange: (value: string) => void;
  onOptimize?: () => void;
  isOptimizing?: boolean;
}

export function TitleEditor({ value, onChange, onOptimize, isOptimizing }: TitleEditorProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        标题
        <span className="ml-2 text-xs text-gray-400">
          {value.length}/20
        </span>
      </label>
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="输入一个吸引人的标题..."
          maxLength={20}
          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-lg font-medium pr-12"
        />
        <button 
          onClick={onOptimize}
          disabled={!onOptimize || isOptimizing}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-primary hover:text-primary-700 p-1 rounded-md hover:bg-primary-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="AI 优化标题"
        >
          <Wand2 className={`w-5 h-5 ${isOptimizing ? 'animate-spin' : ''}`} />
        </button>
      </div>
    </div>
  );
}
