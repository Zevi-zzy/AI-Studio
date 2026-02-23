import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInspirationStore } from '@/stores';
import { KeywordInput } from '@/components/inspiration/KeywordInput';
import { InspirationCard } from '@/components/inspiration/InspirationCard';

export default function InspirationPage() {
  const navigate = useNavigate();
  const { 
    inspirations, 
    isGenerating, 
    loadInspirations, 
    generateInspirations,
    adoptInspiration 
  } = useInspirationStore();

  useEffect(() => {
    loadInspirations();
  }, [loadInspirations]);

  const handleGenerate = async (keywords: string[]) => {
    await generateInspirations(keywords);
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
