import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api';
import { useAuth } from '../context/AuthContext';
import {
  HiOutlineOfficeBuilding,
  HiOutlineUsers,
  HiOutlineTruck,
  HiOutlineCurrencyDollar,
  HiOutlineCash,
  HiOutlineDocumentText,
  HiOutlineCube,
  HiOutlineChartBar,
  HiOutlineExclamationCircle
} from 'react-icons/hi';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState(null);
  const [alertCount, setAlertCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const promises = [
      API.get('/dashboard/stats'),
      API.get('/dashboard/recent'),
      API.get('/dashboard/alerts')
    ];

    Promise.all(promises)
      .then(([statsRes, recentRes, alertsRes]) => {
        setStats(statsRes.data);
        setRecent(recentRes.data);
        setAlertCount(alertsRes.data.totalAlerts || 0);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner" />
      </div>
    );
  }

  const fmt = (n) => new Intl.NumberFormat('en-IN', {
    style: 'currency', currency: 'INR', maximumFractionDigits: 0
  }).format(n || 0);

  const bc = stats?.budgetComparison;

  return (
    <div className="animate-in">
      <div className="page-header">
        <div className="page-header-left">
          <h1>Welcome, {user?.name || 'User'} 👋</h1>
          <p>Overview of your construction projects</p>
        </div>
        {alertCount > 0 && (
          <Link to="/alerts" className="btn btn-danger" style={{ textDecoration: 'none' }}>
            <HiOutlineExclamationCircle /> {alertCount} Alert{alertCount !== 1 ? 's' : ''}
          </Link>
        )}
      </div>

      {/* Project Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon purple"><HiOutlineOfficeBuilding /></div>
          <div className="stat-info">
            <div className="stat-label">Total Projects</div>
            <div className="stat-value">{stats?.projects?.total_projects || 0}</div>
            <div className="stat-change">
              {stats?.projects?.ongoing || 0} ongoing · {stats?.projects?.completed || 0} completed
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green"><HiOutlineUsers /></div>
          <div className="stat-info">
            <div className="stat-label">Active Workers</div>
            <div className="stat-value">{stats?.workers?.active_workers || 0}</div>
            <div className="stat-change">
              of {stats?.workers?.total_workers || 0} total workers
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon blue"><HiOutlineTruck /></div>
          <div className="stat-info">
            <div className="stat-label">Machines</div>
            <div className="stat-value">{stats?.machines?.total_machines || 0}</div>
            <div className="stat-change">
              {stats?.machines?.available || 0} available · {stats?.machines?.in_use || 0} in use
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon orange"><HiOutlineCurrencyDollar /></div>
          <div className="stat-info">
            <div className="stat-label">Total Budget</div>
            <div className="stat-value currency">{fmt(stats?.projects?.total_budget)}</div>
          </div>
        </div>
      </div>

      {/* Budget Comparison — Billable vs Actual vs Billed */}
      {bc && (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon purple"><HiOutlineDocumentText /></div>
            <div className="stat-info">
              <div className="stat-label">Billable (Budget)</div>
              <div className="stat-value currency">{fmt(bc.billable)}</div>
              <div className="stat-change">Estimated project budgets</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon red"><HiOutlineChartBar /></div>
            <div className="stat-info">
              <div className="stat-label">Actual Cost</div>
              <div className="stat-value currency">{fmt(bc.actual)}</div>
              <div className="stat-change">Total spending across all projects</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon green"><HiOutlineCash /></div>
            <div className="stat-info">
              <div className="stat-label">Billed (Revenue)</div>
              <div className="stat-value currency">{fmt(bc.billed)}</div>
              <div className="stat-change">Invoices issued</div>
            </div>
          </div>

          <div className="stat-card">
            <div className={`stat-icon ${bc.profitLoss >= 0 ? 'green' : 'red'}`}>
              <HiOutlineCurrencyDollar />
            </div>
            <div className="stat-info">
              <div className="stat-label">Net Profit / Loss</div>
              <div className="stat-value currency" style={{ color: bc.profitLoss >= 0 ? 'var(--success)' : 'var(--danger)' }}>
                {bc.profitLoss >= 0 ? '+' : ''}{fmt(bc.profitLoss)}
              </div>
              <div className="stat-change">Revenue − Actual Cost</div>
            </div>
          </div>
        </div>
      )}

      {/* Cost Breakdown */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon purple"><HiOutlineCube /></div>
          <div className="stat-info">
            <div className="stat-label">Material Cost</div>
            <div className="stat-value currency">{fmt(stats?.costs?.material)}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green"><HiOutlineUsers /></div>
          <div className="stat-info">
            <div className="stat-label">Manpower Cost</div>
            <div className="stat-value currency">{fmt(stats?.costs?.manpower)}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon blue"><HiOutlineTruck /></div>
          <div className="stat-info">
            <div className="stat-label">Machine Cost</div>
            <div className="stat-value currency">{fmt(stats?.costs?.machine)}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon red"><HiOutlineDocumentText /></div>
          <div className="stat-info">
            <div className="stat-label">Total Expenses</div>
            <div className="stat-value currency">{fmt(stats?.costs?.expenses)}</div>
          </div>
        </div>
      </div>

      {/* Financial Overview */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon green"><HiOutlineCash /></div>
          <div className="stat-info">
            <div className="stat-label">Total Investments</div>
            <div className="stat-value currency">{fmt(stats?.financial?.investments)}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon blue"><HiOutlineDocumentText /></div>
          <div className="stat-info">
            <div className="stat-label">Total Billed</div>
            <div className="stat-value currency">{fmt(stats?.financial?.billed)}</div>
            <div className="stat-change">{fmt(stats?.financial?.paid)} paid</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon orange"><HiOutlineChartBar /></div>
          <div className="stat-info">
            <div className="stat-label">Total Cost</div>
            <div className="stat-value currency">{fmt(stats?.costs?.total)}</div>
            <div className="stat-change">3M + Expenses</div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div className="card">
          <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '16px', color: 'var(--text-primary)' }}>
            Recent Projects
          </h3>
          {recent?.recentProjects?.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {recent.recentProjects.map(p => (
                <div key={p.project_id} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '10px 14px', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-subtle)'
                }}>
                  <div>
                    <div style={{ fontWeight: 500, fontSize: '0.85rem' }}>{p.project_name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {new Date(p.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <span className={`badge badge-${p.status}`}>{p.status}</span>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No recent projects</p>
          )}
        </div>

        <div className="card">
          <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '16px', color: 'var(--text-primary)' }}>
            Recent Expenses
          </h3>
          {recent?.recentExpenses?.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {recent.recentExpenses.map((e, i) => (
                <div key={i} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '10px 14px', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-subtle)'
                }}>
                  <div>
                    <div style={{ fontWeight: 500, fontSize: '0.85rem' }}>{e.project_name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{e.category_name}</div>
                  </div>
                  <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--danger)' }}>
                    {fmt(e.amount)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No recent expenses</p>
          )}
        </div>
      </div>
    </div>
  );
}
