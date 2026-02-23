import { Tag } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useCreationStore, useInspirationStore } from '@/stores';
import { TitleEditor } from '@/components/create/TitleEditor';
import { CoverUploader } from '@/components/create/CoverUploader';
import { RichTextEditor } from '@/components/create/RichTextEditor';
import { ImageCardEditor } from '@/components/create/ImageCardEditor';
import { HashtagManager } from '@/components/create/HashtagManager';
import { CreationPreview } from '@/components/create/CreationPreview';
import { Save, Smartphone, Plus, Edit2, Trash2, Send, RotateCcw } from 'lucide-react';
import { Creation } from '@/types';
import { aiService } from '@/services/aiService';

export default function CreatePage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const inspirationId = searchParams.get('inspirationId');
  const navigate = useNavigate();
  
  const { 
    creations, 
    currentCreation, 
    saveCreation, 
    loadCreation, 
    loadCreations,
    setCurrentCreation,
    updateCreation,
    deleteCreation 
  } = useCreationStore();
  const { inspirations } = useInspirationStore();

  const [showPreview, setShowPreview] = useState(false);
  const [isOptimizingTitle, setIsOptimizingTitle] = useState(false);
  const [isOptimizingContent, setIsOptimizingContent] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'edit'>('list');
  const [formData, setFormData] = useState<Partial<Creation>>({
    title: '',
    content: '',
    coverImage: '',
    imageCards: [],
    hashtags: [],
    tags: [],
    status: 'draft',
  });

  // Load creations on mount
  useEffect(() => {
    loadCreations();
  }, [loadCreations]);

  // Handle routing and view mode
  useEffect(() => {
    if (id || inspirationId) {
      setViewMode('edit');
      if (id) {
        loadCreation(id);
      } else if (inspirationId) {
        // New creation from inspiration
        const inspiration = inspirations.find(i => i.id === inspirationId);
        if (inspiration) {
          setFormData(prev => ({
            ...prev,
            title: inspiration.title,
            content: inspiration.description,
            inspirationId: inspiration.id,
          }));
        }
      }
    } else {
      // Default to list view if no ID provided, unless manually switching
      if (viewMode === 'edit' && !currentCreation && !formData.title) {
         // Keep in edit mode if user clicked "+ Create"
      } else if (!id && !inspirationId && viewMode !== 'edit') {
         setViewMode('list');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, inspirationId, loadCreation, inspirations]);

  // Sync currentCreation to formData
  useEffect(() => {
    if (currentCreation && viewMode === 'edit') {
      setFormData(currentCreation);
    }
  }, [currentCreation, viewMode]);

  const handleStartCreation = () => {
    setCurrentCreation(null);
    setFormData({
      title: '',
      content: '',
      coverImage: '',
      imageCards: [],
      hashtags: [],
      tags: [],
      status: 'draft',
    });
    setViewMode('edit');
    navigate('/create');
  };

  const handleEdit = (creationId: string) => {
    navigate(`/create/${creationId}`);
    setViewMode('edit');
  };

  const handleDelete = async (creationId: string) => {
    if (confirm('确定要删除这篇创作吗？')) {
      await deleteCreation(creationId);
    }
  };

  const handleTogglePublish = async (creation: Creation) => {
    const newStatus = creation.status === 'published' ? 'draft' : 'published';
    await updateCreation(creation.id, { status: newStatus });
  };

  const handleSave = async () => {
    const creationToSave: Creation = {
      id: currentCreation?.id || crypto.randomUUID(),
      title: formData.title || '无标题',
      content: formData.content || '',
      coverImage: formData.coverImage,
      imageCards: formData.imageCards || [],
      hashtags: formData.hashtags || [],
      tags: formData.tags || [],
      inspirationId: formData.inspirationId,
      status: formData.status || 'draft',
      createdAt: currentCreation?.createdAt || new Date(),
      updatedAt: new Date(),
    };

    await saveCreation(creationToSave);
    alert('保存成功！');
    setViewMode('list');
    navigate('/create');
  };

  const handleOptimizeTitle = async () => {
    if (!formData.title) return;
    
    setIsOptimizingTitle(true);
    try {
      const optimizedTitle = await aiService.optimizeTitle(formData.title);
      setFormData(prev => ({ ...prev, title: optimizedTitle }));
    } catch (error) {
      console.error('Failed to optimize title', error);
      alert(`标题优化失败: ${(error as Error).message || '未知错误'}`);
    } finally {
      setIsOptimizingTitle(false);
    }
  };

  const handleOptimizeContent = async () => {
    if (!formData.content) return;
    
    setIsOptimizingContent(true);
    try {
      const optimizedContent = await aiService.optimizeContent(formData.content, formData.title);
      setFormData(prev => ({ ...prev, content: optimizedContent }));
    } catch (error) {
      console.error('Failed to optimize content', error);
      alert(`正文优化失败: ${(error as Error).message || '未知错误'}`);
    } finally {
      setIsOptimizingContent(false);
    }
  };

  if (viewMode === 'list') {
    return (
      <div className="max-w-5xl mx-auto p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">创作列表</h1>
          <button
            onClick={handleStartCreation}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 flex items-center gap-2 font-medium shadow-sm shadow-primary/30"
          >
            <Plus className="w-5 h-5" /> 开始创作
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {creations.map((creation) => (
            <div key={creation.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
              <div className="aspect-video bg-gray-100 relative">
                {creation.coverImage ? (
                  <img src={creation.coverImage} alt={creation.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    无封面
                  </div>
                )}
                <div className="absolute top-2 right-2 px-2 py-1 bg-black/50 text-white text-xs rounded-md backdrop-blur-sm">
                  {creation.status === 'published' ? '已发布' : '草稿'}
                </div>
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 h-12">{creation.title || '无标题'}</h3>
                <p className="text-sm text-gray-500 mb-4">
                  更新于: {new Date(creation.updatedAt).toLocaleDateString()}
                </p>
                
                <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-4">
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleEdit(creation.id)}
                      className="p-2 text-gray-600 hover:text-primary hover:bg-gray-50 rounded-lg transition-colors"
                      title="编辑"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleTogglePublish(creation)}
                      className={`p-2 rounded-lg transition-colors ${
                        creation.status === 'published' 
                          ? 'text-green-600 hover:bg-green-50' 
                          : 'text-gray-600 hover:text-primary hover:bg-gray-50'
                      }`}
                      title={creation.status === 'published' ? "取消发布" : "标记为已发布"}
                    >
                      {creation.status === 'published' ? <RotateCcw className="w-4 h-4" /> : <Send className="w-4 h-4" />}
                    </button>
                  </div>
                  <button 
                    onClick={() => handleDelete(creation.id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="删除"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          {creations.length === 0 && (
            <div className="col-span-full py-12 text-center text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200">
              <p>暂无创作，快去开始你的第一篇笔记吧！✨</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full">
      {/* Editor Area */}
      <div className="flex-1 p-8 overflow-y-auto max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {id ? '编辑创作' : '新建创作'}
          </h1>
          <div className="flex gap-3">
            <button 
              onClick={() => setViewMode('list')}
              className="px-4 py-2 text-gray-500 hover:text-gray-700 font-medium"
            >
              取消
            </button>
            <button 
              onClick={() => setShowPreview(true)}
              className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2 font-medium"
            >
              <Smartphone className="w-4 h-4" /> 预览
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 flex items-center gap-2 font-medium shadow-sm shadow-primary/30"
            >
              <Save className="w-4 h-4" /> 保存
            </button>
          </div>
        </div>

        <div className="space-y-8 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-8">
            <CoverUploader
              value={formData.coverImage}
              onChange={(val) => setFormData({ ...formData, coverImage: val })}
            />
            <TitleEditor
              value={formData.title || ''}
              onChange={(val) => setFormData({ ...formData, title: val })}
              onOptimize={handleOptimizeTitle}
              isOptimizing={isOptimizingTitle}
            />
          </div>

          <RichTextEditor
            content={formData.content || ''}
            onChange={(val) => setFormData({ ...formData, content: val })}
            onOptimize={handleOptimizeContent}
            isOptimizing={isOptimizingContent}
          />

          <ImageCardEditor
            cards={formData.imageCards || []}
            onChange={(val) => setFormData({ ...formData, imageCards: val })}
          />

          <HashtagManager
            hashtags={formData.hashtags || []}
            onChange={(val) => setFormData({ ...formData, hashtags: val })}
          />

          <div className="pt-4 border-t border-gray-100">
             <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">分类标签</label>
                <div className="flex flex-wrap gap-2">
                  {formData.tags?.map(tag => (
                    <span key={tag} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {tag}
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, tags: formData.tags?.filter(t => t !== tag) })}
                        className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-500 focus:outline-none"
                      >
                        <span className="sr-only">Remove tag</span>
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2 items-center">
                  <div className="relative flex-grow max-w-xs">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Tag className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="tag-input"
                      className="focus:ring-primary focus:border-primary block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 border"
                      placeholder="添加分类标签..."
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const input = e.target as HTMLInputElement;
                          const val = input.value.trim();
                          if (val && !formData.tags?.includes(val)) {
                            setFormData({ ...formData, tags: [...(formData.tags || []), val] });
                            input.value = '';
                          }
                        }
                      }}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                       const input = document.getElementById('tag-input') as HTMLInputElement;
                       const val = input.value.trim();
                       if (val && !formData.tags?.includes(val)) {
                          setFormData({ ...formData, tags: [...(formData.tags || []), val] });
                          input.value = '';
                       }
                    }}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-primary bg-primary-50 hover:bg-primary-100 focus:outline-none"
                  >
                    添加
                  </button>
                </div>
                <p className="text-xs text-gray-500">用于管理和筛选你的创作内容（非小红书话题标签）</p>
             </div>
          </div>
        </div>
      </div>

      <CreationPreview 
        creation={formData as Creation} 
        isOpen={showPreview} 
        onClose={() => setShowPreview(false)} 
      />
    </div>
  );
}
