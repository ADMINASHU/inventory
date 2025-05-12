import React from 'react';
import styles from './Users.module.css';

const UsersHeader = ({ role, setRole, search, setSearch, onAdd }) => (
  <div className={styles.card}>
    <div className={styles.header}>
      <div className={styles.filters}>
        <select
          value={role}
          onChange={e => setRole(e.target.value)}
          className={styles.select}
        >
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
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
