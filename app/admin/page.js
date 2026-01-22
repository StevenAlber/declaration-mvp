'use client';

import { useState, useEffect } from 'react';

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [declarations, setDeclarations] = useState([]);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');
  
  async function handleLogin(e) {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      if (res.ok) {
        setAuthenticated(true);
        loadData();
      } else {
        setError('Invalid password');
      }
    } catch (err) {
      setError('Authentication failed');
    }
  }
  
  async function loadData() {
    try {
      const res = await fetch('/api/admin/data', {
        headers: { 'Authorization': password }
      });
      if (res.ok) {
        const data = await res.json();
        setDeclarations(data.declarations);
        setStats(data.stats);
      }
    } catch (err) {
      console.error('Failed to load data:', err);
    }
  }
  
  async function exportCSV() {
    try {
      const res = await fetch('/api/admin/export', {
        headers: { 'Authorization': password }
      });
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `declarations-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
      }
    } catch (err) {
      console.error('Export failed:', err);
    }
  }
  
  if (!authenticated) {
    return (
      <section className="section">
        <div className="container" style={{ maxWidth: '400px' }}>
          <h1 className="text-center mb-4">Admin Access</h1>
          
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
              />
            </div>
            {error && <p style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>}
            <button type="submit" className="btn-primary" style={{ width: '100%' }}>
              Login
            </button>
          </form>
        </div>
      </section>
    );
  }
  
  const tierNames = {
    witness: 'Witness',
    steward: 'Steward',
    founder: 'Founder Witness'
  };
  
  return (
    <section className="section">
      <div className="container">
        <h1 className="mb-4">Admin Dashboard</h1>
        
        {stats && (
          <div className="admin-section">
            <h2>Statistics</h2>
            <div className="stats">
              <div className="stat">
                <div className="stat-number">{stats.total}</div>
                <div className="stat-label">Total Declarations</div>
              </div>
              <div className="stat">
                <div className="stat-number">{stats.byTier.witness}</div>
                <div className="stat-label">Witness</div>
              </div>
              <div className="stat">
                <div className="stat-number">{stats.byTier.steward}</div>
                <div className="stat-label">Steward</div>
              </div>
              <div className="stat">
                <div className="stat-number">{stats.byTier.founder}</div>
                <div className="stat-label">Founder</div>
              </div>
              <div className="stat">
                <div className="stat-number">{stats.public}</div>
                <div className="stat-label">Public</div>
              </div>
            </div>
          </div>
        )}
        
        <div className="admin-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ marginBottom: 0 }}>Declarations</h2>
            <button onClick={exportCSV} className="btn-secondary">Export CSV</button>
          </div>
          
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Email</th>
                <th>Name</th>
                <th>Country</th>
                <th>Tier</th>
                <th>Public</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {declarations.map((d) => (
                <tr key={d.id}>
                  <td style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{d.id}</td>
                  <td>{d.email}</td>
                  <td>{d.displayName || '-'}</td>
                  <td>{d.country || '-'}</td>
                  <td>{tierNames[d.tier] || d.tier}</td>
                  <td>{d.publicOptIn ? 'Yes' : 'No'}</td>
                  <td>{d.status}</td>
                  <td>{new Date(d.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {declarations.length === 0 && (
            <p className="text-center" style={{ padding: '2rem', color: 'var(--color-text-muted)' }}>
              No declarations yet.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
