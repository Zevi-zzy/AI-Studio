import { ImageCard } from '@/types';
import { Plus, X, Upload, FolderOpen, ArrowUp, ArrowDown } from 'lucide-react';
import { useState } from 'react';
import { MaterialPicker } from '@/components/materials/MaterialPicker';
import { Material } from '@/types';
import { useMaterialStore } from '@/stores';

interface ImageCardEditorProps {
  cards: ImageCard[];
  onChange: (cards: ImageCard[]) => void;
}

export function ImageCardEditor({ cards, onChange }: ImageCardEditorProps) {
  const [activeCardId, setActiveCardId] = useState<string | null>(null);
  const { incrementUsage } = useMaterialStore();

  const addCard = () => {
    const newCard: ImageCard = {
      id: crypto.randomUUID(),
      image: '',
      description: '',
      orderIndex: cards.length,
    };
    onChange([...cards, newCard]);
  };

  const updateCard = (id: string, updates: Partial<ImageCard>) => {
    onChange(cards.map(card => card.id === id ? { ...card, ...updates } : card));
  };

  const removeCard = (id: string) => {
    onChange(cards.filter(card => card.id !== id));
  };

  const moveCard = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === cards.length - 1) return;

    const newCards = [...cards];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newCards[index], newCards[targetIndex]] = [newCards[targetIndex], newCards[index]];
    
    // Update orderIndex
    const reorderedCards = newCards.map((card, idx) => ({
      ...card,
      orderIndex: idx
    }));
    
    onChange(reorderedCards);
  };

  const handleImageUpload = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateCard(id, { image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePickMaterial = (material: Material) => {
    if (activeCardId && material.type === 'image') {
      updateCard(activeCardId, { image: material.content });
      incrementUsage(material.id);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">图文卡片</label>
        <button
          onClick={addCard}
          className="text-sm text-primary font-medium hover:text-primary-700 flex items-center gap-1"
        >
          <Plus className="w-4 h-4" /> 添加卡片
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {cards.map((card, index) => (
          <div key={card.id} className="border border-gray-200 rounded-xl p-4 bg-white relative group transition-all duration-200 hover:shadow-md">
            <div className="absolute top-2 right-2 flex gap-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
               <div className="flex bg-gray-100 rounded-lg p-0.5 mr-2">
                <button
                  onClick={() => moveCard(index, 'up')}
                  disabled={index === 0}
                  className="p-1 text-gray-500 hover:text-primary hover:bg-white rounded disabled:opacity-30 disabled:hover:bg-transparent"
                  title="上移"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
                <button
                  onClick={() => moveCard(index, 'down')}
                  disabled={index === cards.length - 1}
                  className="p-1 text-gray-500 hover:text-primary hover:bg-white rounded disabled:opacity-30 disabled:hover:bg-transparent"
                  title="下移"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>
              </div>
              <button
                onClick={() => removeCard(card.id)}
                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                title="删除"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex gap-4">
              <div className="w-24 h-32 flex-shrink-0 bg-gray-50 rounded-lg border border-gray-100 flex items-center justify-center relative overflow-hidden group/image">
                {card.image ? (
                  <img src={card.image} alt="Card" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="w-6 h-6 text-gray-300" />
                    <span className="text-[10px] text-gray-400">上传</span>
                  </div>
                )}
                
                {/* Upload Overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/image:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                  <label className="p-1.5 bg-white/20 hover:bg-white/30 rounded-full cursor-pointer text-white transition-colors" title="上传本地图片">
                    <Upload className="w-4 h-4" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(card.id, e)}
                      className="hidden"
                    />
                  </label>
                  <button 
                    onClick={() => setActiveCardId(card.id)}
                    className="p-1.5 bg-white/20 hover:bg-white/30 rounded-full cursor-pointer text-white transition-colors" 
                    title="从素材库选择"
                  >
                    <FolderOpen className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex-1 pt-6">
                <textarea
                  value={card.description}
                  onChange={(e) => updateCard(card.id, { description: e.target.value })}
                  placeholder="描述这张图片..."
                  className="w-full h-full p-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                />
              </div>
            </div>
            
            <div className="absolute bottom-2 left-4 text-xs text-gray-400 font-medium">
              卡片 {index + 1}
            </div>
          </div>
        ))}
      </div>
      
      {cards.length === 0 && (
        <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
          <p className="text-gray-500 text-sm">暂无卡片。添加一张卡片来视觉化讲述你的故事。</p>
        </div>
      )}

      <MaterialPicker 
        isOpen={!!activeCardId} 
        onClose={() => setActiveCardId(null)} 
        onPick={handlePickMaterial}
        type="image"
        title="选择图片素材"
      />
    </div>
  );
}
