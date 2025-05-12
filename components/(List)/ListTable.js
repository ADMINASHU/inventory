import React from 'react';
import { useRouter } from 'next/navigation';
import styles from './List.module.css';

const ListTable = ({ paginated, selectedId, setSelectedId, onEdit, onDelete }) => {
  const router = useRouter();
  return (
    <div className={styles.card}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>S No</th>
            <th>Part Name</th>
            <th>Category</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {paginated.length === 0 ? (
            <tr>
              <td colSpan={4} style={{ textAlign: 'center', padding: 16 }}>No data found.</td>
            </tr>
          ) : paginated.map((item, idx) => {
            const rowId = item._id || idx;
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
                onDoubleClick={e => {
                  e.stopPropagation();
                  if (item._id) {
                    router.push(`/list/${item._id}`);
                  }
                }}
              >
                <td>{idx + 1}</td>
                <td>{item.partName}</td>
                <td>{item.category}</td>
                <td style={{ position: 'relative' }}>
                  {item.description}
                  {(isSelected || undefined) && (
                    <span
                      className={styles.rowActions}
                      style={{
                        display: isSelected ? 'flex' : 'none',
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
  );
};

export default ListTable;
