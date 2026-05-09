import { ExpenseCategory } from '@/types';

export const categoryData = [
  { name: 'food' as ExpenseCategory, label: 'Food', icon: '🍔', bgColor: 'bg-orange-100', progressColor: 'bg-orange-500', textColor: 'text-orange-600' },
  { name: 'transport' as ExpenseCategory, label: 'Transport', icon: '🚗', bgColor: 'bg-blue-100', progressColor: 'bg-blue-500', textColor: 'text-blue-600' },
  { name: 'entertainment' as ExpenseCategory, label: 'Entertainment', icon: '🎮', bgColor: 'bg-purple-100', progressColor: 'bg-purple-500', textColor: 'text-purple-600' },
  { name: 'shopping' as ExpenseCategory, label: 'Shopping', icon: '🛍️', bgColor: 'bg-pink-100', progressColor: 'bg-pink-500', textColor: 'text-pink-600' },
  { name: 'bills' as ExpenseCategory, label: 'Bills', icon: '📄', bgColor: 'bg-red-100', progressColor: 'bg-red-500', textColor: 'text-red-600' },
  { name: 'health' as ExpenseCategory, label: 'Health', icon: '💊', bgColor: 'bg-cyan-100', progressColor: 'bg-cyan-500', textColor: 'text-cyan-600' },
  { name: 'education' as ExpenseCategory, label: 'Education', icon: '📚', bgColor: 'bg-indigo-100', progressColor: 'bg-indigo-500', textColor: 'text-indigo-600' },
  { name: 'other' as ExpenseCategory, label: 'Other', icon: '📦', bgColor: 'bg-slate-100', progressColor: 'bg-slate-500', textColor: 'text-slate-600' },
];

export const getCategoryInfo = (category: ExpenseCategory) => {
  return categoryData.find((c) => c.name === category) || categoryData[7];
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
};

export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

export const getCurrentMonth = (): string => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
};

export const getDaysInMonth = (month: string): number => {
  const [year, m] = month.split('-').map(Number);
  return new Date(year, m, 0).getDate();
};

export const getDayOfMonth = (): number => {
  return new Date().getDate();
};

export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15);
};

export const getBudgetStatus = (spent: number, limit: number): 'safe' | 'warning' | 'exceeded' => {
  const percentage = (spent / limit) * 100;
  if (percentage > 100) return 'exceeded';
  if (percentage > 80) return 'warning';
  return 'safe';
};
