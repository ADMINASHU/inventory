import React, { useState, useEffect, useRef } from 'react';
import styles from './List.module.css';

const ListForm = ({ open, onClose, onSave, initial, data }) => {
  const [partName, setPartName] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const inputRef = useRef(null);

  // Collect unique categories from data (all parts)
  const categorySuggestions = Array.isArray(data) && data.length > 0
    ? Array.from(new Set(data.map(i => i.category).filter(Boolean)))
    : [];

  // Filter suggestions based on input
  const filteredSuggestions = category
    ? categorySuggestions.filter(cat =>
        cat.toLowerCase().includes(category.toLowerCase())
      )
    : categorySuggestions;

  useEffect(() => {
    if (open) {
      setPartName(initial?.partName || '');
      setCategory(initial?.category || '');
      setDescription(initial?.description || '');
    }
  }, [open, initial]);

  // Hide suggestions on outside click
  useEffect(() => {
    if (!showSuggestions) return;
    const handleClick = (e) => {
      if (inputRef.current && !inputRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showSuggestions]);

  if (!open) return null;
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
      <div style={{ background: '#fff', padding: 24, borderRadius: 8, minWidth: 320, boxShadow: '0 2px 12px rgba(0,0,0,0.15)' }}>
        <h3>{initial && !Array.isArray(initial) ? 'Edit' : 'Add'} Part</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input className={styles.input} placeholder="Part Name" value={partName} onChange={e => setPartName(e.target.value)} />
          {/* Custom category input with suggestions */}
          <div className={styles.suggestionWrapper} ref={inputRef} style={{ position: 'relative' }}>
            <input
              className={styles.input}
              placeholder="Category"
              value={category}
              onChange={e => {
                setCategory(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              autoComplete="off"
            />
            {/* Dropdown icon */}
            <span className={styles.dropdownIcon}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M4 6l4 4 4-4" stroke="#1976d2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            {showSuggestions && filteredSuggestions.length > 0 && (
              <ul className={styles.suggestionDropdown}>
                {filteredSuggestions.map(cat => (
                  <li
                    key={cat}
                    className={styles.suggestionItem}
                    onMouseDown={() => {
                      setCategory(cat);
                      setShowSuggestions(false);
                    }}
                  >
                    {cat}
                  </li>
                ))}
              </ul>
            )}
          </div>
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
          }}>{initial && !Array.isArray(initial) ? 'Update' : 'Add'}</button>
        </div>
      </div>
    </div>
  );
};

export default ListForm;
