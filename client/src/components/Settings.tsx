import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Download, Trash2, Bell, Lock, HelpCircle, User as UserIcon } from 'lucide-react';
import { User } from '@/types';

interface SettingsProps {
  user: User;
  onClearData: () => void;
  onExport: () => void;
}

export function Settings({ user, onClearData, onExport }: SettingsProps) {
  const settingsItems = [
    {
      icon: UserIcon,
      title: 'Profile',
      description: 'Manage your account information',
      color: 'bg-blue-100 text-blue-600',
    },
    {
      icon: Bell,
      title: 'Notifications',
      description: 'Budget threshold and reminder alerts',
      color: 'bg-amber-100 text-amber-600',
    },
    {
      icon: Lock,
      title: 'Security',
      description: 'Password and account protection',
      color: 'bg-emerald-100 text-emerald-600',
    },
    {
      icon: HelpCircle,
      title: 'Help & Support',
      description: 'Get answers and support resources',
      color: 'bg-purple-100 text-purple-600',
    },
  ];

  const initials = user.fullName
    .split(' ')
    .map((part) => part[0]?.toUpperCase())
    .slice(0, 2)
    .join('') || 'U';

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {settingsItems.map((item, index) => (
          <Card key={index} className="bg-white shadow-md cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-lg ${item.color}`}>
                  <item.icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 font-display">{item.title}</h3>
                  <p className="text-slate-500 text-sm mt-1">{item.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200 shadow-md">
        <CardHeader className="border-b border-emerald-200">
          <CardTitle className="text-emerald-900">User Information</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-2xl">{initials}</span>
            </div>
            <div>
              <p className="text-emerald-900 font-semibold text-lg">{user.fullName}</p>
              <p className="text-emerald-700 text-sm">{user.email}</p>
              <p className="text-emerald-600 text-xs mt-1">Roles: {user.roles.join(', ')}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white shadow-md border-slate-200">
        <CardHeader className="border-b border-slate-200 bg-slate-50/50">
          <CardTitle className="text-slate-900">Data Management</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-900 text-sm font-medium mb-3">Export your data</p>
            <p className="text-blue-700 text-xs mb-4">Download your expenses and budgets as a JSON backup file.</p>
            <button
              onClick={onExport}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors text-sm"
            >
              <Download className="w-4 h-4" />
              Export data
            </button>
          </div>

          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-900 text-sm font-medium mb-3">Clear all data</p>
            <p className="text-red-700 text-xs mb-4">This permanently deletes all your expenses and budgets.</p>
            <button
              onClick={onClearData}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors text-sm"
            >
              <Trash2 className="w-4 h-4" />
              Delete everything
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
