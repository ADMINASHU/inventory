import React from 'react';
import styles from './Transaction.module.css';

const TransactionHeader = ({ category, setCategory, search, setSearch, onAdd }) => (
  <div className={styles.card}>
    <div className={styles.header}>
      <div className={styles.filters}>
        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          className={styles.select}
        >
          <option value="">All Categories</option>
          <option value="Passive">Passive</option>
          <option value="Active">Active</option>
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
        Add Transaction
      </button>
    </div>
  </div>
);

export default TransactionHeader;
