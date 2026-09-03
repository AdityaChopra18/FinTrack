import React, { useState, useEffect } from 'react';
import { Plus, Trash2, TrendingUp } from 'lucide-react';
import api from '../utils/api';

const Savings = () => {
  const [goals, setGoals] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showAddMoneyModal, setShowAddMoneyModal] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    target_amount: '',
    target_date: ''
  });
  const [addAmount, setAddAmount] = useState('');

  const fetchGoals = async () => {
    try {
      const res = await api.get('/savings');
      setGoals(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/savings', formData);
      setShowModal(false);
      fetchGoals();
      setFormData({ name: '', target_amount: '', target_date: '' });
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddMoney = async (e) => {
    e.preventDefault();
    try {
      const newAmount = parseFloat(selectedGoal.current_amount) + parseFloat(addAmount);
      await api.patch(`/savings/${selectedGoal.id}`, { current_amount: newAmount });
      setShowAddMoneyModal(false);
      fetchGoals();
      setAddAmount('');
      setSelectedGoal(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this savings goal?')) {
      try {
        await api.delete(`/savings/${id}`);
        fetchGoals();
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
    if (!dateString) return 'No target date';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit', month: '2-digit', year: 'numeric'
    });
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ margin: 0 }}>Savings Goals</h1>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={18} /> New Goal
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px' }}>
        {goals.map(goal => {
          const percent = Math.min((goal.current_amount / goal.target_amount) * 100, 100);

          return (
            <div key={goal.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ margin: '0 0 4px 0' }}>{goal.name}</h3>
                  <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-muted)' }}>
                    Target: {formatDate(goal.target_date)}
                  </p>
                </div>
                <button 
                  style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer' }}
                  onClick={() => handleDelete(goal.id)}
                >
                  <Trash2 size={18} />
                </button>
              </div>
              
              <div style={{ marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: '500' }}>
                  <span>{formatCurrency(goal.current_amount)}</span>
                  <span style={{ color: 'var(--text-muted)' }}>{formatCurrency(goal.target_amount)}</span>
                </div>
                <div className="progress-container">
                  <div 
                    className="progress-bar" 
                    style={{ width: `${percent}%`, backgroundColor: 'var(--success)' }}
                  ></div>
                </div>
                <p style={{ textAlign: 'right', fontSize: '12px', marginTop: '4px', color: 'var(--text-muted)' }}>
                  {percent.toFixed(1)}% achieved
                </p>
              </div>

              <button 
                className="btn" 
                style={{ width: '100%', justifyContent: 'center', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)' }}
                onClick={() => {
                  setSelectedGoal(goal);
                  setShowAddMoneyModal(true);
                }}
              >
                <TrendingUp size={18} /> Add Contribution
              </button>
            </div>
          );
        })}
        {goals.length === 0 && (
          <p style={{ color: 'var(--text-muted)' }}>No savings goals created yet.</p>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Create Savings Goal</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Goal Name</label>
                <input 
                  type="text" 
                  required 
                  className="form-input" 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g. New Car"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Target Amount (₹)</label>
                <input 
                  type="number" 
                  step="0.01"
                  required 
                  className="form-input" 
                  value={formData.target_amount}
                  onChange={e => setFormData({...formData, target_amount: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Target Date</label>
                <input 
                  type="date" 
                  className="form-input" 
                  value={formData.target_date}
                  onChange={e => setFormData({...formData, target_date: e.target.value})}
                />
              </div>
              <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button type="button" className="btn" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create Goal</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showAddMoneyModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Add to {selectedGoal?.name}</h2>
              <button className="close-btn" onClick={() => setShowAddMoneyModal(false)}>✕</button>
            </div>
            <form onSubmit={handleAddMoney}>
              <div className="form-group">
                <label className="form-label">Amount to Add (₹)</label>
                <input 
                  type="number" 
                  step="0.01"
                  required 
                  className="form-input" 
                  value={addAmount}
                  onChange={e => setAddAmount(e.target.value)}
                />
              </div>
              <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button type="button" className="btn" onClick={() => setShowAddMoneyModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Add Contribution</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Savings;
