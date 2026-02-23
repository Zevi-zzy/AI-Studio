import { useEffect, useState } from 'react';
import { useMaterialStore } from '@/stores';
import { MaterialBrowser } from '@/components/materials/MaterialBrowser';
import { TextMaterialEditor } from '@/components/materials/TextMaterialEditor';
import { MaterialDetailModal } from '@/components/materials/MaterialDetailModal';
import { Upload, Plus, Type, Wand2 } from 'lucide-react';
import { Material } from '@/types';
import { aiService } from '@/services/aiService';

export default function MaterialsPage() {
  const { materials, loadMaterials, addMaterial, deleteMaterial } = useMaterialStore();
  const [isTextEditorOpen, setIsTextEditorOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  useEffect(() => {
    loadMaterials();
  }, [loadMaterials]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onloadend = async () => {
          const newMaterial: Material = {
            id: crypto.randomUUID(),
            type: file.type.startsWith('image/') ? 'image' : 'text',
            content: reader.result as string,
            filename: file.name,
            tags: [], // Could implement tag input on upload later
            usageCount: 0,
            createdAt: new Date(),
          };
          await addMaterial(newMaterial);
        };
        if (file.type.startsWith('image/')) {
          reader.readAsDataURL(file);
        } else {
          reader.readAsText(file);
        }
      });
    }
  };

  const handleGenerateImage = async () => {
    const prompt = window.prompt('请输入图片描述关键词：', '小红书风格，生活方式，极简主义');
    if (!prompt) return;

    setIsGeneratingImage(true);
    try {
      const imageUrl = await aiService.generateImage(prompt);
      const newMaterial: Material = {
        id: crypto.randomUUID(),
        type: 'image',
        content: imageUrl,
        filename: `AI-Generated-${Date.now()}.png`,
        tags: ['AI生成', ...prompt.split(' ')],
        usageCount: 0,
        createdAt: new Date(),
      };
      await addMaterial(newMaterial);
    } catch (error) {
      console.error('Failed to generate image', error);
      alert('生成图片失败，请重试');
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const EmptyState = () => (
    <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
        <Plus className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-1">暂无素材</h3>
      <p className="text-gray-500 mb-6">上传图片或添加文本片段以开始使用。</p>
      <div className="flex gap-3 justify-center">
        <label className="inline-flex items-center gap-2 px-6 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium cursor-pointer">
          <Upload className="w-4 h-4" /> 上传文件
          <input
            type="file"
            multiple
            accept="image/*,text/plain"
            className="hidden"
            onChange={handleFileUpload}
          />
        </label>
        <button
          onClick={() => setIsTextEditorOpen(true)}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
        >
          <Type className="w-4 h-4" /> 添加文本
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">素材库</h1>
          <p className="text-gray-500">管理你的创作素材（图片、金句、文案片段）。</p>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={handleGenerateImage}
            disabled={isGeneratingImage}
            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2 font-medium shadow-sm disabled:opacity-50"
          >
            <Wand2 className={`w-4 h-4 ${isGeneratingImage ? 'animate-spin' : ''}`} />
            {isGeneratingImage ? '生成中...' : 'AI 生成图片'}
          </button>
          <button
            onClick={() => setIsTextEditorOpen(true)}
            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2 font-medium"
          >
            <Type className="w-4 h-4" /> 添加文本
          </button>
          <label className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 flex items-center gap-2 font-medium shadow-sm shadow-primary/30 cursor-pointer">
            <Upload className="w-4 h-4" /> 上传文件
            <input
              type="file"
              multiple
              accept="image/*,text/plain"
              className="hidden"
              onChange={handleFileUpload}
            />
          </label>
        </div>
      </div>

      {materials.length > 0 ? (
        <MaterialBrowser 
          materials={materials} 
          onDelete={deleteMaterial}
          onSelect={setEditingMaterial}
        />
      ) : (
        <EmptyState />
      )}

      <TextMaterialEditor 
        isOpen={isTextEditorOpen} 
        onClose={() => setIsTextEditorOpen(false)} 
      />
      
      <MaterialDetailModal
        material={editingMaterial}
        onClose={() => setEditingMaterial(null)}
      />
    </div>
  );
}
