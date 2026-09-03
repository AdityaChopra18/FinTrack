import React, { useState, useEffect } from 'react';
import { IndianRupee, ArrowDownCircle, ArrowUpCircle, Wallet } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';
import api from '../utils/api';
const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

const Dashboard = () => {
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
    expenseByCategory: []
  });
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [summaryRes, transRes] = await Promise.all([
          api.get('/transactions/summary'),
          api.get('/transactions')
        ]);
        setSummary(summaryRes.data);
        setRecentTransactions(transRes.data.slice(0, 5));
      } catch (err) {
        console.error('Error fetching dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit', month: '2-digit', year: 'numeric'
    });
  };

  if (loading) return <div>Loading dashboard...</div>;

  const chartData = summary.expenseByCategory.map(item => ({
    name: item.category,
    value: item.total
  }));

  return (
    <div>
      <h1>Dashboard</h1>
      
      <div className="dashboard-grid">
        <div className="card summary-card">
          <div className="summary-content">
            <p>Total Balance</p>
            <h3>{formatCurrency(summary.balance)}</h3>
          </div>
          <div className="summary-icon balance">
            <Wallet size={24} />
          </div>
        </div>
        
        <div className="card summary-card">
          <div className="summary-content">
            <p>Total Income</p>
            <h3>{formatCurrency(summary.totalIncome)}</h3>
          </div>
          <div className="summary-icon income">
            <ArrowUpCircle size={24} />
          </div>
        </div>
        
        <div className="card summary-card">
          <div className="summary-content">
            <p>Total Expenses</p>
            <h3>{formatCurrency(summary.totalExpense)}</h3>
          </div>
          <div className="summary-icon expense">
            <ArrowDownCircle size={24} />
          </div>
        </div>
      </div>

      <div className="dashboard-charts">
        <div className="card">
          <h2>Expenses by Category</h2>
          {chartData.length > 0 ? (
            <div style={{ height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip formatter={(value) => formatCurrency(value)} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p style={{ color: 'var(--text-muted)' }}>No expense data available.</p>
          )}
        </div>

        <div className="card">
          <h2>Recent Transactions</h2>
          {recentTransactions.length > 0 ? (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Category</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTransactions.map(tx => (
                    <tr key={tx.id}>
                      <td>{formatDate(tx.date)}</td>
                      <td>{tx.category}</td>
                      <td style={{ 
                        color: tx.type === 'income' ? 'var(--success)' : 'var(--text-main)',
                        fontWeight: '500'
                      }}>
                        {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p style={{ color: 'var(--text-muted)' }}>No recent transactions.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
