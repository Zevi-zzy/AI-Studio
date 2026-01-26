import { Material } from '@/types';
import { Image, Type, Trash2, Tag } from 'lucide-react';

interface MaterialGridProps {
  materials: Material[];
  onDelete?: (id: string) => void;
  onSelect?: (material: Material) => void;
}

export function MaterialGrid({ materials, onDelete, onSelect }: MaterialGridProps) {
  return (
    <div className="columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6">
      {materials.map((material) => (
        <div 
          key={material.id} 
          className="group relative bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow break-inside-avoid"
          onClick={() => onSelect?.(material)}
        >
          <div className={`relative ${material.type === 'text' ? 'min-h-[150px] bg-yellow-50' : 'bg-gray-50'}`}>
            {material.type === 'image' ? (
              <img src={material.content} alt="Material" className="w-full h-auto object-cover" />
            ) : (
              <div className="p-6 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap font-serif">
                {material.content}
              </div>
            )}
            
            {/* Overlay for Actions */}
            {onDelete && (
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(material.id);
                  }}
                  className="p-2 bg-white/90 backdrop-blur-sm rounded-full text-red-500 hover:bg-red-50 transition-colors shadow-sm"
                  title="删除"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
            
            {/* Hover Effect for Selection */}
            {onSelect && (
              <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border-2 border-primary rounded-xl" />
            )}
          </div>
          
          <div className="p-3 border-t border-gray-100 bg-white">
            <div className="flex items-center gap-2 mb-2">
              {material.type === 'image' ? (
                <Image className="w-3 h-3 text-blue-500" />
              ) : (
                <Type className="w-3 h-3 text-yellow-600" />
              )}
              <span className="text-xs text-gray-500 truncate flex-1">
                {new Date(material.createdAt).toLocaleDateString()}
              </span>
            </div>
            
            {material.tags && material.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {material.tags.map(tag => (
                  <span key={tag} className="px-1.5 py-0.5 bg-gray-100 text-gray-500 text-[10px] rounded-md flex items-center gap-1">
                    <Tag className="w-2 h-2" /> {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
