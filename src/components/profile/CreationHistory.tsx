import { Creation } from '@/types';
import { Link } from 'react-router-dom';
import { Edit2, Eye } from 'lucide-react';

interface CreationHistoryProps {
  creations: Creation[];
}

export function CreationHistory({ creations }: CreationHistoryProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <h3 className="text-lg font-bold text-gray-900">创作历史</h3>
      </div>
      
      <div className="divide-y divide-gray-100">
        {creations.length > 0 ? (
          creations.map((creation) => (
            <div key={creation.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                  {creation.coverImage && (
                    <img src={creation.coverImage} alt="" className="w-full h-full object-cover" />
                  )}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{creation.title || '无标题'}</h4>
                  <p className="text-xs text-gray-500">
                    {new Date(creation.updatedAt).toLocaleDateString()} • {creation.status === 'published' ? '已发布' : '草稿'}
                  </p>
                </div>
              </div>
              
              <Link
                to={`/create/${creation.id}`}
                className="p-2 text-gray-400 hover:text-primary hover:bg-primary-50 rounded-lg transition-colors"
              >
                <Edit2 className="w-4 h-4" />
              </Link>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-gray-500">
            暂无创作记录。
          </div>
        )}
      </div>
    </div>
  );
}
