import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../api';
import { useAuth } from '../context/AuthContext';
import {
  HiOutlineArrowLeft,
  HiOutlineOfficeBuilding,
  HiOutlineCurrencyDollar,
  HiOutlineUsers,
  HiOutlineTruck,
  HiOutlineCube,
  HiOutlineDocumentText,
  HiOutlineCash,
  HiOutlineChartBar,
  HiOutlineClipboardList,
  HiOutlineUserGroup,
  HiOutlineCog,
  HiOutlineCalendar,
  HiOutlineLocationMarker,
} from 'react-icons/hi';

// ─── Helpers ───────────────────────────────────────────────────────────────
const fmt = (n) =>
  n != null && n !== ''
    ? new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
      }).format(n)
    : '—';

const fmtDate = (d) => (d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—');

// ─── Sub-components ────────────────────────────────────────────────────────

function StatusBadge({ status }) {
  return <span className={`badge badge-${status}`}>{status?.replace('_', ' ')}</span>;
}

function ProgressBar({ pct }) {
  const p = Math.min(Math.max(pct || 0, 0), 100);
  const color = p >= 80 ? 'var(--success)' : p >= 40 ? 'var(--warning)' : 'var(--danger)';
  return (
    <div style={{ marginTop: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Completion</span>
        <span style={{ fontSize: '0.82rem', fontWeight: 700, color }}>{p}%</span>
      </div>
      <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 999, height: 8, overflow: 'hidden' }}>
        <div style={{ width: `${p}%`, height: '100%', background: color, borderRadius: 999, transition: 'width 0.6s ease' }} />
      </div>
    </div>
  );
}

function SectionHeader({ icon: Icon, title, color = 'var(--accent-start, #6366f1)' }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
      <div style={{
        width: 36, height: 36, borderRadius: 10,
        background: `${color}22`, display: 'flex', alignItems: 'center',
        justifyContent: 'center', color, fontSize: '1.1rem', flexShrink: 0
      }}>
        <Icon />
      </div>
      <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>{title}</h2>
    </div>
  );
}

function InfoGrid({ items }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
      {items.map(({ label, value, color }) => (
        <div key={label} style={{
          padding: '12px 16px',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-sm, 10px)'
        }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
          <div style={{ fontSize: '0.92rem', fontWeight: 600, color: color || 'var(--text-primary)' }}>{value}</div>
        </div>
      ))}
    </div>
  );
}

function SimpleTable({ columns, rows, emptyMsg }) {
  if (!rows || rows.length === 0) {
    return <p style={{ color: 'var(--text-muted)', fontSize: '0.84rem', padding: '12px 0' }}>{emptyMsg || 'No records found.'}</p>;
  }
  return (
    <div style={{ overflowX: 'auto' }}>
      <table className="data-table">
        <thead>
          <tr>{columns.map(c => <th key={c.key}>{c.label}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {columns.map(c => (
                <td key={c.key} style={c.style}>
                  {c.render ? c.render(row) : (row[c.key] ?? '—')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TabGroup({ tabs, active, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 4, borderBottom: '1px solid var(--border-subtle)', marginBottom: 20 }}>
      {tabs.map(t => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          style={{
            background: 'none', border: 'none', cursor: 'pointer', padding: '10px 18px',
            fontSize: '0.84rem', fontWeight: 600, borderBottom: `2px solid ${active === t.id ? 'var(--accent-start, #6366f1)' : 'transparent'}`,
            color: active === t.id ? 'var(--accent-start, #6366f1)' : 'var(--text-muted)',
            transition: 'color 0.15s', marginBottom: -1
          }}
        >
          {t.label} {t.count != null ? <span style={{ opacity: 0.7, fontSize: '0.75rem' }}>({t.count})</span> : null}
        </button>
      ))}
    </div>
  );
}

// ─── Finance Card ───────────────────────────────────────────────────────────
function FinanceCard({ label, value, sub, icon: Icon, color = '#6366f1', highlight }) {
  return (
    <div style={{
      padding: '16px 20px',
      background: 'rgba(255,255,255,0.03)',
      border: `1px solid ${highlight ? color + '55' : 'var(--border-subtle)'}`,
      borderRadius: 'var(--radius-sm, 10px)',
      display: 'flex', gap: 14, alignItems: 'flex-start'
    }}>
      <div style={{
        width: 40, height: 40, borderRadius: 10, background: `${color}22`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color, fontSize: '1.2rem', flexShrink: 0
      }}>
        <Icon />
      </div>
      <div>
        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
        <div style={{ fontSize: '1.1rem', fontWeight: 700, color: highlight || 'var(--text-primary)', marginTop: 2 }}>{value}</div>
        {sub && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>{sub}</div>}
      </div>
    </div>
  );
}

// ─── Main Page ──────────────────────────────────────────────────────────────
export default function ProjectDetail() {
  const { id } = useParams();
  const { isManager } = useAuth();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('materials');

  useEffect(() => {
    API.get(`/projects/${id}/details`)
      .then(r => setData(r.data))
      .catch(err => setError(err.response?.data?.error || 'Failed to load project'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="loading-spinner"><div className="spinner" /></div>;

  if (error) {
    return (
      <div className="animate-in" style={{ textAlign: 'center', padding: '60px 20px' }}>
        <div style={{ fontSize: '3rem', marginBottom: 16 }}>🚫</div>
        <h2 style={{ color: 'var(--danger)' }}>Project Not Found</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>{error}</p>
        <Link to="/projects" className="btn btn-secondary">← Back to Projects</Link>
      </div>
    );
  }

  const { project, progress, financials, material_usage, manpower_usage, machine_usage, team, billing, expenses } = data;

  const isOverBudget = financials.budget_variance < 0;

  // ── Resource tabs
  const resourceTabs = [
    { id: 'materials', label: '🧱 Materials', count: material_usage.length },
    { id: 'manpower', label: '👷 Manpower', count: manpower_usage.length },
    { id: 'machines', label: '🚜 Machines', count: machine_usage.length },
  ];

  return (
    <div className="animate-in">
      {/* ── Page Header ── */}
      <div className="page-header" style={{ flexWrap: 'wrap', gap: 12 }}>
        <div className="page-header-left">
          <Link
            to="/projects"
            className="btn btn-secondary btn-sm"
            style={{ marginBottom: 10, display: 'inline-flex', alignItems: 'center', gap: 6, textDecoration: 'none', fontSize: '0.82rem' }}
          >
            <HiOutlineArrowLeft /> Back to Projects
          </Link>
          <h1 style={{ margin: 0 }}>{project.project_name}</h1>
          <p style={{ margin: '4px 0 0', display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            {project.location && (
              <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                <HiOutlineLocationMarker /> {project.location}
              </span>
            )}
          </p>
        </div>
        <StatusBadge status={project.status} />
      </div>

      {/* ── SECTION 1: Project Overview ── */}
      <div className="card" style={{ marginBottom: 20 }}>
        <SectionHeader icon={HiOutlineOfficeBuilding} title="Project Overview" />
        <InfoGrid items={[
          { label: 'Project ID', value: `#${project.project_id}` },
          { label: 'Location', value: project.location || '—' },
          { label: 'Start Date', value: fmtDate(project.start_date) },
          { label: 'End Date', value: fmtDate(project.end_date) },
          { label: 'Estimated Budget', value: fmt(project.estimated_budget), color: 'var(--accent-start, #6366f1)' },
          { label: 'Created By', value: project.created_by_name || '—' },
          { label: 'Created At', value: fmtDate(project.created_at) },
          { label: 'Status', value: project.status?.replace('_', ' ') || '—' },
        ]} />
        {progress && (
          <div style={{ marginTop: 20, maxWidth: 360 }}>
            <ProgressBar pct={progress.progress_percentage} />
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 6 }}>
              Latest: {progress.month}/{progress.year}
            </div>
            {progress.remarks && (
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 6 }}>
                📝 {progress.remarks}
              </p>
            )}
          </div>
        )}
      </div>

      {/* ── SECTION 2: Financial Summary (hidden for viewers) ── */}
      {isManager && (
        <div className="card" style={{ marginBottom: 20 }}>
          <SectionHeader icon={HiOutlineCurrencyDollar} title="Financial Summary" color="#10b981" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 14, marginBottom: 16 }}>
            <FinanceCard label="Estimated Budget" value={fmt(project.estimated_budget)} icon={HiOutlineChartBar} color="#6366f1" />
            <FinanceCard label="Actual Cost" value={fmt(financials.actual_cost)} icon={HiOutlineCash} color="#f59e0b" />
            <FinanceCard
              label="Budget Variance"
              value={fmt(Math.abs(financials.budget_variance))}
              sub={isOverBudget ? '⚠ Over budget' : '✓ Under budget'}
              icon={HiOutlineChartBar}
              color={isOverBudget ? '#ef4444' : '#10b981'}
              highlight={isOverBudget ? '#ef4444' : null}
            />
            <FinanceCard label="Total Investments" value={fmt(financials.total_investments)} icon={HiOutlineCurrencyDollar} color="#10b981" />
            <FinanceCard label="Total Loans" value={fmt(financials.total_loans)} icon={HiOutlineCash} color="#3b82f6" />
            <FinanceCard label="Pending Interest" value={fmt(financials.pending_interest)} icon={HiOutlineDocumentText} color={financials.pending_interest > 0 ? '#ef4444' : '#6b7280'} />
            <FinanceCard
              label="Total Billed"
              value={fmt(financials.total_billed)}
              sub={`${financials.pending_invoices} invoice${financials.pending_invoices !== 1 ? 's' : ''} pending`}
              icon={HiOutlineDocumentText}
              color="#a78bfa"
            />
            <FinanceCard label="Total Expenses" value={fmt(financials.expense_cost)} icon={HiOutlineClipboardList} color="#f59e0b" />
          </div>

          {/* Cost breakdown mini row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
            {[
              { label: '🧱 Materials', val: financials.material_cost },
              { label: '👷 Manpower', val: financials.manpower_cost },
              { label: '🚜 Machines', val: financials.machine_cost },
            ].map(({ label, val }) => (
              <div key={label} style={{
                textAlign: 'center', padding: '10px 12px',
                background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)', borderRadius: 8
              }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{label}</div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', marginTop: 4 }}>{fmt(val)}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── SECTION 3: Resource Usage ── */}
      <div className="card" style={{ marginBottom: 20 }}>
        <SectionHeader icon={HiOutlineCube} title="Resource Usage (3M)" color="#f59e0b" />
        <TabGroup tabs={resourceTabs} active={activeTab} onChange={setActiveTab} />

        {activeTab === 'materials' && (
          <SimpleTable
            emptyMsg="No material usage recorded for this project."
            columns={[
              { key: 'material_name', label: 'Material', render: r => <strong style={{ color: 'var(--text-primary)' }}>{r.material_name}</strong> },
              { key: 'quantity', label: 'Qty', render: r => r.quantity ?? '—' },
              { key: 'unit', label: 'Unit' },
              { key: 'unit_price', label: 'Unit Price', render: r => fmt(r.unit_price) },
              { key: 'total_cost', label: 'Total Cost', render: r => <span style={{ fontWeight: 700, color: 'var(--danger)' }}>{fmt(r.total_cost)}</span> },
              { key: 'usage_date', label: 'Date', render: r => fmtDate(r.usage_date) },
            ]}
            rows={material_usage}
          />
        )}

        {activeTab === 'manpower' && (
          <SimpleTable
            emptyMsg="No manpower usage recorded for this project."
            columns={[
              { key: 'worker_name', label: 'Worker', render: r => <strong style={{ color: 'var(--text-primary)' }}>{r.worker_name}</strong> },
              { key: 'work_days', label: 'Days' },
              { key: 'daily_rate', label: 'Daily Rate', render: r => fmt(r.daily_rate) },
              { key: 'total_cost', label: 'Total Cost', render: r => <span style={{ fontWeight: 700, color: 'var(--danger)' }}>{fmt(r.total_cost)}</span> },
              { key: 'work_date', label: 'Date', render: r => fmtDate(r.work_date) },
            ]}
            rows={manpower_usage}
          />
        )}

        {activeTab === 'machines' && (
          <SimpleTable
            emptyMsg="No machine usage recorded for this project."
            columns={[
              { key: 'machine_name', label: 'Machine', render: r => <strong style={{ color: 'var(--text-primary)' }}>{r.machine_name}</strong> },
              { key: 'usage_hours', label: 'Hours' },
              { key: 'hourly_rate', label: 'Hourly Rate', render: r => fmt(r.hourly_rate) },
              { key: 'total_cost', label: 'Total Cost', render: r => <span style={{ fontWeight: 700, color: 'var(--danger)' }}>{fmt(r.total_cost)}</span> },
              { key: 'usage_date', label: 'Date', render: r => fmtDate(r.usage_date) },
            ]}
            rows={machine_usage}
          />
        )}
      </div>

      {/* ── SECTION 4: Team ── */}
      <div className="card" style={{ marginBottom: 20 }}>
        <SectionHeader icon={HiOutlineUserGroup} title="Project Team" color="#3b82f6" />
        <SimpleTable
          emptyMsg="No team members assigned to this project."
          columns={[
            { key: 'user_name', label: 'Name', render: r => <strong style={{ color: 'var(--text-primary)' }}>{r.user_name}</strong> },
            { key: 'role', label: 'Role', render: r => <span className={`badge badge-${r.role === 'admin' ? 'overdue' : r.role === 'manager' ? 'on_hold' : 'active'}`}>{r.role}</span> },
            { key: 'assigned_date', label: 'Assigned On', render: r => fmtDate(r.assigned_date) },
          ]}
          rows={team}
        />
      </div>

      {/* ── SECTION 5: Billing & Invoices ── */}
      {isManager && (
        <div className="card" style={{ marginBottom: 20 }}>
          <SectionHeader icon={HiOutlineDocumentText} title="Billing & Invoices" color="#a78bfa" />
          <SimpleTable
            emptyMsg="No invoices raised for this project."
            columns={[
              { key: 'invoice_number', label: 'Invoice No', render: r => <code style={{ fontSize: '0.82rem', color: 'var(--text-primary)' }}>{r.invoice_number}</code> },
              { key: 'amount', label: 'Amount', render: r => <span style={{ fontWeight: 700 }}>{fmt(r.amount)}</span> },
              { key: 'status', label: 'Status', render: r => {
                const map = { paid: 'active', sent: 'on_hold', draft: 'draft', overdue: 'overdue' };
                return <span className={`badge badge-${map[r.status] || 'draft'}`}>{r.status}</span>;
              }},
              { key: 'due_date', label: 'Due Date', render: r => {
                const isOverdue = r.status !== 'paid' && r.due_date && new Date(r.due_date) < new Date();
                return <span style={{ color: isOverdue ? 'var(--danger)' : undefined }}>{fmtDate(r.due_date)}</span>;
              }},
            ]}
            rows={billing}
          />
        </div>
      )}

      {/* ── SECTION 6: Expenses ── */}
      {isManager && (
        <div className="card" style={{ marginBottom: 20 }}>
          <SectionHeader icon={HiOutlineClipboardList} title="Expenses" color="#f59e0b" />
          <SimpleTable
            emptyMsg="No expenses recorded for this project."
            columns={[
              { key: 'category_name', label: 'Category', render: r => <span className="badge badge-draft">{r.category_name}</span> },
              { key: 'description', label: 'Description', render: r => r.description || '—' },
              { key: 'amount', label: 'Amount', render: r => <span style={{ fontWeight: 700, color: 'var(--danger)' }}>{fmt(r.amount)}</span> },
              { key: 'expense_date', label: 'Date', render: r => fmtDate(r.expense_date) },
            ]}
            rows={expenses}
          />
        </div>
      )}
    </div>
  );
}
