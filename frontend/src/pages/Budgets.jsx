import React, { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import api from '../utils/api';
const DEFAULT_CATEGORIES = [
  'Food', 'Transport', 'Housing', 'Entertainment', 'Health', 'Shopping', 'Education', 'Other'
];

const Budgets = () => {
  const [budgets, setBudgets] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ category: 'Food', monthly_limit: '' });

  const fetchBudgets = async () => {
    try {
      const res = await api.get('/budgets');
      setBudgets(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/budgets', formData);
      setShowModal(false);
      fetchBudgets();
      setFormData({ category: 'Food', monthly_limit: '' });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this budget?')) {
      try {
        await api.delete(`/budgets/${id}`);
        fetchBudgets();
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

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ margin: 0 }}>Budgets</h1>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={18} /> Set Budget
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px' }}>
        {budgets.map(budget => {
          const percent = Math.min((budget.spent / budget.monthlyLimit) * 100, 100);
          let progressClass = '';
          if (percent >= 90) progressClass = 'danger';
          else if (percent >= 75) progressClass = 'warning';

          return (
            <div key={budget.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ margin: '0 0 4px 0' }}>{budget.category}</h3>
                  <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-muted)' }}>
                    {formatCurrency(budget.spent)} / {formatCurrency(budget.monthlyLimit)}
                  </p>
                </div>
                <button 
                  style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer' }}
                  onClick={() => handleDelete(budget.id)}
                >
                  <Trash2 size={18} />
                </button>
              </div>
              
              <div className="progress-container">
                <div 
                  className={`progress-bar ${progressClass}`} 
                  style={{ width: `${percent}%` }}
                ></div>
              </div>
              
              {percent >= 100 && (
                <p style={{ color: 'var(--danger)', fontSize: '12px', marginTop: '8px', fontWeight: '500' }}>
                  Over budget by {formatCurrency(budget.spent - budget.monthlyLimit)}!
                </p>
              )}
            </div>
          );
        })}
        {budgets.length === 0 && (
          <p style={{ color: 'var(--text-muted)' }}>No budgets set yet.</p>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Set Monthly Budget</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select 
                  className="form-input" 
                  value={formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value})}
                >
                  {DEFAULT_CATEGORIES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Monthly Limit (₹)</label>
                <input 
                  type="number" 
                  step="0.01"
                  required 
                  className="form-input" 
                  value={formData.monthly_limit}
                  onChange={e => setFormData({...formData, monthly_limit: e.target.value})}
                />
              </div>
              <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button type="button" className="btn" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Budget</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Budgets;
