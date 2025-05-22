import React from 'react';
import styles from './Customers.module.css';

const CustomersTable = ({ paginated, selectedId, setSelectedId, onEdit, onDelete }) => (
  <div className={styles.card}>
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>S No</th>
            <th>Name</th>
            <th>Email</th>
            <th>Address</th>
            <th>GST</th>
            <th>Mobile No</th>
            <th>Region</th>
            <th>Branch</th>
            <th>Type</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {paginated.length === 0 ? (
            <tr>
              <td colSpan={10} style={{ textAlign: 'center', padding: 16 }}>No data found.</td>
            </tr>
          ) : paginated.map((customer, idx) => {
            const rowId = customer._id || idx;
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
                <td>{customer.name}</td>
                <td>{customer.email}</td>
                <td>{customer.address}</td>
                <td>{customer.gst}</td>
                <td>{customer.mobileNo}</td>
                <td>{customer.region}</td>
                <td>{customer.branch}</td>
                <td>{customer.type}</td>
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

export default CustomersTable;
