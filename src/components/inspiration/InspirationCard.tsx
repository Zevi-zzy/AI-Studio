import { Inspiration } from '@/types';
import { Check, Plus } from 'lucide-react';
import clsx from 'clsx';

interface InspirationCardProps {
  inspiration: Inspiration;
  onAdopt: (id: string) => void;
}

export function InspirationCard({ inspiration, onAdopt }: InspirationCardProps) {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-bold text-gray-900">{inspiration.title}</h3>
        {inspiration.isAdopted && (
          <span className="bg-green-100 text-green-600 text-xs px-2 py-1 rounded-full flex items-center gap-1">
            <Check className="w-3 h-3" /> 已采纳
          </span>
        )}
      </div>
      
      <p className="text-gray-600 text-sm mb-4 leading-relaxed">
        {inspiration.description}
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        {inspiration.keywords.map((keyword, index) => (
          <span key={index} className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
            #{keyword}
          </span>
        ))}
      </div>

      <button
        onClick={() => onAdopt(inspiration.id)}
        disabled={inspiration.isAdopted}
        className={clsx(
          "w-full py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors",
          inspiration.isAdopted
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-primary text-white hover:bg-primary-600"
        )}
      >
        {inspiration.isAdopted ? (
          "已采纳"
        ) : (
          <>
            <Plus className="w-4 h-4" /> 采纳灵感
          </>
        )}
      </button>
    </div>
  );
}
