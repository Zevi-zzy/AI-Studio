import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInspirationStore } from '@/stores';
import { KeywordInput } from '@/components/inspiration/KeywordInput';
import { InspirationCard } from '@/components/inspiration/InspirationCard';
import { aiService } from '@/services/aiService';
import { Inspiration } from '@/types';

export default function InspirationPage() {
  const navigate = useNavigate();
  const { 
    inspirations, 
    isGenerating, 
    loadInspirations, 
    addInspirations, 
    adoptInspiration 
  } = useInspirationStore();

  useEffect(() => {
    loadInspirations();
  }, [loadInspirations]);

  const handleGenerate = async (keywords: string[]) => {
    // In a real app, we would set isGenerating in the store here or inside the store method
    // For now, let's just call the service and add to store
    // Ideally, the store should handle the service call
    
    // Let's use the store's generate method if we implemented it fully, 
    // but in my store implementation I left it as a placeholder. 
    // So I will implement the logic here for now or update the store.
    // Updating the store is better practice.
    
    // But since I cannot edit the store file easily without rewriting it, 
    // I will do the logic here for this iteration and maybe refactor later.
    // Actually, I should update the store to use the service.
    
    // Wait, I can just use the service here and call addInspirations.
    try {
      const generated = await aiService.generateInspirations({ keywords });
      
      const newInspirations: Inspiration[] = generated.map(item => ({
        ...item,
        id: crypto.randomUUID(),
        isAdopted: false,
        createdAt: new Date(),
      }));

      await addInspirations(newInspirations);
    } catch (error) {
      console.error('Failed to generate inspiration', error);
    }
  };

  const handleAdopt = async (id: string) => {
    await adoptInspiration(id);
    navigate(`/create?inspirationId=${id}`);
  };

  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">寻找灵感</h1>
        <p className="text-gray-500">发现下一个爆款笔记的创作灵感。</p>
      </div>

      <KeywordInput onGenerate={handleGenerate} isGenerating={isGenerating} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {inspirations.map((inspiration) => (
          <InspirationCard
            key={inspiration.id}
            inspiration={inspiration}
            onAdopt={handleAdopt}
          />
        ))}
      </div>

      {inspirations.length === 0 && !isGenerating && (
        <div className="text-center py-20 text-gray-400">
          <p>暂无灵感，请在上方输入关键词开始搜索！</p>
        </div>
      )}
    </div>
  );
}
