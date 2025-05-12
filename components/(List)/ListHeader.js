import React from 'react';
import styles from './List.module.css';

const ListHeader = ({ category, setCategory, search, setSearch, onAdd }) => (
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
          {/* Add more categories as needed */}
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

export default ListHeader;
