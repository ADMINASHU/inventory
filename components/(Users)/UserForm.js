import React, { useState, useEffect } from 'react';
import styles from './Users.module.css';


const UserForm = ({ open, onClose, onSave, initial, branches = [] }) => {
  const [fName, setFName] = useState('');
  const [eName, setEName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNo, setMobileNo] = useState('');
  const [address, setAddress] = useState('');
  const [branch, setBranch] = useState("");
  const [region, setRegion] = useState('');
  const [verified, setVerified] = useState(false);
  const [isSecure, setIsSecure] = useState(null);
  const [inBranch, setInBranch] = useState(false);


  useEffect(() => {
    if (open) {
      setFName(initial?.fName || '');
      setEName(initial?.eName || '');
      setEmail(initial?.email || '');
      setMobileNo(initial?.mobileNo || '');
      setAddress(initial?.address || '');
      setBranch(initial?.branch || '');
      setRegion(initial?.region || '');
      setInBranch(initial?.inBranch || false);
      setVerified(initial?.verified || false);
      setIsSecure(initial?.isSecure || null);
    }
  }, [open, initial]);

  // Auto-fill region when branch changes
  useEffect(() => {
    if (branch && branches.length > 0) {
      const selectedBranch = branches.find(b => b._id === branch);
      setRegion(selectedBranch?.region || '');
    } else {
      setRegion('');
    }
  }, [branch, branches]);

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
          <input className={styles.input} placeholder="Address" value={address} onChange={e => setAddress(e.target.value)} />
          {/* Branch dropdown */}
          <select className={styles.input} value={branch} onChange={e => setBranch(e.target.value)}>
            <option value="">Select Branch</option>
            {branches.map(b => (
              <option key={b._id} value={b._id}>{b.name}</option>
            ))}
          </select>
          {/* Display region as readonly text, not as an input */}
          <input className={styles.input} placeholder="Region" value={region} readOnly disabled />
          <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input type="checkbox" checked={verified} onChange={e => setVerified(e.target.checked)} />
            Verified
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input type="checkbox" checked={inBranch} onChange={e => setInBranch(e.target.checked)} />
            User In Branch
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input type="checkbox" checked={isSecure} onChange={e => setIsSecure(e.target.checked)} />
            Secure
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
              address,
              branch,
              inBranch,
              verified,
              isSecure
            });
          }}>{initial ? 'Update' : 'Add'}</button>
        </div>
      </div>
    </div>
  );
};

export default UserForm;
