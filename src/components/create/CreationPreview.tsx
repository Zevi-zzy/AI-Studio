import { Creation } from '@/types';
import { X, Heart, Star, MessageCircle, Share2, Maximize2, Minimize2 } from 'lucide-react';
import { useState } from 'react';
import clsx from 'clsx';

interface CreationPreviewProps {
  creation: Partial<Creation>;
  isOpen: boolean;
  onClose: () => void;
}

export function CreationPreview({ creation, isOpen, onClose }: CreationPreviewProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 transition-all duration-300">
      <div 
        className={clsx(
          "relative bg-white shadow-2xl overflow-hidden flex flex-col transition-all duration-300 ease-in-out",
          isFullscreen 
            ? "w-full h-full rounded-none" 
            : "w-full max-w-sm h-[80vh] rounded-[2rem]"
        )}
      >
        {/* Mobile Status Bar Simulation - Only show in mobile mode */}
        {!isFullscreen && (
          <div className="bg-white px-6 py-3 flex justify-between items-center text-xs font-medium text-gray-900 border-b border-gray-50 flex-shrink-0">
            <span>9:41</span>
            <div className="flex gap-1.5">
              <div className="w-4 h-2.5 bg-gray-900 rounded-[1px]" />
              <div className="w-0.5 h-2.5 bg-gray-900/30 rounded-[1px]" />
              <div className="w-0.5 h-2.5 bg-gray-900/30 rounded-[1px]" />
            </div>
          </div>
        )}

        {/* Content Area */}
        <div className={clsx(
          "flex-1 overflow-y-auto no-scrollbar",
          isFullscreen && "grid grid-cols-1 md:grid-cols-2 gap-0"
        )}>
          {/* Cover / Carousel */}
          <div className={clsx(
            "bg-gray-100 relative",
            isFullscreen ? "h-full flex items-center justify-center bg-black" : "aspect-[3/4]"
          )}>
            {creation.coverImage ? (
              <img 
                src={creation.coverImage} 
                alt="Cover" 
                className={clsx(
                  "object-cover",
                  isFullscreen ? "max-h-full max-w-full w-auto h-auto" : "w-full h-full"
                )} 
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300">
                无封面
              </div>
            )}
            
            {/* Image Cards Indicator (if any) */}
            {creation.imageCards && creation.imageCards.length > 0 && (
              <div className="absolute top-4 right-4 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
                1/{creation.imageCards.length + 1}
              </div>
            )}
          </div>

          {/* Content Info */}
          <div className={clsx(
            "p-4 space-y-3",
            isFullscreen && "overflow-y-auto max-h-full"
          )}>
            <div className="flex items-center gap-3 mb-2">
               <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0 overflow-hidden">
                 {/* User Avatar Placeholder */}
               </div>
               <span className="text-sm font-medium text-gray-900">我的账号</span>
               <button className="text-xs text-red-500 font-medium border border-red-500 rounded-full px-3 py-1 ml-auto">
                 关注
               </button>
            </div>

            <h2 className="text-lg font-bold text-gray-900 leading-tight">
              {creation.title || '无标题创作'}
            </h2>
            
            <div 
              className="text-sm text-gray-700 prose prose-sm max-w-none whitespace-pre-wrap"
              dangerouslySetInnerHTML={{ __html: creation.content || '' }}
            />

            <div className="flex flex-wrap gap-1 text-blue-600 text-sm">
              {creation.hashtags?.map(tag => (
                <span key={tag}>#{tag}</span>
              ))}
            </div>
            
            <p className="text-xs text-gray-400 mt-4">
              {new Date().toLocaleDateString()}
            </p>

            <div className="pt-4 border-t border-gray-100">
              <h3 className="text-sm font-bold text-gray-900 mb-2">共 {creation.imageCards?.length || 0} 张卡片</h3>
              <div className="grid grid-cols-3 gap-2">
                {creation.imageCards?.map((card, index) => (
                  <div key={card.id} className="aspect-square bg-gray-50 rounded-lg overflow-hidden relative group cursor-pointer">
                    <img src={card.image} alt={`Card ${index}`} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Action Bar */}
        <div className="p-4 border-t border-gray-100 flex items-center justify-between text-gray-600 bg-white flex-shrink-0">
          <div className="flex items-center gap-2 w-full">
            <div className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-xs text-gray-500">
              说点什么...
            </div>
            
            <div className="flex items-center gap-4 ml-2">
              <div className="flex flex-col items-center gap-0.5">
                <Heart className="w-6 h-6" />
                <span className="text-[10px]">1.2k</span>
              </div>
              <div className="flex flex-col items-center gap-0.5">
                <Star className="w-6 h-6" />
                <span className="text-[10px]">342</span>
              </div>
              <div className="flex flex-col items-center gap-0.5">
                <MessageCircle className="w-6 h-6" />
                <span className="text-[10px]">89</span>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Controls */}
        <div className="absolute top-4 right-4 z-50 flex gap-2">
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 bg-black/50 hover:bg-black/70 backdrop-blur rounded-full text-white shadow-sm transition-colors"
            title={isFullscreen ? "退出全屏" : "全屏预览"}
          >
            {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </button>
          <button
            onClick={onClose}
            className="p-2 bg-white/80 hover:bg-white backdrop-blur rounded-full text-gray-900 shadow-sm transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
