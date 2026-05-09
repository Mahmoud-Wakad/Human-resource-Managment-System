import { Bell, Calendar } from 'lucide-react';

interface HeaderProps {
  title: string;
  subtitle: string;
  alertCount?: number;
}

export function Header({ title, subtitle, alertCount = 0 }: HeaderProps) {
  return (
    <header className="sticky top-0 bg-white border-b border-slate-200 px-8 py-6 shadow-sm z-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 font-display">{title}</h1>
          <p className="text-slate-500 mt-1 text-sm">{subtitle}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-emerald-50 px-4 py-2.5 rounded-lg border border-emerald-200">
            <Calendar className="w-5 h-5 text-emerald-600" />
            <span className="text-emerald-700 font-medium text-sm">
              {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
          </div>

          <button className="relative p-2.5 hover:bg-slate-100 rounded-lg transition-colors" title="Budget alerts">
            <Bell className="w-5 h-5 text-slate-600" />
            {alertCount > 0 && (
              <span className="absolute top-1 right-1 min-w-5 h-5 bg-rose-500 rounded-full text-white text-[10px] px-1 flex items-center justify-center">
                {alertCount > 9 ? '9+' : alertCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
