import { useState } from 'react';
import { Expense } from '@/types';
import { categoryData, formatCurrency, formatDate, getCurrentMonth, generateId } from '@/lib/helpers';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Plus, Trash2, Edit2, Search } from 'lucide-react';

interface ExpenseManagerProps {
  expenses: Expense[];
  onAdd: (expense: Expense) => void;
  onUpdate: (expense: Expense) => void;
  onDelete: (id: string) => void;
}

export function ExpenseManager({ expenses, onAdd, onUpdate, onDelete }: ExpenseManagerProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
  const [formData, setFormData] = useState({ title: '', amount: '', category: 'food' as any, notes: '' });

  const months = Array.from({ length: 12 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  });

  const filteredExpenses = expenses
    .filter((expense) => {
      const expenseMonth = `${expense.date.getFullYear()}-${String(expense.date.getMonth() + 1).padStart(2, '0')}`;
      const matchMonth = expenseMonth === selectedMonth;
      const matchCategory = selectedCategory === 'all' || expense.category === selectedCategory;
      const matchSearch = expense.title.toLowerCase().includes(searchTerm.toLowerCase());
      return matchMonth && matchCategory && matchSearch;
    })
    .sort((a, b) => b.date.getTime() - a.date.getTime());

  const totalAmount = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!formData.title || !formData.amount) return;

    if (editingId) {
      const expense = expenses.find((item) => item.id === editingId);
      if (expense) {
        onUpdate({
          ...expense,
          title: formData.title,
          amount: parseFloat(formData.amount),
          category: formData.category as any,
          notes: formData.notes,
        });
      }
    } else {
      onAdd({
        id: generateId(),
        title: formData.title,
        amount: parseFloat(formData.amount),
        category: formData.category as any,
        date: new Date(),
        notes: formData.notes,
      });
    }

    setFormData({ title: '', amount: '', category: 'food' as any, notes: '' });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (expense: Expense) => {
    setFormData({
      title: expense.title,
      amount: expense.amount.toString(),
      category: expense.category as any,
      notes: expense.notes || '',
    });
    setEditingId(expense.id);
    setShowForm(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          onClick={() => {
            setFormData({ title: '', amount: '', category: 'food' as any, notes: '' });
            setEditingId(null);
            setShowForm(!showForm);
          }}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Expense
        </button>
      </div>

      {showForm && (
        <Card className="bg-slate-50 border-slate-300 shadow-lg">
          <CardHeader>
            <CardTitle className="text-slate-900">{editingId ? 'Edit Expense' : 'Add New Expense'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(event) => setFormData({ ...formData, title: event.target.value })}
                  placeholder="Example: Lunch"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Amount</label>
                  <input
                    type="number"
                    value={formData.amount}
                    onChange={(event) => setFormData({ ...formData, amount: event.target.value })}
                    placeholder="0.00"
                    step="0.01"
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
                  <select
                    value={formData.category}
                    onChange={(event) => setFormData({ ...formData, category: event.target.value } as any)}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900"
                  >
                    {categoryData.map((category) => (
                      <option key={category.name} value={category.name}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Notes (Optional)</label>
                <textarea
                  value={formData.notes}
                  onChange={(event) => setFormData({ ...formData, notes: event.target.value })}
                  placeholder="Add notes..."
                  rows={3}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900"
                />
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

      <Card className="bg-white shadow-md">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            </div>

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

            <select
              value={selectedCategory}
              onChange={(event) => setSelectedCategory(event.target.value)}
              className="px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900"
            >
              <option value="all">All Categories</option>
              {categoryData.map((category) => (
                <option key={category.name} value={category.name}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white shadow-md">
        <CardHeader className="border-b border-slate-200 bg-slate-50/50">
          <div className="flex items-center justify-between">
            <CardTitle className="text-slate-900">Expenses ({filteredExpenses.length})</CardTitle>
            <span className="text-lg font-bold text-emerald-600">{formatCurrency(totalAmount)}</span>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {filteredExpenses.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-slate-500">No expenses found.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-200">
              {filteredExpenses.map((expense) => {
                const category = categoryData.find((item) => item.name === expense.category)!;
                return (
                  <div key={expense.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-4 flex-1">
                      <div className={`w-12 h-12 rounded-lg ${category.bgColor} flex items-center justify-center text-xl flex-shrink-0`}>
                        {category.icon}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-slate-900">{expense.title}</p>
                        <p className="text-sm text-slate-500">
                          {category.label} - {formatDate(expense.date)}
                        </p>
                        {expense.notes && <p className="text-xs text-slate-400 mt-1">{expense.notes}</p>}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <div className="text-right">
                        <p className="font-semibold text-slate-900">{formatCurrency(expense.amount)}</p>
                      </div>
                      <button
                        onClick={() => handleEdit(expense)}
                        className="p-2 hover:bg-blue-100 rounded-lg transition-colors text-blue-600"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(expense.id)}
                        className="p-2 hover:bg-red-100 rounded-lg transition-colors text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
