import React from 'react';
import styles from './Stock.module.css';

const StockHeader =  ({ category, setCategory, search, setSearch, data = [] }) => {
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
          placeholder="Search Item name..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className={styles.input}
        />
      </div>
     
    </div>
  </div>
);
}
export default StockHeader;
