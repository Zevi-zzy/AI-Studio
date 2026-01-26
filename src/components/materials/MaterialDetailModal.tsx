import { useState } from 'react';
import { Modal } from '@/components/common/Modal';
import { Material } from '@/types';
import { useMaterialStore } from '@/stores/useMaterialStore';

interface MaterialDetailModalProps {
  material: Material | null;
  onClose: () => void;
}

export function MaterialDetailModal({ material, onClose }: MaterialDetailModalProps) {
  const { updateMaterial } = useMaterialStore();
  const [tags, setTags] = useState(material?.tags.join(', ') || '');

  if (!material) return null;

  const handleSave = async () => {
    const newTags = tags.split(/[,，\s]+/).filter(Boolean);
    await updateMaterial(material.id, { tags: newTags });
    onClose();
  };

  return (
    <Modal isOpen={!!material} onClose={onClose} title="编辑素材">
      <div className="space-y-6">
        <div className="bg-gray-50 rounded-lg overflow-hidden flex items-center justify-center min-h-[200px] max-h-[400px]">
          {material.type === 'image' ? (
            <img src={material.content} alt="Preview" className="w-full h-full object-contain" />
          ) : (
            <div className="p-6 text-gray-700 whitespace-pre-wrap font-serif w-full h-full overflow-y-auto max-h-[400px]">
              {material.content}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            标签
          </label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
            placeholder="例如：风景, 人物 (用空格或逗号分隔)"
          />
          <p className="text-xs text-gray-500 mt-1">添加标签以便快速检索。</p>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            保存更改
          </button>
        </div>
      </div>
    </Modal>
  );
}
