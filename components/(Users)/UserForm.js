import React, { useState, useEffect } from 'react';
import styles from './Users.module.css';

const UserForm = ({ open, onClose, onSave, initial }) => {
  const [fName, setFName] = useState('');
  const [eName, setEName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNo, setMobileNo] = useState('');
  const [designation, setDesignation] = useState('');
  const [branch, setBranch] = useState('');
  const [region, setRegion] = useState('');
  const [level, setLevel] = useState('');
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    if (open) {
      setFName(initial?.fName || '');
      setEName(initial?.eName || '');
      setEmail(initial?.email || '');
      setMobileNo(initial?.mobileNo || '');
      setDesignation(initial?.designation || '');
      setBranch(initial?.branch || '');
      setRegion(initial?.region || '');
      setLevel(initial?.level || '');
      setVerified(initial?.verified || false);
    }
  }, [open, initial]);

  if (!open) return null;
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
      <div style={{ background: '#fff', padding: 24, borderRadius: 8, minWidth: 320, boxShadow: '0 2px 12px rgba(0,0,0,0.15)' }}>
        <h3>{initial ? 'Edit' : 'Add'} User</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input className={styles.input} placeholder="First Name" value={fName} onChange={e => setFName(e.target.value)} />
          <input className={styles.input} placeholder="Last Name" value={eName} onChange={e => setEName(e.target.value)} />
          <input className={styles.input} placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
          <input className={styles.input} placeholder="Mobile No" value={mobileNo} onChange={e => setMobileNo(e.target.value)} />
          <input className={styles.input} placeholder="Designation" value={designation} onChange={e => setDesignation(e.target.value)} />
          <input className={styles.input} placeholder="Branch" value={branch} onChange={e => setBranch(e.target.value)} />
          <input className={styles.input} placeholder="Region" value={region} onChange={e => setRegion(e.target.value)} />
          <input className={styles.input} type="number" placeholder="Level" value={level} onChange={e => setLevel(e.target.value)} />
          <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input type="checkbox" checked={verified} onChange={e => setVerified(e.target.checked)} />
            Verified
          </label>
        </div>
        <div style={{ marginTop: 18, display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button className={styles.pageBtn} onClick={onClose}>Cancel</button>
          <button className={styles.addBtn} onClick={() => {
            onSave({
              fName,
              eName,
              email,
              mobileNo,
              designation,
              branch,
              region,
              level,
              verified
            });
          }}>{initial ? 'Update' : 'Add'}</button>
        </div>
      </div>
    </div>
  );
};

export default UserForm;
