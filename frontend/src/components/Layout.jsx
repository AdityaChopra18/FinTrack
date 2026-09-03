import React, { useContext } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { LayoutDashboard, Receipt, PieChart, PiggyBank, LogOut } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Layout = () => {
  const { logout, user } = useContext(AuthContext);

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div style={{ marginBottom: '40px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ background: 'var(--primary)', color: 'white', padding: '8px', borderRadius: '8px', display: 'flex' }}>
            <PiggyBank size={24} />
          </div>
          <h2 style={{ margin: 0 }}>FinTrack</h2>
        </div>
        
        <nav style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <NavLink to="/" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')} end>
            <LayoutDashboard size={20} />
            Dashboard
          </NavLink>
          <NavLink to="/transactions" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            <Receipt size={20} />
            Transactions
          </NavLink>
          <NavLink to="/budgets" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            <PieChart size={20} />
            Budgets
          </NavLink>
          <NavLink to="/savings" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            <PiggyBank size={20} />
            Savings Goals
          </NavLink>
          
          <div style={{ marginTop: 'auto', paddingTop: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', padding: '0 16px', color: 'var(--text-main)', fontSize: '14px', fontWeight: '500' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                {user?.email?.[0].toUpperCase()}
              </div>
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.email}</span>
            </div>
            <button 
              onClick={logout}
              className="nav-link" 
              style={{ width: '100%', border: 'none', background: 'none', cursor: 'pointer', textAlign: 'left', color: 'var(--danger)' }}
            >
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </nav>
      </aside>
      
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
