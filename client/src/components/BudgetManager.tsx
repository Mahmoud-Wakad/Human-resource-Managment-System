import { useState } from 'react';
import { Budget, Expense } from '@/types';
import { categoryData, formatCurrency, getCurrentMonth, generateId, getBudgetStatus } from '@/lib/helpers';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Plus, Trash2, Edit2, AlertTriangle, CheckCircle } from 'lucide-react';

interface BudgetManagerProps {
  budgets: Budget[];
  expenses: Expense[];
  onAdd: (budget: Budget) => void;
  onUpdate: (budget: Budget) => void;
  onDelete: (id: string) => void;
}

export function BudgetManager({ budgets, expenses, onAdd, onUpdate, onDelete }: BudgetManagerProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
  const [formData, setFormData] = useState({ category: 'food' as any, limit: '' });

  const months = Array.from({ length: 12 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  });

  const monthBudgets = budgets.filter((budget) => budget.month === selectedMonth);
  const monthExpenses = expenses.filter((expense) => {
    const expenseMonth = `${expense.date.getFullYear()}-${String(expense.date.getMonth() + 1).padStart(2, '0')}`;
    return expenseMonth === selectedMonth;
  });

  const totalBudget = monthBudgets.reduce((sum, budget) => sum + budget.limit, 0);
  const totalSpent = monthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const remaining = totalBudget - totalSpent;

  const getBudgetSpent = (category: string) => {
    return monthExpenses.filter((expense) => expense.category === category).reduce((sum, expense) => sum + expense.amount, 0);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!formData.limit || parseFloat(formData.limit) <= 0) return;

    if (editingId) {
      const budget = budgets.find((item) => item.id === editingId);
      if (budget) {
        onUpdate({
          ...budget,
          limit: parseFloat(formData.limit),
        });
      }
    } else {
      onAdd({
        id: generateId(),
        category: formData.category,
        limit: parseFloat(formData.limit),
        month: selectedMonth,
      });
    }

    setFormData({ category: 'food' as any, limit: '' });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (budget: Budget) => {
    setFormData({
      category: budget.category as any,
      limit: budget.limit.toString(),
    });
    setEditingId(budget.id);
    setShowForm(true);
  };

  const availableCategories = categoryData.filter((category) => !monthBudgets.some((budget) => budget.category === category.name) || editingId);

  const statsCards = [
    {
      title: 'Total Budget',
      value: formatCurrency(totalBudget),
      icon: '💰',
      color: 'bg-blue-50 border-blue-200',
    },
    {
      title: 'Total Spent',
      value: formatCurrency(totalSpent),
      icon: '📊',
      color: 'bg-orange-50 border-orange-200',
    },
    {
      title: remaining >= 0 ? 'Remaining' : 'Deficit',
      value: formatCurrency(Math.abs(remaining)),
      icon: remaining >= 0 ? '✅' : '⚠️',
      color: remaining >= 0 ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {statsCards.map((stat, index) => (
          <Card key={index} className={`${stat.color} border-2`}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-medium">{stat.title}</p>
                  <p className="text-2xl font-bold text-slate-900 mt-2 font-display">{stat.value}</p>
                </div>
                <span className="text-3xl">{stat.icon}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex items-center justify-between gap-4">
        <select
          value={selectedMonth}
          onChange={(event) => setSelectedMonth(event.target.value)}
          className="px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900"
        >
          {months.map((month) => (
            <option key={month} value={month}>
              {new Date(`${month}-01`).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
            </option>
          ))}
        </select>

        <button
          onClick={() => {
            setFormData({ category: 'food' as any, limit: '' });
            setEditingId(null);
            setShowForm(!showForm);
          }}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Budget
        </button>
      </div>

      {showForm && (
        <Card className="bg-slate-50 border-slate-300 shadow-lg">
          <CardHeader>
            <CardTitle className="text-slate-900">{editingId ? 'Edit Budget' : 'Add New Budget'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
                  <select
                    value={formData.category}
                    onChange={(event) => setFormData({ ...formData, category: event.target.value } as any)}
                    disabled={!!editingId}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 disabled:bg-slate-200"
                  >
                    {availableCategories.map((category) => (
                      <option key={category.name} value={category.name}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Limit</label>
                  <input
                    type="number"
                    value={formData.limit}
                    onChange={(event) => setFormData({ ...formData, limit: event.target.value })}
                    placeholder="0.00"
                    step="0.01"
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors"
                >
                  {editingId ? 'Update' : 'Save'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                  }}
                  className="flex-1 bg-slate-300 hover:bg-slate-400 text-slate-900 px-4 py-2.5 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {monthBudgets.length === 0 ? (
          <Card className="col-span-full bg-slate-50 border-slate-300">
            <CardContent className="p-12 text-center">
              <p className="text-slate-500 font-medium">No budgets set for this month.</p>
              <button onClick={() => setShowForm(true)} className="mt-3 text-emerald-600 hover:text-emerald-700 font-medium text-sm">
                Create your first budget
              </button>
            </CardContent>
          </Card>
        ) : (
          monthBudgets.map((budget) => {
            const spent = getBudgetSpent(budget.category);
            const percentage = Math.min((spent / budget.limit) * 100, 100);
            const status = getBudgetStatus(spent, budget.limit);
            const category = categoryData.find((item) => item.name === budget.category)!;

            return (
              <Card key={budget.id} className="bg-white shadow-md border-slate-200 overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-lg ${category.bgColor} flex items-center justify-center text-xl`}>
                        {category.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900 font-display">{category.label}</h3>
                        <p className="text-xs text-slate-500">Limit: {formatCurrency(budget.limit)}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(budget)} className="p-2 hover:bg-blue-100 rounded-lg transition-colors text-blue-600">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => onDelete(budget.id)} className="p-2 hover:bg-red-100 rounded-lg transition-colors text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Spent</span>
                      <span className="font-semibold text-slate-900">{formatCurrency(spent)}</span>
                    </div>

                    <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${
                          status === 'exceeded' ? 'bg-red-500' : status === 'warning' ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">{Math.round(percentage)}%</span>
                      <div className="flex items-center gap-1">
                        {status === 'exceeded' && <AlertTriangle className="w-4 h-4 text-red-600" />}
                        {status === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-600" />}
                        {status === 'safe' && <CheckCircle className="w-4 h-4 text-emerald-600" />}
                        <span
                          className={`text-xs font-medium ${
                            status === 'exceeded' ? 'text-red-600' : status === 'warning' ? 'text-amber-600' : 'text-emerald-600'
                          }`}
                        >
                          {status === 'exceeded' ? 'Exceeded' : status === 'warning' ? 'Warning' : 'Safe'}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
