import { useState } from 'react';
import { Upload, X, Wand2 } from 'lucide-react';
import { aiService } from '@/services/aiService';

interface CoverUploaderProps {
  value?: string;
  onChange: (value: string) => void;
}

export function CoverUploader({ value, onChange }: CoverUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    const prompt = window.prompt('请输入封面图描述关键词：', '小红书风格，生活方式，极简主义');
    if (!prompt) return;

    setIsGenerating(true);
    try {
      const imageUrl = await aiService.generateImage(prompt);
      onChange(imageUrl);
    } catch (error) {
      console.error('Failed to generate image', error);
      alert('生成图片失败，请重试');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRemove = () => {
    onChange('');
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">封面图片</label>
      
      {value ? (
        <div className="relative aspect-[3/4] w-48 rounded-xl overflow-hidden group border border-gray-200">
          <img src={value} alt="Cover" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button
              onClick={handleRemove}
              className="p-2 bg-white rounded-full text-red-500 hover:bg-red-50 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex gap-4">
          <div className="relative w-48 aspect-[3/4]">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              onDragEnter={() => setIsDragging(true)}
              onDragLeave={() => setIsDragging(false)}
              onDrop={() => setIsDragging(false)}
            />
            <div className={`
              w-full h-full border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-center transition-colors
              ${isDragging ? 'border-primary bg-primary-50' : 'border-gray-200 hover:border-primary/50 hover:bg-gray-50'}
            `}>
              <div className="w-10 h-10 bg-primary-50 text-primary rounded-full flex items-center justify-center mb-2">
                <Upload className="w-5 h-5" />
              </div>
              <p className="text-xs font-medium text-gray-900">点击上传封面</p>
              <p className="text-[10px] text-gray-400 mt-1">支持 JPG, PNG</p>
            </div>
          </div>
          
          <div className="flex flex-col justify-center gap-2">
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2 text-sm font-medium shadow-sm disabled:opacity-50"
            >
              <Wand2 className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
              {isGenerating ? '生成中...' : 'AI 生成封面'}
            </button>
            <p className="text-xs text-gray-400 max-w-[150px]">
              使用 AI 快速生成符合小红书风格的精美封面图。
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
