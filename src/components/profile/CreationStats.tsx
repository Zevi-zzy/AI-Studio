import { FileText, Zap, Image } from 'lucide-react';

interface CreationStatsProps {
  totalCreations: number;
  totalInspirations: number; // passed from parent
  totalMaterials: number; // passed from parent
}

export function CreationStats({ totalCreations, totalInspirations, totalMaterials }: CreationStatsProps) {
  const stats = [
    { label: '总创作数', value: totalCreations, icon: FileText, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: '采纳灵感', value: totalInspirations, icon: Zap, color: 'text-yellow-500', bg: 'bg-yellow-50' },
    { label: '素材总数', value: totalMaterials, icon: Image, color: 'text-green-500', bg: 'bg-green-50' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat) => (
        <div key={stat.label} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className={`p-3 rounded-lg ${stat.bg} ${stat.color}`}>
            <stat.icon className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
