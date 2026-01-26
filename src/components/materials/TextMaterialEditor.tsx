import { useState } from 'react';
import { Modal } from '@/components/common/Modal';
import { useMaterialStore } from '@/stores/useMaterialStore';
import { Material } from '@/types';

interface TextMaterialEditorProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TextMaterialEditor({ isOpen, onClose }: TextMaterialEditorProps) {
  const { addMaterial } = useMaterialStore();
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');

  const handleSubmit = async () => {
    if (!content.trim()) return;

    const newMaterial: Material = {
      id: crypto.randomUUID(),
      type: 'text',
      content: content.trim(),
      tags: tags.split(/[,，\s]+/).filter(Boolean),
      createdAt: new Date(),
    };

    await addMaterial(newMaterial);
    setContent('');
    setTags('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="添加文本素材">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            内容
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-40 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
            placeholder="输入金句、文案片段..."
            autoFocus
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            标签 (可选)
          </label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
            placeholder="例如：金句, 开头, 结尾 (用空格或逗号分隔)"
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleSubmit}
            disabled={!content.trim()}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            添加
          </button>
        </div>
      </div>
    </Modal>
  );
}
