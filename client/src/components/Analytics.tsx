import { Expense, Budget } from '@/types';
import { categoryData, formatCurrency, getCurrentMonth } from '@/lib/helpers';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface AnalyticsProps {
  expenses: Expense[];
  budgets: Budget[];
}

export function Analytics({ expenses, budgets }: AnalyticsProps) {
  const currentMonth = getCurrentMonth();
  const monthExpenses = expenses.filter((expense) => {
    const expenseMonth = `${expense.date.getFullYear()}-${String(expense.date.getMonth() + 1).padStart(2, '0')}`;
    return expenseMonth === currentMonth;
  });

  const last6Months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  }).reverse();

  const monthlyData = last6Months.map((month) => {
    const monthExp = expenses.filter((expense) => {
      const expenseMonth = `${expense.date.getFullYear()}-${String(expense.date.getMonth() + 1).padStart(2, '0')}`;
      return expenseMonth === month;
    });

    const total = monthExp.reduce((sum, expense) => sum + expense.amount, 0);
    return {
      month: new Date(`${month}-01`).toLocaleDateString('en-US', { month: 'short' }),
      total,
    };
  });

  const categorySpending: Record<string, number> = {};
  monthExpenses.forEach((expense) => {
    categorySpending[expense.category] = (categorySpending[expense.category] || 0) + expense.amount;
  });

  const pieData = Object.entries(categorySpending).map(([category, amount]) => {
    const info = categoryData.find((item) => item.name === category);
    return {
      name: info?.label || category,
      value: amount,
      color: info?.progressColor || '#64748B',
    };
  });

  const totalSpent = monthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const currentMonthBudget = budgets.filter((budget) => budget.month === currentMonth).reduce((sum, budget) => sum + budget.limit, 0);
  const avgDaily = monthExpenses.length > 0 ? Math.round(totalSpent / 30) : 0;
  const topCategory = Object.entries(categorySpending).sort((a, b) => b[1] - a[1])[0];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200">
          <CardContent className="p-6">
            <p className="text-emerald-700 text-sm font-medium">Total Spending</p>
            <p className="text-3xl font-bold text-emerald-900 mt-2 font-display">{formatCurrency(totalSpent)}</p>
            <p className="text-emerald-600 text-xs mt-2">Current month</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
          <CardContent className="p-6">
            <p className="text-blue-700 text-sm font-medium">Monthly Budget</p>
            <p className="text-3xl font-bold text-blue-900 mt-2 font-display">{formatCurrency(currentMonthBudget)}</p>
            <p className="text-blue-600 text-xs mt-2">Planned budget total</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
          <CardContent className="p-6">
            <p className="text-purple-700 text-sm font-medium">Daily Average</p>
            <p className="text-3xl font-bold text-purple-900 mt-2 font-display">{formatCurrency(avgDaily)}</p>
            <p className="text-purple-600 text-xs mt-2">Average daily spend</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200">
          <CardContent className="p-6">
            <p className="text-orange-700 text-sm font-medium">Top Category</p>
            <p className="text-2xl font-bold text-orange-900 mt-2 font-display">
              {topCategory ? categoryData.find((item) => item.name === topCategory[0])?.label : 'No data'}
            </p>
            <p className="text-orange-600 text-xs mt-2">{topCategory ? formatCurrency(topCategory[1]) : ''}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white shadow-md">
          <CardHeader className="border-b border-slate-200 bg-slate-50/50">
            <CardTitle className="text-slate-900">Monthly Spending Trend</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#64748B" />
                <YAxis stroke="#64748B" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                  formatter={(value: any) => formatCurrency(value)}
                />
                <Bar dataKey="total" fill="#10B981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-md">
          <CardHeader className="border-b border-slate-200 bg-slate-50/50">
            <CardTitle className="text-slate-900">Category Distribution</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {pieData.length === 0 ? (
              <div className="h-80 flex items-center justify-center text-slate-500">
                <p>No data</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#fff',
                    }}
                    formatter={(value: any) => formatCurrency(value)}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white shadow-md">
        <CardHeader className="border-b border-slate-200 bg-slate-50/50">
          <CardTitle className="text-slate-900">Category Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {Object.keys(categorySpending).length === 0 ? (
            <div className="py-8 text-center text-slate-500">
              <p>No data</p>
            </div>
          ) : (
            <div className="space-y-4">
              {Object.entries(categorySpending)
                .sort((a, b) => b[1] - a[1])
                .map(([category, amount]) => {
                  const info = categoryData.find((item) => item.name === category);
                  const percentage = totalSpent > 0 ? Math.round((amount / totalSpent) * 100) : 0;
                  return (
                    <div key={category} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{info?.icon}</span>
                          <span className="text-slate-700 font-medium">{info?.label}</span>
                        </div>
                        <div className="text-right">
                          <span className="font-semibold text-slate-900">{formatCurrency(amount)}</span>
                          <span className="text-slate-500 text-sm ml-2">({percentage}%)</span>
                        </div>
                      </div>
                      <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div className={`h-full ${info?.progressColor} rounded-full transition-all duration-500`} style={{ width: `${percentage}%` }} />
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
