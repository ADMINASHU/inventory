import React, { useState, useEffect } from 'react';
import styles from './Customers.module.css';


const CustomerForm = ({ open, onClose, onSave, initial }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [gst, setGst] = useState('');
  const [mobileNo, setMobileNo] = useState('');
  const [branch, setBranch] = useState('');
  const [region, setRegion] = useState('');
  const [type, setType] = useState('CUSTOMER');

  useEffect(() => {
    if (open) {
      setName(initial?.name || '');
      setEmail(initial?.email || '');
      setAddress(initial?.address || '');
      setGst(initial?.gst || '');
      setMobileNo(initial?.mobileNo || '');
      setBranch(initial?.branch || '');
      setRegion(initial?.region || '');
      setType(initial?.type || 'CUSTOMER');
    }
  }, [open, initial]);

  if (!open) return null;
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
      <div style={{ background: '#fff', padding: 24, borderRadius: 8, minWidth: 320, boxShadow: '0 2px 12px rgba(0,0,0,0.15)' }}>
        <h3>{initial ? 'Edit' : 'Add'} Customer</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input
            className={styles.input}
            placeholder="Name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
          <input
            className={styles.input}
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            className={styles.input}
            placeholder="Address"
            value={address}
            onChange={e => setAddress(e.target.value)}
            required
          />
          <input
            className={styles.input}
            placeholder="GST"
            value={gst}
            onChange={e => setGst(e.target.value)}
          />
          <input
            className={styles.input}
            placeholder="Mobile No"
            value={mobileNo}
            onChange={e => setMobileNo(e.target.value)}
            required
          />
          <input
            className={styles.input}
            placeholder="Region"
            value={region}
            onChange={e => setRegion(e.target.value)}
            required
          />
          <input
            className={styles.input}
            placeholder="Branch"
            value={branch}
            onChange={e => setBranch(e.target.value)}
            required
          />
          <input
            className={styles.input}
            placeholder="Type"
            value={type}
            onChange={e => setType(e.target.value)}
            required
          />
        </div>
        <div style={{ marginTop: 18, display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button className={styles.pageBtn} onClick={onClose}>Cancel</button>
          <button
            className={styles.addBtn}
            onClick={() => {
              onSave({
                name,
                email,
                address,
                gst,
                mobileNo,
                region,
                branch,
                type
              });
            }}
          >{initial ? 'Update' : 'Add'}</button>
        </div>
      </div>
    </div>
  );
};

export default CustomerForm;
