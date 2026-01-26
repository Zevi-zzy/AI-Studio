import { useEffect } from 'react';
import { useProfileStore, useCreationStore, useInspirationStore, useMaterialStore } from '@/stores';
import { ProfileCard } from '@/components/profile/ProfileCard';
import { CreationStats } from '@/components/profile/CreationStats';
import { CreationHistory } from '@/components/profile/CreationHistory';
import { Download } from 'lucide-react';
import { db } from '@/db';

export default function ProfilePage() {
  const { profile, loadProfile } = useProfileStore();
  const { creations, loadCreations } = useCreationStore();
  const { inspirations, loadInspirations } = useInspirationStore();
  const { materials, loadMaterials } = useMaterialStore();

  useEffect(() => {
    loadProfile();
    loadCreations();
    loadInspirations();
    loadMaterials();
  }, [loadProfile, loadCreations, loadInspirations, loadMaterials]);

  // Filter only published creations for the profile page
  const publishedCreations = creations.filter(c => c.status === 'published');

  const handleExport = async () => {
    const data = {
      profile,
      creations,
      inspirations,
      materials,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `zevi-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!profile) return null;

  const adoptedCount = inspirations.filter(i => i.isAdopted).length;

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">我的主页</h1>
        <button
          onClick={handleExport}
          className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2 font-medium"
        >
          <Download className="w-4 h-4" /> 导出数据
        </button>
      </div>

      <ProfileCard profile={profile} />
      
      <CreationStats
        totalCreations={publishedCreations.length}
        totalInspirations={adoptedCount}
        totalMaterials={materials.length}
      />
      
      <CreationHistory creations={publishedCreations} />
    </div>
  );
}
