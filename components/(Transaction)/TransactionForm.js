import React, { useState, useEffect } from 'react';
import styles from './Transaction.module.css';

const emptyItem = { partId: '', count: 0, partName: '', category: '' };
const emptyAttachment = { name: '', type: '', id: 0 };

const TransactionForm = ({ open, onClose, onSave, initial }) => {
  const [transactionId, setTransactionId] = useState('');
  const [date, setDate] = useState('');
  const [items, setItems] = useState([{ ...emptyItem }]);
  const [total, setTotal] = useState(0);
  const [transactionMethod, setTransactionMethod] = useState('');
  const [transactionType, setTransactionType] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [createdBy, setCreatedBy] = useState('');
  const [note, setNote] = useState('');
  const [transactionStatus, setTransactionStatus] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [isDeleted, setIsDeleted] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [approvedBy, setApprovedBy] = useState('');
  const [approvedAt, setApprovedAt] = useState('');
  const [updateHistory, setUpdateHistory] = useState([]);

  useEffect(() => {
    if (open && initial) {
      setTransactionId(initial.transactionId || '');
      setDate(initial.date ? initial.date.slice(0, 10) : '');
      setItems(initial.items && initial.items.length > 0 ? initial.items : [{ ...emptyItem }]);
      setTransactionMethod(initial.transactionMethod || '');
      setTransactionType(initial.transactionType || '');
      setFrom(initial.from || '');
      setTo(initial.to || '');
      setCreatedBy(initial.createdBy || '');
      setNote(initial.note || '');
      setTransactionStatus(initial.transactionStatus || '');
      setAttachments(initial.attachment && initial.attachment.length > 0 ? initial.attachment : []);
      setIsDeleted(initial.isDeleted || false);
      setIsApproved(initial.isApproved || false);
      setApprovedBy(initial.approvedBy || '');
      setApprovedAt(initial.approvedAt ? initial.approvedAt.slice(0, 16) : '');
      setUpdateHistory(initial.updateHistory || []);
    } else if (open) {
      setTransactionId('');
      setDate('');
      setItems([{ ...emptyItem }]);
      setTransactionMethod('');
      setTransactionType('');
      setFrom('');
      setTo('');
      setCreatedBy('');
      setNote('');
      setTransactionStatus('');
      setAttachments([]);
      setIsDeleted(false);
      setIsApproved(false);
      setApprovedBy('');
      setApprovedAt('');
      setUpdateHistory([]);
    }
  }, [open, initial]);

  // Update total automatically when items change
  useEffect(() => {
    setTotal(items.reduce((sum, item) => sum + (Number(item.count) || 0), 0));
  }, [items]);

  const handleItemChange = (idx, field, value) => {
    setItems(items => items.map((item, i) => i === idx ? { ...item, [field]: value } : item));
  };

  const handleAddItem = () => setItems(items => [...items, { ...emptyItem }]);
  const handleRemoveItem = idx => setItems(items => items.filter((_, i) => i !== idx));

  const handleAttachmentChange = (idx, field, value) => {
    setAttachments(attachments => attachments.map((att, i) => i === idx ? { ...att, [field]: value } : att));
  };

  const handleAddAttachment = () => setAttachments(atts => [...atts, { ...emptyAttachment }]);
  const handleRemoveAttachment = idx => setAttachments(atts => atts.filter((_, i) => i !== idx));

  if (!open) return null;
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalCard}>
        <h3 className={styles.formTitle}>{initial ? 'Edit' : 'Add'} Transaction</h3>
        <form
          className={styles.form}
          onSubmit={e => {
            e.preventDefault();
            onSave({
              transactionId,
              date,
              items,
              total,
              transactionMethod,
              transactionType,
              from,
              to,
              createdBy,
              note,
              transactionStatus,
              attachment: attachments,
              isDeleted,
              isApproved,
              approvedBy,
              approvedAt: approvedAt ? new Date(approvedAt) : null,
              // updateHistory is not sent from form, it's backend managed
            });
          }}
        >
          <div className={styles.section}>
            <div className={styles.sectionTitle}>Transaction Info</div>
            <div className={styles.grid2col}>
              <input className={styles.input} placeholder="Transaction ID" value={transactionId} onChange={e => setTransactionId(e.target.value)} required />
              <input className={styles.input} type="date" placeholder="Date" value={date} onChange={e => setDate(e.target.value)} required />
              {/* Removed total input */}
              <input className={styles.input} placeholder="Transaction Method" value={transactionMethod} onChange={e => setTransactionMethod(e.target.value)} required />
              <input className={styles.input} placeholder="Transaction Type" value={transactionType} onChange={e => setTransactionType(e.target.value)} required />
              <input className={styles.input} placeholder="From" value={from} onChange={e => setFrom(e.target.value)} required />
              <input className={styles.input} placeholder="To" value={to} onChange={e => setTo(e.target.value)} required />
              <input className={styles.input} placeholder="Created By" value={createdBy} onChange={e => setCreatedBy(e.target.value)} required />
              <input className={styles.input} placeholder="Transaction Status" value={transactionStatus} onChange={e => setTransactionStatus(e.target.value)} required />
              <div className={styles.checkboxRow}>
                <label>
                  <input type="checkbox" checked={isDeleted} onChange={e => setIsDeleted(e.target.checked)} />
                  <span style={{ marginLeft: 6 }}>Is Deleted</span>
                </label>
                <label>
                  <input type="checkbox" checked={isApproved} onChange={e => setIsApproved(e.target.checked)} />
                  <span style={{ marginLeft: 6 }}>Is Approved</span>
                </label>
              </div>
              <input className={styles.input} placeholder="Approved By" value={approvedBy} onChange={e => setApprovedBy(e.target.value)} />
              <input className={styles.input} type="datetime-local" placeholder="Approved At" value={approvedAt} onChange={e => setApprovedAt(e.target.value)} />
            </div>
            <textarea className={styles.input} placeholder="Note" value={note} onChange={e => setNote(e.target.value)} rows={2} />
            <div style={{ marginTop: 8, fontWeight: 500, color: '#1976d2' }}>
              Total: {total}
            </div>
          </div>

          <div className={styles.section}>
            <div className={styles.sectionTitle}>Items</div>
            <div className={styles.itemListView}>
              <div className={styles.itemListHeader}>
                <span>Part ID</span>
                <span>Part Name</span>
                <span>Category</span>
                <span>Count</span>
                <span style={{ minWidth: 60 }}></span>
              </div>
              {items.map((item, idx) => (
                <div key={idx} className={styles.itemListRow}>
                  <input className={styles.input} type="text" placeholder="Part ID" value={item.partId} onChange={e => handleItemChange(idx, 'partId', e.target.value)} required />
                  <input className={styles.input} type="text" placeholder="Part Name" value={item.partName || ''} onChange={e => handleItemChange(idx, 'partName', e.target.value)} />
                  <input className={styles.input} type="text" placeholder="Category" value={item.category || ''} onChange={e => handleItemChange(idx, 'category', e.target.value)} />
                  <input className={styles.input} type="number" min={0} placeholder="Count" value={item.count} onChange={e => handleItemChange(idx, 'count', Number(e.target.value))} required />
                  <div style={{ display: 'flex', gap: 4 }}>
                    {items.length > 1 && (
                      <button className={styles.iconBtn} type="button" onClick={() => handleRemoveItem(idx)} title="Remove item">&minus;</button>
                    )}
                    {idx === items.length - 1 && (
                      <button className={styles.iconBtn} type="button" onClick={handleAddItem} title="Add item">+</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.section}>
            <div className={styles.sectionTitle}>Attachments</div>
            <div className={styles.itemListView}>
              <div className={styles.itemListHeader}>
                <span>Name</span>
                <span>Type</span>
                <span>ID</span>
                <span style={{ minWidth: 60 }}></span>
              </div>
              {(attachments.length === 0 ? [emptyAttachment] : attachments).map((att, idx) => (
                <div key={idx} className={styles.itemListRow}>
                  <input className={styles.input} placeholder="Name" value={att.name} onChange={e => handleAttachmentChange(idx, 'name', e.target.value)} />
                  <input className={styles.input} placeholder="Type" value={att.type} onChange={e => handleAttachmentChange(idx, 'type', e.target.value)} />
                  <input className={styles.input} type="number" min={0} placeholder="ID" value={att.id} onChange={e => handleAttachmentChange(idx, 'id', Number(e.target.value))} />
                  <div style={{ display: 'flex', gap: 4 }}>
                    {attachments.length > 0 && (
                      <button className={styles.iconBtn} type="button" onClick={() => handleRemoveAttachment(idx)} title="Remove attachment">&minus;</button>
                    )}
                    {idx === attachments.length - 1 && (
                      <button className={styles.iconBtn} type="button" onClick={handleAddAttachment} title="Add attachment">+</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {updateHistory.length > 0 && (
            <div className={styles.section}>
              <div className={styles.sectionTitle}>Update History</div>
              <div className={styles.updateHistoryList}>
                {updateHistory.map((hist, idx) => (
                  <div key={idx} className={styles.updateHistoryRow}>
                    <span>{hist.updateType}</span>
                    <span>{hist.updatedBy}</span>
                    <span>{hist.updatedAt ? new Date(hist.updatedAt).toLocaleString() : ''}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className={styles.formActions}>
            <button className={styles.pageBtn} type="button" onClick={onClose}>Cancel</button>
            <button className={styles.addBtn} type="submit">{initial ? 'Update' : 'Add'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionForm;
