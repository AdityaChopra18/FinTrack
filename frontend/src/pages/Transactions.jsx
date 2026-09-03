import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2, Edit2 } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const EXPENSE_CATEGORIES = [
  'Food', 'Transport', 'Housing', 'Entertainment', 'Health', 'Shopping', 'Education', 'Other'
];
const INCOME_CATEGORIES = [
  'Salary', 'Freelance', 'Investments', 'Gifts', 'Refunds', 'Other'
];

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  
  const [formData, setFormData] = useState({
    type: 'expense',
    amount: '',
    category: EXPENSE_CATEGORIES[0],
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  const fetchTransactions = async () => {
    try {
      const res = await axios.get(`${API_URL}/transactions`);
      setTransactions(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/transactions`, formData);
      setShowModal(false);
      fetchTransactions();
      setFormData({
        type: 'expense',
        amount: '',
        category: EXPENSE_CATEGORIES[0],
        description: '',
        date: new Date().toISOString().split('T')[0]
      });
    } catch (err) {
      console.error(err);
      alert('Error saving transaction. Check console or network tab. Details: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await axios.delete(`${API_URL}/transactions/${id}`);
        fetchTransactions();
      } catch (err) {
        console.error(err);
      }
    }
  };

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

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ margin: 0 }}>Transactions</h1>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={18} /> Add Transaction
        </button>
      </div>

      <div className="card">
        {loading ? (
          <p>Loading...</p>
        ) : transactions.length > 0 ? (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Category</th>
                  <th>Description</th>
                  <th>Amount</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map(tx => (
                  <tr key={tx.id}>
                    <td>{formatDate(tx.date)}</td>
                    <td>
                      <span className={`badge ${tx.type}`}>{tx.type}</span>
                    </td>
                    <td>{tx.category}</td>
                    <td style={{ color: 'var(--text-muted)' }}>{tx.description || '-'}</td>
                    <td style={{ 
                      color: tx.type === 'income' ? 'var(--success)' : 'var(--text-main)',
                      fontWeight: '500'
                    }}>
                      {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                    </td>
                    <td>
                      <button 
                        style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer' }}
                        onClick={() => handleDelete(tx.id)}
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p style={{ color: 'var(--text-muted)' }}>No transactions found.</p>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Add Transaction</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Type</label>
                <select 
                  className="form-input" 
                  value={formData.type} 
                  onChange={e => {
                    const newType = e.target.value;
                    const newCategory = newType === 'income' ? INCOME_CATEGORIES[0] : EXPENSE_CATEGORIES[0];
                    setFormData({...formData, type: newType, category: newCategory});
                  }}
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Amount (₹)</label>
                <input 
                  type="number" 
                  step="0.01"
                  required 
                  className="form-input" 
                  value={formData.amount}
                  onChange={e => setFormData({...formData, amount: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select 
                  className="form-input" 
                  value={formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value})}
                >
                  {(formData.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES).map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Date</label>
                <input 
                  type="date" 
                  required 
                  className="form-input" 
                  value={formData.date}
                  onChange={e => setFormData({...formData, date: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Description (Optional)</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                />
              </div>
              <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button type="button" className="btn" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Transaction</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transactions;
