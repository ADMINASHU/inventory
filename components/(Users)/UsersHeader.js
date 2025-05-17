import React from 'react';
import styles from './Users.module.css';

const UsersHeader = ({ type, setType, search, setSearch, onAdd }) => (
  <div className={styles.card}>
    <div className={styles.header}>
      <div className={styles.filters}>
        <select
          value={type}
          onChange={e => setType(e.target.value)}
          className={styles.select}
        >
          <option value="">All Type</option>
          <option value="USER">User</option>
          <option value="STORE">Store</option>
          {/* Add more roles as needed */}
        </select>
        <input
          type="text"
          placeholder="Search name or email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className={styles.input}
        />
      </div>
      <button className={styles.addBtn} onClick={onAdd}>
        Add User
      </button>
    </div>
  </div>
);

export default UsersHeader;
