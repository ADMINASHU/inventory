import React from 'react';
import styles from './Users.module.css';

const UsersTable = ({ paginated, selectedId, setSelectedId, onEdit, onDelete }) => (
  <div className={styles.card}>
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>S No</th>
            <th>Name</th>
            <th>Email</th>
            <th>Mobile No</th>
            <th>Address</th>
            <th>Branch</th>
            <th>Region</th>
            <th>Verified</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {paginated.length === 0 ? (
            <tr>
              <td colSpan={10} style={{ textAlign: 'center', padding: 16 }}>No data found.</td>
            </tr>
          ) : paginated.map((user, idx) => {
            const rowId = user._id || idx;
            const isSelected = selectedId === rowId;
            return (
              <tr
                key={rowId}
                className={isSelected ? styles.selectedRow : ''}
                style={{
                  position: 'relative',
                  background: isSelected ? '#e3e8ef' : undefined,
                  cursor: 'pointer'
                }}
                onClick={() => setSelectedId(isSelected ? null : rowId)}
              >
                <td>{idx + 1}</td>
                <td>{`${user.fName || ''} ${user.eName || ''}`} {user.isSecure ? (
                  <span style={{ verticalAlign: 'middle', marginRight: 4 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#ff4c4c" xmlns="http://www.w3.org/2000/svg" style={{ display: 'inline' }}>
                      <path d="M12 2L4 5V11C4 16.52 7.58 21.74 12 23C16.42 21.74 20 16.52 20 11V5L12 2Z"/>
                    </svg>
                  </span>
                ) : null}</td>
                <td>{user.email}</td>
                <td>{user.mobileNo}</td>
                <td>{user.address}</td>
                <td>{user.branch}</td>
                <td>{user.region}</td>
          
                <td style={{
                  color: user.verified ? "green" : "red",
                  textAlign: "center"
                }}>
                  {user.verified ? "Verified" : "Blocked"}
                </td>
                <td style={{ position: 'relative' }}>
                  {isSelected && (
                    <span
                      className={styles.rowActions}
                      style={{
                        display: 'flex',
                        position: 'absolute',
                        right: 8,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        gap: 6,
                        zIndex: 2,
                      }}
                      onClick={e => e.stopPropagation()}
                    >
                      <button
                        className={styles.addBtn}
                        style={{ minWidth: 48, padding: '0 10px' }}
                        onClick={onEdit}
                      >Edit</button>
                      <button
                        className={styles.pageBtn}
                        style={{ background: '#f44336', color: '#fff', minWidth: 48, padding: '0 10px' }}
                        onClick={onDelete}
                      >Delete</button>
                    </span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  </div>
);

export default UsersTable;
