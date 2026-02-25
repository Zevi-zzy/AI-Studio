import { useState, useRef } from 'react';
import { Upload, X, Wand2 } from 'lucide-react';
import { aiService } from '@/services/aiService';
import html2canvas from 'html2canvas';

interface CoverUploaderProps {
  value?: string;
  onChange: (value: string) => void;
  title?: string;
}

interface CoverDesign {
  background: string;
  textColor: string;
  layout: 'center' | 'left' | 'split';
  accentColor: string;
}

export function CoverUploader({ value, onChange, title }: CoverUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const coverRef = useRef<HTMLDivElement>(null);
  const [design, setDesign] = useState<CoverDesign | null>(null);

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
    if (!title) {
      alert('请先填写标题，AI 将根据标题生成封面设计');
      return;
    }

    setIsGenerating(true);
    try {
      // 1. Get styling from AI
      const styling = await aiService.generateCoverStyling(title);
      setDesign(styling);

      // 2. Wait for render (using timeout to ensure DOM is updated)
      setTimeout(async () => {
        if (coverRef.current) {
          // 3. Convert DOM to Image
          const canvas = await html2canvas(coverRef.current, {
            useCORS: true,
            scale: 2, // Retina quality
            backgroundColor: null
          });
          const imageUrl = canvas.toDataURL('image/png');
          onChange(imageUrl);
        }
        setIsGenerating(false);
        setDesign(null); // Clean up
      }, 500);
    } catch (error) {
      console.error('Failed to generate cover', error);
      alert('生成封面失败，请重试');
      setIsGenerating(false);
    }
  };

  const handleRemove = () => {
    onChange('');
  };

  return (
    <div className="space-y-2 relative">
      <label className="block text-sm font-medium text-gray-700">封面图片</label>
      
      {/* Hidden container for HTML-to-Image generation */}
      {design && (
        <div 
          ref={coverRef}
          className="fixed top-[-9999px] left-[-9999px] w-[600px] h-[800px] flex flex-col p-12 overflow-hidden shadow-2xl"
          style={{ 
            background: design.background,
            color: design.textColor,
            alignItems: design.layout === 'center' ? 'center' : 'flex-start',
            justifyContent: design.layout === 'split' ? 'space-between' : 'center',
            fontFamily: "'PingFang SC', 'Microsoft YaHei', sans-serif"
          }}
        >
          {/* Decorative Elements */}
          <div className="absolute top-0 left-0 w-32 h-32 rounded-br-full opacity-20" style={{ background: design.accentColor }} />
          <div className="absolute bottom-0 right-0 w-48 h-48 rounded-tl-full opacity-20" style={{ background: design.accentColor }} />
          
          {/* Main Title */}
          <h1 
            className="text-6xl font-bold leading-tight z-10 drop-shadow-sm"
            style={{ 
              textAlign: design.layout === 'center' ? 'center' : 'left',
              textShadow: '0 2px 10px rgba(0,0,0,0.1)'
            }}
          >
            {title}
          </h1>

          {/* Subtitle / Decoration */}
          <div className="mt-8 flex items-center gap-3 opacity-80 z-10">
            <div className="h-1 w-12 rounded-full" style={{ background: design.accentColor }} />
            <span className="text-2xl tracking-widest font-light">ZEVI NOTES</span>
            <div className="h-1 w-12 rounded-full" style={{ background: design.accentColor }} />
          </div>
        </div>
      )}

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
