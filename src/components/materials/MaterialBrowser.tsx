import { useState, useMemo } from 'react';
import { Material } from '@/types';
import { MaterialGrid } from './MaterialGrid';
import { Search, Image, Type, Grid } from 'lucide-react';
import clsx from 'clsx';

interface MaterialBrowserProps {
  materials: Material[];
  onDelete?: (id: string) => void;
  onSelect?: (material: Material) => void;
  selectedId?: string;
  className?: string;
}

export function MaterialBrowser({ materials, onDelete, onSelect, className }: MaterialBrowserProps) {
  const [filterType, setFilterType] = useState<'all' | 'image' | 'text'>('all');
  const [searchTag, setSearchTag] = useState('');

  const filteredMaterials = useMemo(() => {
    return materials.filter(m => {
      // Filter by type
      if (filterType !== 'all' && m.type !== filterType) return false;
      
      // Filter by tag
      if (searchTag) {
        const lowerTag = searchTag.toLowerCase();
        return m.tags?.some(t => t.toLowerCase().includes(lowerTag)) || 
               m.filename?.toLowerCase().includes(lowerTag) ||
               (m.type === 'text' && m.content.toLowerCase().includes(lowerTag));
      }
      
      return true;
    });
  }, [materials, filterType, searchTag]);

  return (
    <div className={clsx("flex flex-col gap-6", className)}>
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex bg-gray-100 p-1 rounded-lg self-start">
          <button
            onClick={() => setFilterType('all')}
            className={clsx(
              "px-3 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2",
              filterType === 'all' ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
            )}
          >
            <Grid className="w-4 h-4" /> 全部
          </button>
          <button
            onClick={() => setFilterType('image')}
            className={clsx(
              "px-3 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2",
              filterType === 'image' ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
            )}
          >
            <Image className="w-4 h-4" /> 图片
          </button>
          <button
            onClick={() => setFilterType('text')}
            className={clsx(
              "px-3 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2",
              filterType === 'text' ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
            )}
          >
            <Type className="w-4 h-4" /> 文本
          </button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="搜索标签或内容..."
            value={searchTag}
            onChange={(e) => setSearchTag(e.target.value)}
            className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary w-full sm:w-64"
          />
        </div>
      </div>

      {/* Grid */}
      {filteredMaterials.length > 0 ? (
        <MaterialGrid 
          materials={filteredMaterials} 
          onDelete={onDelete} 
          onSelect={onSelect}
        />
      ) : (
        <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200">
          <p>没有找到匹配的素材</p>
        </div>
      )}
    </div>
  );
}
