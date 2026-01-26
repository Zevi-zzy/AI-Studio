import { Creation } from '@/types';
import { X, Heart, Star, MessageCircle, Share2 } from 'lucide-react';

interface CreationPreviewProps {
  creation: Partial<Creation>;
  isOpen: boolean;
  onClose: () => void;
}

export function CreationPreview({ creation, isOpen, onClose }: CreationPreviewProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-sm bg-white rounded-[2rem] shadow-2xl overflow-hidden h-[80vh] flex flex-col">
        {/* Mobile Status Bar Simulation */}
        <div className="bg-white px-6 py-3 flex justify-between items-center text-xs font-medium text-gray-900 border-b border-gray-50">
          <span>9:41</span>
          <div className="flex gap-1.5">
            <div className="w-4 h-2.5 bg-gray-900 rounded-[1px]" />
            <div className="w-0.5 h-2.5 bg-gray-900/30 rounded-[1px]" />
            <div className="w-0.5 h-2.5 bg-gray-900/30 rounded-[1px]" />
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto no-scrollbar">
          {/* Cover / Carousel */}
          <div className="aspect-[3/4] bg-gray-100 relative">
            {creation.coverImage ? (
              <img src={creation.coverImage} alt="Cover" className="w-full h-full object-cover" />
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
          <div className="p-4 space-y-3">
            <h2 className="text-lg font-bold text-gray-900 leading-tight">
              {creation.title || 'Untitled Creation'}
            </h2>
            
            <div 
              className="text-sm text-gray-700 prose prose-sm max-w-none"
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
          </div>
        </div>

        {/* Bottom Action Bar */}
        <div className="p-4 border-t border-gray-100 flex items-center justify-between text-gray-600 bg-white">
          <div className="flex items-center gap-1">
            <div className="w-8 h-8 bg-gray-200 rounded-full overflow-hidden">
               {/* User Avatar Placeholder */}
            </div>
            <span className="text-xs font-medium bg-gray-100 px-2 py-1 rounded-full text-gray-500">
              说点什么...
            </span>
          </div>
          
          <div className="flex items-center gap-4">
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

        {/* Close Button (Outside Phone UI) */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur rounded-full text-gray-900 shadow-sm z-10"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
