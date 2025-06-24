import React from 'react';
import styles from './Users.module.css';

const UsersHeader = ({
  search,
  setSearch,
  onAdd,
  branchFilter,
  setBranchFilter,
  regionFilter,
  setRegionFilter,
  branches = [],
}) => {
  // Collect unique regions from branches
  const regions = Array.from(new Set(branches.map(b => b.region).filter(Boolean)));

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.filters}>
          {/* Branch filter */}
          <select
            value={branchFilter}
            onChange={e => setBranchFilter(e.target.value)}
            className={styles.select}
            style={{ minWidth: 120 }}
          >
            <option value="">All Branches</option>
            {branches.map(b => (
              <option key={b._id} value={b._id}>{b.name}</option>
            ))}
          </select>
          {/* Region filter */}
          <select
            value={regionFilter}
            onChange={e => setRegionFilter(e.target.value)}
            className={styles.select}
            style={{ minWidth: 120 }}
          >
            <option value="">All Regions</option>
            {regions.map(region => (
              <option key={region} value={region}>{region}</option>
            ))}
          </select>
          {/* Search input */}
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
};

export default UsersHeader;
