import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Bold, Italic, List, ListOrdered, Wand2, FolderOpen } from 'lucide-react';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { MaterialPicker } from '@/components/materials/MaterialPicker';
import { Material } from '@/types';
import { useMaterialStore } from '@/stores';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  onOptimize?: () => void;
  isOptimizing?: boolean;
}

const MenuButton = ({ isActive, onClick, icon: Icon, title, disabled, className }: any) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={clsx(
      'p-2 rounded-lg transition-colors',
      className ? className : (isActive ? 'bg-primary-50 text-primary' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'),
      disabled && 'opacity-50 cursor-not-allowed'
    )}
    title={title}
  >
    <Icon className="w-4 h-4" />
  </button>
);

export function RichTextEditor({ content, onChange, onOptimize, isOptimizing }: RichTextEditorProps) {
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const { incrementUsage } = useMaterialStore();
  
  const editor = useEditor({
    extensions: [StarterKit],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm focus:outline-none min-h-[300px] p-4',
      },
    },
  });

  // Sync content updates from parent (e.g. AI optimization)
  useEffect(() => {
    if (editor && content && editor.getHTML() !== content) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) {
    return null;
  }

  const handleInsertMaterial = (material: Material) => {
    if (material.type === 'text') {
      // Insert text at current cursor position
      editor.chain().focus().insertContent(material.content).run();
      incrementUsage(material.id);
    }
  };

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
      <div className="flex items-center gap-1 p-2 border-b border-gray-100 bg-gray-50/50">
        <MenuButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive('bold')}
          icon={Bold}
          title="加粗"
        />
        <MenuButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive('italic')}
          icon={Italic}
          title="斜体"
        />
        <div className="w-px h-6 bg-gray-200 mx-1" />
        <MenuButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive('bulletList')}
          icon={List}
          title="无序列表"
        />
        <MenuButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive('orderedList')}
          icon={ListOrdered}
          title="有序列表"
        />
        
        <div className="flex-1" />
        
        <MenuButton
          onClick={() => setIsPickerOpen(true)}
          isActive={isPickerOpen}
          icon={FolderOpen}
          title="插入素材"
        />
        
        <MenuButton
          onClick={onOptimize}
          isActive={isOptimizing}
          icon={Wand2}
          title="AI 优化正文"
          disabled={!onOptimize || isOptimizing}
          className={clsx(
            isOptimizing ? 'animate-spin text-primary' : 'text-primary hover:bg-primary-50'
          )}
        />
      </div>
      <EditorContent editor={editor} />
      
      <MaterialPicker 
        isOpen={isPickerOpen} 
        onClose={() => setIsPickerOpen(false)} 
        onPick={handleInsertMaterial}
        type="text"
        title="插入文案素材"
      />
    </div>
  );
}
