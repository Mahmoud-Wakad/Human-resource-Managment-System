import { Home, Wallet, PiggyBank, BarChart3, Settings, LogOut, ShieldCheck } from 'lucide-react';
import { User } from '@/types';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  user: User;
  onLogout: () => void;
}

export function Sidebar({ currentPage, onNavigate, user, onLogout }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, color: 'emerald' },
    { id: 'expenses', label: 'Expenses', icon: Wallet, color: 'blue' },
    { id: 'budgets', label: 'Budgets', icon: PiggyBank, color: 'purple' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, color: 'orange' },
    { id: 'settings', label: 'Settings', icon: Settings, color: 'rose' },
  ];

  const colorMap: Record<string, { active: string; hover: string; icon: string }> = {
    emerald: { active: 'bg-emerald-50 text-emerald-700 border-r-4 border-emerald-500', hover: 'hover:bg-emerald-50/50', icon: 'text-emerald-500' },
    blue: { active: 'bg-blue-50 text-blue-700 border-r-4 border-blue-500', hover: 'hover:bg-blue-50/50', icon: 'text-blue-500' },
    purple: { active: 'bg-purple-50 text-purple-700 border-r-4 border-purple-500', hover: 'hover:bg-purple-50/50', icon: 'text-purple-500' },
    orange: { active: 'bg-orange-50 text-orange-700 border-r-4 border-orange-500', hover: 'hover:bg-orange-50/50', icon: 'text-orange-500' },
    rose: { active: 'bg-rose-50 text-rose-700 border-r-4 border-rose-500', hover: 'hover:bg-rose-50/50', icon: 'text-rose-500' },
  };

  const initials = user.fullName
    .split(' ')
    .map((part) => part[0]?.toUpperCase())
    .slice(0, 2)
    .join('') || 'U';

  const isAdmin = user.roles.includes('Admin');

  return (
    <aside className="w-72 bg-white min-h-screen p-6 flex flex-col border-l border-slate-200 shadow-sm fixed right-0 top-0 h-screen overflow-y-auto">
      <div className="flex items-center gap-3 mb-8 pb-6 border-b border-slate-100">
        <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
          <span className="text-white font-bold text-xl font-display">E</span>
        </div>
        <div>
          <h1 className="text-emerald-600 font-bold text-lg font-display">EcoTrack</h1>
          <p className="text-slate-500 text-xs">Smart Finance Control</p>
        </div>
      </div>

      <nav className="flex-1">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const isActive = currentPage === item.id;
            const colors = colorMap[item.color];
            return (
              <li key={item.id}>
                <button
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive ? colors.active : `text-slate-600 ${colors.hover}`
                  }`}
                >
                  <div className={`p-2 rounded-lg ${isActive ? 'bg-white' : 'bg-slate-100'}`}>
                    <item.icon className={`w-5 h-5 ${isActive ? colors.icon : 'text-slate-400'}`} />
                  </div>
                  <span className="font-medium text-sm">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-slate-100 pt-6 mt-6 space-y-4">
        <div className="px-3 py-3 bg-gradient-to-l from-emerald-50 to-teal-50 rounded-lg border border-emerald-100">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center shadow-md flex-shrink-0">
              <span className="text-white font-semibold text-sm">{initials}</span>
            </div>
            <div className="min-w-0">
              <p className="text-slate-700 text-sm font-semibold truncate">{user.fullName}</p>
              <p className="text-slate-500 text-xs truncate">{user.email}</p>
            </div>
          </div>
          {isAdmin && (
            <div className="mt-3 inline-flex items-center gap-1 text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-md">
              <ShieldCheck className="w-3.5 h-3.5" />
              Admin
            </div>
          )}
        </div>

        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-slate-600 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors text-sm font-medium"
        >
          <LogOut className="w-4 h-4" />
          Log out
        </button>
      </div>
    </aside>
  );
}
