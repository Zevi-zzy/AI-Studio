import { Profile } from '@/types';
import { User, MapPin } from 'lucide-react';

interface ProfileCardProps {
  profile: Profile;
}

export function ProfileCard({ profile }: ProfileCardProps) {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-6">
      <div className="w-24 h-24 bg-primary-50 rounded-full flex items-center justify-center text-primary border-4 border-white shadow-md">
        {profile.avatar ? (
          <img src={profile.avatar} alt="Avatar" className="w-full h-full rounded-full object-cover" />
        ) : (
          <User className="w-10 h-10" />
        )}
      </div>
      
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-1">{profile.nickname}</h2>
        <p className="text-gray-500 mb-2">{profile.bio || '内容创作者'}</p>
        
        <div className="flex gap-4 text-sm text-gray-400">
          <div className="flex items-center gap-1">
            <span className="px-2 py-0.5 bg-gray-100 rounded text-xs font-medium text-gray-600">
              {profile.accountType}
            </span>
          </div>
          {profile.location && (
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3" /> {profile.location}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
