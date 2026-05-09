import { Expense, Budget } from '@/types';
import { formatCurrency, getCategoryInfo, getDayOfMonth, getDaysInMonth, getCurrentMonth } from '@/lib/helpers';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Wallet, TrendingUp, TrendingDown, PiggyBank, Calendar, ArrowRight, AlertTriangle } from 'lucide-react';

interface DashboardProps {
  expenses: Expense[];
  budgets: Budget[];
  onNavigate: (page: string) => void;
}

export function Dashboard({ expenses, budgets, onNavigate }: DashboardProps) {
  const currentMonth = getCurrentMonth();
  const monthExpenses = expenses.filter((expense) => `${expense.date.getFullYear()}-${String(expense.date.getMonth() + 1).padStart(2, '0')}` === currentMonth);
  const totalSpent = monthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const totalBudget = budgets.filter((budget) => budget.month === currentMonth).reduce((sum, budget) => sum + budget.limit, 0);
  const remaining = totalBudget - totalSpent;
  const daysLeft = getDaysInMonth(currentMonth) - getDayOfMonth();
  const dailyAverage = getDayOfMonth() > 0 ? Math.round(totalSpent / getDayOfMonth()) : 0;

  const categorySpending: Record<string, number> = {};
  monthExpenses.forEach((expense) => {
    categorySpending[expense.category] = (categorySpending[expense.category] || 0) + expense.amount;
  });

  const overBudgetCategories = budgets
    .filter((budget) => budget.month === currentMonth)
    .filter((budget) => {
      const spent = monthExpenses.filter((expense) => expense.category === budget.category).reduce((sum, expense) => sum + expense.amount, 0);
      return spent > budget.limit * 0.8;
    });

  const recentExpenses = [...monthExpenses].sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 5);

  const statsCards = [
    {
      title: 'Total Spent',
      value: formatCurrency(totalSpent),
      subtext: `${monthExpenses.length} transactions`,
      icon: Wallet,
      bgColor: 'bg-gradient-to-br from-emerald-500 to-teal-600',
      iconBg: 'bg-white/20',
    },
    {
      title: 'Total Budget',
      value: formatCurrency(totalBudget),
      subtext: `${budgets.filter((budget) => budget.month === currentMonth).length} categories`,
      icon: PiggyBank,
      bgColor: 'bg-gradient-to-br from-blue-500 to-cyan-600',
      iconBg: 'bg-white/20',
    },
    {
      title: remaining >= 0 ? 'Remaining' : 'Deficit',
      value: formatCurrency(Math.abs(remaining)),
      subtext: remaining >= 0 ? 'Left in your budget' : 'Over budget',
      icon: remaining >= 0 ? TrendingUp : TrendingDown,
      bgColor: remaining >= 0 ? 'bg-gradient-to-br from-teal-500 to-emerald-600' : 'bg-gradient-to-br from-rose-500 to-red-600',
      iconBg: 'bg-white/20',
    },
    {
      title: 'Daily Average',
      value: formatCurrency(dailyAverage),
      subtext: `${daysLeft} days remaining`,
      icon: Calendar,
      bgColor: 'bg-gradient-to-br from-purple-500 to-indigo-600',
      iconBg: 'bg-white/20',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {statsCards.map((stat, index) => (
          <Card key={index} className={`${stat.bgColor} border-0 text-white overflow-hidden shadow-lg hover:shadow-xl transition-all`}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-white/80 text-sm font-medium">{stat.title}</p>
                  <p className="text-2xl font-bold text-white mt-2 font-display">{stat.value}</p>
                  <p className="text-white/70 text-xs mt-2">{stat.subtext}</p>
                </div>
                <div className={`${stat.iconBg} p-3 rounded-lg`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {overBudgetCategories.length > 0 && (
        <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200 shadow-md">
          <CardContent className="p-5">
            <div className="flex items-center gap-4">
              <div className="bg-amber-500 p-2.5 rounded-lg flex-shrink-0">
                <AlertTriangle className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-amber-900 font-display">Budget Alert</h3>
                <p className="text-amber-700 text-sm">You are close to budget limits in {overBudgetCategories.length} categories.</p>
              </div>
              <button
                onClick={() => onNavigate('budgets')}
                className="text-amber-700 hover:text-amber-800 text-sm font-medium flex items-center gap-1 bg-white px-4 py-2 rounded-lg hover:bg-amber-100 transition-colors flex-shrink-0"
              >
                View details
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-white shadow-md border-slate-200 overflow-hidden">
          <CardHeader className="border-b border-slate-200 bg-slate-50/50">
            <div className="flex items-center justify-between">
              <CardTitle className="text-slate-900">Recent Expenses</CardTitle>
              <button
                onClick={() => onNavigate('expenses')}
                className="text-emerald-600 hover:text-emerald-700 text-sm font-medium flex items-center gap-1 hover:bg-emerald-50 px-3 py-1.5 rounded-lg transition-colors"
              >
                View all
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {recentExpenses.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Wallet className="w-8 h-8 text-emerald-500" />
                </div>
                <p className="text-slate-500 font-medium">No expenses this month.</p>
                <button onClick={() => onNavigate('expenses')} className="mt-3 text-emerald-600 hover:text-emerald-700 font-medium text-sm">
                  Add your first expense
                </button>
              </div>
            ) : (
              <div className="divide-y divide-slate-200">
                {recentExpenses.map((expense) => {
                  const category = getCategoryInfo(expense.category);
                  return (
                    <div key={expense.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-lg ${category.bgColor} flex items-center justify-center text-xl`}>
                          {category.icon}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{expense.title}</p>
                          <p className="text-sm text-slate-500">{category.label}</p>
                        </div>
                      </div>
                      <div className="text-left">
                        <p className="font-semibold text-slate-900">{formatCurrency(expense.amount)}</p>
                        <p className="text-xs text-slate-400">{expense.date.toLocaleDateString('en-US')}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-white shadow-md border-slate-200 overflow-hidden">
          <CardHeader className="border-b border-slate-200 bg-slate-50/50">
            <CardTitle className="text-slate-900">Expense Distribution</CardTitle>
          </CardHeader>
          <CardContent className="p-5">
            {Object.keys(categorySpending).length === 0 ? (
              <div className="py-8 text-center text-slate-400">
                <p className="text-sm">No data yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {Object.entries(categorySpending)
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 6)
                  .map(([categoryName, amount]) => {
                    const category = getCategoryInfo(categoryName as any);
                    const percentage = totalSpent > 0 ? Math.round((amount / totalSpent) * 100) : 0;
                    return (
                      <div key={categoryName} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{category.icon}</span>
                            <span className="text-slate-700 font-medium">{category.label}</span>
                          </div>
                          <span className="font-semibold text-slate-900">{formatCurrency(amount)}</span>
                        </div>
                        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div className={`h-full ${category.progressColor} rounded-full transition-all duration-500`} style={{ width: `${percentage}%` }} />
                        </div>
                        <div className="text-xs text-slate-500 text-right">{percentage}%</div>
                      </div>
                    );
                  })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
