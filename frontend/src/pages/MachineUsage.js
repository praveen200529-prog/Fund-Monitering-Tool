import React, { useEffect, useState } from 'react';
import API from '../api';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import DeleteConfirm from '../components/DeleteConfirm';
import toast from 'react-hot-toast';
import { HiOutlinePlus } from 'react-icons/hi';

const initialForm = { project_id: '', machine_id: '', usage_hours: '', hourly_rate: '', usage_date: '', recorded_by: '' };

export default function MachineUsage() {
  const [data, setData] = useState([]);
  const [projects, setProjects] = useState([]);
  const [machines, setMachines] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [form, setForm] = useState(initialForm);

  const load = () => {
    Promise.all([
      API.get('/machine-usage'), API.get('/projects'),
      API.get('/machines'), API.get('/users')
    ]).then(([d, p, m, u]) => {
      setData(d.data); setProjects(p.data); setMachines(m.data); setUsers(u.data);
    }).catch(() => toast.error('Failed to load'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);
  const handleChange = (e) => {
    const newForm = { ...form, [e.target.name]: e.target.value };
    if (e.target.name === 'machine_id') {
      const m = machines.find(x => x.machine_id === parseInt(e.target.value));
      if (m && m.hourly_rate) newForm.hourly_rate = m.hourly_rate;
    }
    setForm(newForm);
  };

  const handleSubmit = async () => {
    try {
      if (editing) {
        await API.put(`/machine-usage/${editing.id}`, form);
        toast.success('Record updated');
      } else {
        await API.post('/machine-usage', form);
        toast.success('Usage recorded');
      }
      setShowModal(false); setEditing(null); setForm(initialForm); load();
    } catch (err) { toast.error(err.response?.data?.error || 'Error'); }
  };

  const handleEdit = (row) => {
    setEditing(row);
    setForm({
      project_id: row.project_id, machine_id: row.machine_id, usage_hours: row.usage_hours,
      hourly_rate: row.hourly_rate, usage_date: row.usage_date ? row.usage_date.split('T')[0] : '',
      recorded_by: row.recorded_by || ''
    });
    setShowModal(true);
  };

  const handleDelete = async () => {
    try {
      await API.delete(`/machine-usage/${deleteTarget.id}`);
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
    { header: 'Machine', accessor: 'machine_name' },
    { header: 'Type', accessor: 'machine_type', render: r => r.machine_type || '—' },
    { header: 'Hours', accessor: 'usage_hours' },
    { header: 'Rate/Hr', accessor: 'hourly_rate', render: r => fmt(r.hourly_rate) },
    { header: 'Total', accessor: 'total_cost', render: r => (
      <span style={{ fontWeight: 600, color: 'var(--text-accent)' }}>{fmt(r.total_cost)}</span>
    )},
    { header: 'Date', accessor: 'usage_date' },
  ];

  if (loading) return <div className="loading-spinner"><div className="spinner" /></div>;

  return (
    <div className="animate-in">
      <div className="page-header">
        <div className="page-header-left">
          <h1>Machine Usage</h1>
          <p>Track equipment hours & costs</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setEditing(null); setForm(initialForm); setShowModal(true); }}>
          <HiOutlinePlus /> Log Usage
        </button>
      </div>

      <DataTable columns={columns} data={data} onEdit={handleEdit}
        onDelete={r => { setDeleteTarget(r); setShowDelete(true); }}
        searchPlaceholder="Search..." emptyIcon="🚜" emptyTitle="No machine usage logged"
      />

      <Modal isOpen={showModal} onClose={() => setShowModal(false)}
        title={editing ? 'Edit Record' : 'Log Machine Usage'}
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
            <label className="form-label">Machine *</label>
            <select className="form-select" name="machine_id" value={form.machine_id} onChange={handleChange}>
              <option value="">Select machine</option>
              {machines.map(m => <option key={m.machine_id} value={m.machine_id}>{m.machine_name}</option>)}
            </select>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Hours *</label>
            <input className="form-input" type="number" step="0.5" name="usage_hours" value={form.usage_hours} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label className="form-label">Hourly Rate (₹) *</label>
            <input className="form-input" type="number" name="hourly_rate" value={form.hourly_rate} onChange={handleChange} />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Usage Date *</label>
            <input className="form-input" type="date" name="usage_date" value={form.usage_date} onChange={handleChange} />
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
