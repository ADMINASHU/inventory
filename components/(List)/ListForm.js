import React, { useState, useEffect } from 'react';
import styles from './List.module.css';

const ListForm = ({ open, onClose, onSave, initial }) => {
  const [partName, setPartName] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');


  useEffect(() => {
    if (open) {
      setPartName(initial?.partName || '');
      setCategory(initial?.category || '');
      setDescription(initial?.description || '');

    }
  }, [open, initial]);

  if (!open) return null;
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
      <div style={{ background: '#fff', padding: 24, borderRadius: 8, minWidth: 320, boxShadow: '0 2px 12px rgba(0,0,0,0.15)' }}>
        <h3>{initial ? 'Edit' : 'Add'} Part</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input className={styles.input} placeholder="Part Name" value={partName} onChange={e => setPartName(e.target.value)} />
          <select className={styles.select} value={category} onChange={e => setCategory(e.target.value)}>
            <option value="">Select Category</option>
            <option value="Passive">Passive</option>
            <option value="Active">Active</option>
          </select>
          <input className={styles.input} placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />

        </div>
        <div style={{ marginTop: 18, display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button className={styles.pageBtn} onClick={onClose}>Cancel</button>
          <button className={styles.addBtn} onClick={() => {
            onSave({
              partName,
              category,
              description,
              counts: []
            });
          }}>{initial ? 'Update' : 'Add'}</button>
        </div>
      </div>
    </div>
  );
};

export default ListForm;
