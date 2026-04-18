import React, { useEffect, useState } from 'react';
import API from '../api';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import DeleteConfirm from '../components/DeleteConfirm';
import toast from 'react-hot-toast';
import { HiOutlinePlus } from 'react-icons/hi';

const initialForm = { project_id: '', material_id: '', quantity: '', unit_price: '', usage_date: '', recorded_by: '' };

export default function MaterialUsage() {
  const [data, setData] = useState([]);
  const [projects, setProjects] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [form, setForm] = useState(initialForm);

  const load = () => {
    Promise.all([
      API.get('/material-usage'), API.get('/projects'),
      API.get('/materials'), API.get('/users')
    ]).then(([d, p, m, u]) => {
      setData(d.data); setProjects(p.data); setMaterials(m.data); setUsers(u.data);
    }).catch(() => toast.error('Failed to load'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);
  const handleChange = (e) => {
    const newForm = { ...form, [e.target.name]: e.target.value };
    if (e.target.name === 'material_id') {
      const mat = materials.find(m => m.material_id === parseInt(e.target.value));
      if (mat && mat.unit_price) newForm.unit_price = mat.unit_price;
    }
    setForm(newForm);
  };

  const handleSubmit = async () => {
    try {
      if (editing) {
        await API.put(`/material-usage/${editing.id}`, form);
        toast.success('Record updated');
      } else {
        await API.post('/material-usage', form);
        toast.success('Usage recorded');
      }
      setShowModal(false); setEditing(null); setForm(initialForm); load();
    } catch (err) { toast.error(err.response?.data?.error || 'Error'); }
  };

  const handleEdit = (row) => {
    setEditing(row);
    setForm({
      project_id: row.project_id, material_id: row.material_id, quantity: row.quantity,
      unit_price: row.unit_price, usage_date: row.usage_date ? row.usage_date.split('T')[0] : '',
      recorded_by: row.recorded_by || ''
    });
    setShowModal(true);
  };

  const handleDelete = async () => {
    try {
      await API.delete(`/material-usage/${deleteTarget.id}`);
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
    { header: 'Material', accessor: 'material_name' },
    { header: 'Qty', accessor: 'quantity', render: r => `${r.quantity} ${r.unit || ''}` },
    { header: 'Unit Price', accessor: 'unit_price', render: r => fmt(r.unit_price) },
    { header: 'Total', accessor: 'total_cost', render: r => (
      <span style={{ fontWeight: 600, color: 'var(--text-accent)' }}>{fmt(r.total_cost)}</span>
    )},
    { header: 'Date', accessor: 'usage_date' },
    { header: 'Recorded By', accessor: 'recorded_by_name', render: r => r.recorded_by_name || '—' },
  ];

  if (loading) return <div className="loading-spinner"><div className="spinner" /></div>;

  return (
    <div className="animate-in">
      <div className="page-header">
        <div className="page-header-left">
          <h1>Material Usage</h1>
          <p>Track material consumption per project</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setEditing(null); setForm(initialForm); setShowModal(true); }}>
          <HiOutlinePlus /> Log Usage
        </button>
      </div>

      <DataTable columns={columns} data={data} onEdit={handleEdit}
        onDelete={r => { setDeleteTarget(r); setShowDelete(true); }}
        searchPlaceholder="Search usage..." emptyIcon="📦" emptyTitle="No material usage logged"
      />

      <Modal isOpen={showModal} onClose={() => setShowModal(false)}
        title={editing ? 'Edit Usage' : 'Log Material Usage'}
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
            <label className="form-label">Material *</label>
            <select className="form-select" name="material_id" value={form.material_id} onChange={handleChange}>
              <option value="">Select material</option>
              {materials.map(m => <option key={m.material_id} value={m.material_id}>{m.material_name} ({m.unit})</option>)}
            </select>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Quantity *</label>
            <input className="form-input" type="number" step="0.01" name="quantity" value={form.quantity} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label className="form-label">Unit Price (₹) *</label>
            <input className="form-input" type="number" step="0.01" name="unit_price" value={form.unit_price} onChange={handleChange} />
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
        <DeleteConfirm itemName="this usage record" onConfirm={handleDelete} onCancel={() => setShowDelete(false)} />
      </Modal>
    </div>
  );
}
