import { Modal } from '@/components/common/Modal';
import { MaterialBrowser } from './MaterialBrowser';
import { useMaterialStore } from '@/stores/useMaterialStore';
import { Material } from '@/types';
import { useEffect } from 'react';

interface MaterialPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onPick: (material: Material) => void;
  type?: 'all' | 'image' | 'text';
  title?: string;
}

export function MaterialPicker({ isOpen, onClose, onPick, type = 'all', title = '选择素材' }: MaterialPickerProps) {
  const { materials, loadMaterials } = useMaterialStore();

  useEffect(() => {
    if (isOpen) {
      loadMaterials();
    }
  }, [isOpen, loadMaterials]);

  // Pre-filter if type is enforced
  const displayMaterials = type === 'all' 
    ? materials 
    : materials.filter(m => m.type === type);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <MaterialBrowser 
        materials={displayMaterials} 
        onSelect={(m) => {
          onPick(m);
          onClose();
        }}
        // In picker mode, we usually don't delete
      />
    </Modal>
  );
}
