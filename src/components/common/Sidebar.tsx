import { NavLink } from 'react-router-dom';
import { Lightbulb, PenTool, Image as ImageIcon, User } from 'lucide-react';
import clsx from 'clsx';

const navItems = [
  { to: '/inspiration', icon: Lightbulb, label: '找灵感' },
  { to: '/create', icon: PenTool, label: '来创作' },
  { to: '/materials', icon: ImageIcon, label: '看素材' },
  { to: '/profile', icon: User, label: '我自己' },
];

export function Sidebar() {
  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col">
      <div className="p-6 border-b border-gray-100">
        <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
          <span className="text-3xl">✨</span> Zevi AI Studio
        </h1>
        <p className="text-xs text-gray-500 mt-1">小红书图文内容生成工具</p>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200',
                isActive
                  ? 'bg-primary-50 text-primary font-medium shadow-sm'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )
            }
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <div className="bg-gradient-to-r from-primary-50 to-primary-100 p-4 rounded-xl">
          <p className="text-xs text-primary-800 font-medium mb-1">小贴士</p>
          <p className="text-[10px] text-primary-600">
            使用 AI 为你的下一篇笔记生成灵感！
          </p>
        </div>
      </div>
    </div>
  );
}
