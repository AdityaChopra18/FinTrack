import React, { useContext, useState, useEffect } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Receipt, PieChart, PiggyBank, LogOut, Menu, X } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Layout = () => {
  const { logout, user } = useContext(AuthContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Close mobile menu when navigating
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="app-container">
      {/* Mobile Header */}
      <header className="mobile-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ background: 'var(--primary)', color: 'white', padding: '6px', borderRadius: '8px', display: 'flex' }}>
            <PiggyBank size={20} />
          </div>
          <h2 style={{ margin: 0, fontSize: '18px' }}>FinTrack</h2>
        </div>
        <button className="menu-btn" onClick={() => setIsMobileMenuOpen(true)}>
          <Menu size={24} />
        </button>
      </header>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div className="mobile-menu-overlay" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      <aside className={`sidebar ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="sidebar-header" style={{ marginBottom: '40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ background: 'var(--primary)', color: 'white', padding: '8px', borderRadius: '8px', display: 'flex' }}>
              <PiggyBank size={24} />
            </div>
            <h2 style={{ margin: 0 }}>FinTrack</h2>
          </div>
          <button className="close-menu-btn" onClick={() => setIsMobileMenuOpen(false)}>
            <X size={24} />
          </button>
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
