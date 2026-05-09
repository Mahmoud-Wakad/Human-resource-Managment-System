import axios from 'axios';
import { AuthResponse, Budget, BudgetAlert, Expense, ExpenseCategory, User } from '@/types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
});

const getToken = () => localStorage.getItem('ecotrack-token');

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

type ExpenseApi = {
  id: number;
  title: string;
  amount: number;
  category: ExpenseCategory;
  notes?: string;
  date: string;
};

type BudgetApi = {
  id: number;
  category: ExpenseCategory;
  limit: number;
  month: string;
};

const toExpense = (item: ExpenseApi): Expense => ({
  id: item.id.toString(),
  title: item.title,
  amount: Number(item.amount),
  category: item.category,
  notes: item.notes,
  date: new Date(item.date),
});

const toBudget = (item: BudgetApi): Budget => ({
  id: item.id.toString(),
  category: item.category,
  limit: Number(item.limit),
  month: item.month,
});

export const authApi = {
  register: async (payload: { fullName: string; email: string; password: string }) => {
    const { data } = await api.post<AuthResponse>('/auth/register', payload);
    return data;
  },
  login: async (payload: { email: string; password: string }) => {
    const { data } = await api.post<AuthResponse>('/auth/login', payload);
    return data;
  },
  me: async () => {
    const { data } = await api.get<User>('/auth/me');
    return data;
  },
};

export const expensesApi = {
  list: async () => {
    const { data } = await api.get<ExpenseApi[]>('/expenses');
    return data.map(toExpense);
  },
  create: async (expense: Omit<Expense, 'id'>) => {
    const { data } = await api.post<ExpenseApi>('/expenses', {
      ...expense,
      date: expense.date.toISOString(),
    });
    return toExpense(data);
  },
  update: async (expense: Expense) => {
    const { data } = await api.put<ExpenseApi>(`/expenses/${Number(expense.id)}`, {
      ...expense,
      date: expense.date.toISOString(),
    });
    return toExpense(data);
  },
  remove: async (id: string) => {
    await api.delete(`/expenses/${Number(id)}`);
  },
  clearAll: async () => {
    await api.delete('/expenses/all');
  },
};

export const budgetsApi = {
  list: async (month?: string) => {
    const { data } = await api.get<BudgetApi[]>('/budgets', { params: { month } });
    return data.map(toBudget);
  },
  create: async (budget: Omit<Budget, 'id'>) => {
    const { data } = await api.post<BudgetApi>('/budgets', budget);
    return toBudget(data);
  },
  update: async (budget: Budget) => {
    const { data } = await api.put<BudgetApi>(`/budgets/${Number(budget.id)}`, {
      limit: budget.limit,
    });
    return toBudget(data);
  },
  remove: async (id: string) => {
    await api.delete(`/budgets/${Number(id)}`);
  },
  clearAll: async () => {
    await api.delete('/budgets/all');
  },
  alerts: async (month?: string) => {
    const { data } = await api.get<BudgetAlert[]>('/budgets/alerts', { params: { month } });
    return data;
  },
};

export const dashboardApi = {
  summary: async (month?: string) => {
    const { data } = await api.get('/dashboard/summary', { params: { month } });
    return data;
  },
};

export default api;
