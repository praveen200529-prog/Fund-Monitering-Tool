import React, { useEffect, useState } from 'react';
import API from '../api';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import DeleteConfirm from '../components/DeleteConfirm';
import toast from 'react-hot-toast';
import { HiOutlinePlus } from 'react-icons/hi';

const initialForm = { project_id: '', worker_id: '', work_days: '', daily_rate: '', work_date: '', recorded_by: '' };

export default function ManpowerUsage() {
  const [data, setData] = useState([]);
  const [projects, setProjects] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [form, setForm] = useState(initialForm);

  const load = () => {
    Promise.all([
      API.get('/manpower-usage'), API.get('/projects'),
      API.get('/workers'), API.get('/users')
    ]).then(([d, p, w, u]) => {
      setData(d.data); setProjects(p.data); setWorkers(w.data); setUsers(u.data);
    }).catch(() => toast.error('Failed to load'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);
  const handleChange = (e) => {
    const newForm = { ...form, [e.target.name]: e.target.value };
    if (e.target.name === 'worker_id') {
      const w = workers.find(x => x.worker_id === parseInt(e.target.value));
      if (w && w.daily_rate) newForm.daily_rate = w.daily_rate;
    }
    setForm(newForm);
  };

  const handleSubmit = async () => {
    try {
      if (editing) {
        await API.put(`/manpower-usage/${editing.id}`, form);
        toast.success('Record updated');
      } else {
        await API.post('/manpower-usage', form);
        toast.success('Usage recorded');
      }
      setShowModal(false); setEditing(null); setForm(initialForm); load();
    } catch (err) { toast.error(err.response?.data?.error || 'Error'); }
  };

  const handleEdit = (row) => {
    setEditing(row);
    setForm({
      project_id: row.project_id, worker_id: row.worker_id, work_days: row.work_days,
      daily_rate: row.daily_rate, work_date: row.work_date ? row.work_date.split('T')[0] : '',
      recorded_by: row.recorded_by || ''
    });
    setShowModal(true);
  };

  const handleDelete = async () => {
    try {
      await API.delete(`/manpower-usage/${deleteTarget.id}`);
      toast.success('Record deleted');
      setShowDelete(false); setDeleteTarget(null); load();
    } catch { toast.error('Failed to delete'); }
  };

  const fmt = (n) => n ? `₹${Number(n).toLocaleString('en-IN')}` : '—';

  const columns = [
    { header: 'ID', accessor: 'id', style: { width: 60 } },
    { header: 'Project', accessor: 'project_name', render: r => (
      <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{r.project_name}</span>
    )},
    { header: 'Worker', accessor: 'worker_name' },
    { header: 'Role', accessor: 'worker_role_name', render: r => r.worker_role_name || '—' },
    { header: 'Days', accessor: 'work_days' },
    { header: 'Daily Rate', accessor: 'daily_rate', render: r => fmt(r.daily_rate) },
    { header: 'Total', accessor: 'total_cost', render: r => (
      <span style={{ fontWeight: 600, color: 'var(--text-accent)' }}>{fmt(r.total_cost)}</span>
    )},
    { header: 'Date', accessor: 'work_date' },
  ];

  if (loading) return <div className="loading-spinner"><div className="spinner" /></div>;

  return (
    <div className="animate-in">
      <div className="page-header">
        <div className="page-header-left">
          <h1>Manpower Usage</h1>
          <p>Track worker attendance & costs</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setEditing(null); setForm(initialForm); setShowModal(true); }}>
          <HiOutlinePlus /> Log Attendance
        </button>
      </div>

      <DataTable columns={columns} data={data} onEdit={handleEdit}
        onDelete={r => { setDeleteTarget(r); setShowDelete(true); }}
        searchPlaceholder="Search..." emptyIcon="👷" emptyTitle="No manpower usage logged"
      />

      <Modal isOpen={showModal} onClose={() => setShowModal(false)}
        title={editing ? 'Edit Record' : 'Log Manpower Usage'}
        footer={<>
          <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSubmit}>{editing ? 'Update' : 'Save'}</button>
        </>}
      >
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Project *</label>
            <select className="form-select" name="project_id" value={form.project_id} onChange={handleChange}>
              <option value="">Select project</option>
              {projects.map(p => <option key={p.project_id} value={p.project_id}>{p.project_name}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Worker *</label>
            <select className="form-select" name="worker_id" value={form.worker_id} onChange={handleChange}>
              <option value="">Select worker</option>
              {workers.map(w => <option key={w.worker_id} value={w.worker_id}>{w.name}</option>)}
            </select>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Work Days *</label>
            <input className="form-input" type="number" step="0.5" name="work_days" value={form.work_days} onChange={handleChange} placeholder="e.g. 1 or 0.5" />
          </div>
          <div className="form-group">
            <label className="form-label">Daily Rate (₹) *</label>
            <input className="form-input" type="number" name="daily_rate" value={form.daily_rate} onChange={handleChange} />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Work Date *</label>
            <input className="form-input" type="date" name="work_date" value={form.work_date} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label className="form-label">Recorded By</label>
            <select className="form-select" name="recorded_by" value={form.recorded_by} onChange={handleChange}>
              <option value="">Select user</option>
              {users.map(u => <option key={u.user_id} value={u.user_id}>{u.name}</option>)}
            </select>
          </div>
        </div>
      </Modal>

      <Modal isOpen={showDelete} onClose={() => setShowDelete(false)} title="Confirm Delete">
        <DeleteConfirm itemName="this record" onConfirm={handleDelete} onCancel={() => setShowDelete(false)} />
      </Modal>
    </div>
  );
}
