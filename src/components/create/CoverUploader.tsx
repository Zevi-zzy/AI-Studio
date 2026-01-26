import { useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface CoverUploaderProps {
  value?: string;
  onChange: (value: string) => void;
}

export function CoverUploader({ value, onChange }: CoverUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemove = () => {
    onChange('');
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">封面图片</label>
      
      {value ? (
        <div className="relative aspect-[3/4] w-48 rounded-xl overflow-hidden group border border-gray-200">
          <img src={value} alt="Cover" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button
              onClick={handleRemove}
              className="p-2 bg-white rounded-full text-red-500 hover:bg-red-50 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      ) : (
        <div className="relative">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            onDragEnter={() => setIsDragging(true)}
            onDragLeave={() => setIsDragging(false)}
            onDrop={() => setIsDragging(false)}
          />
          <div className={`
            border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-colors
            ${isDragging ? 'border-primary bg-primary-50' : 'border-gray-200 hover:border-primary/50 hover:bg-gray-50'}
          `}>
            <div className="w-12 h-12 bg-primary-50 text-primary rounded-full flex items-center justify-center mb-3">
              <Upload className="w-6 h-6" />
            </div>
            <p className="text-sm font-medium text-gray-900">点击或拖拽上传封面</p>
            <p className="text-xs text-gray-500 mt-1">支持 JPG, PNG 格式</p>
          </div>
        </div>
      )}
    </div>
  );
}
