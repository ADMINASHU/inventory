import React from 'react';
import styles from './List.module.css';

const ListHeader = ({ category, setCategory, search, setSearch, onAdd, data = [] }) => {
  // Collect unique categories from data
  const categoryOptions = Array.isArray(data) && data.length > 0
    ? Array.from(new Set(data.map(i => i.category).filter(Boolean)))
    : [];

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.filters}>
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className={styles.select}
          >
            <option value="">All Categories</option>
            {categoryOptions.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Search part name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className={styles.input}
          />
        </div>
        <button className={styles.addBtn} onClick={onAdd}>
          Add List
        </button>
      </div>
    </div>
  );
};

export default ListHeader;
