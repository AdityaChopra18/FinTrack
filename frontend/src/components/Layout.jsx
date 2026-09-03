import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { LayoutDashboard, Receipt, PieChart, PiggyBank } from 'lucide-react';

const Layout = () => {
  return (
    <div className="app-container">
      <aside className="sidebar">
        <div style={{ marginBottom: '40px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ background: 'var(--primary)', color: 'white', padding: '8px', borderRadius: '8px', display: 'flex' }}>
            <PiggyBank size={24} />
          </div>
          <h2 style={{ margin: 0 }}>FinTrack</h2>
        </div>
        
        <nav style={{ display: 'flex', flexDirection: 'column' }}>
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
        </nav>
      </aside>
      
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
