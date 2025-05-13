import React from 'react';
import styles from './Transaction.module.css';

const TransactionTable = ({ paginated, selectedId, setSelectedId, onEdit, onDelete }) => {
  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.th}>#</th>
            <th className={styles.th}>Transaction ID</th>
            <th className={styles.th}>Date</th>
            <th className={styles.th}>Items</th>
            <th className={styles.th}>Total</th>
            <th className={styles.th}>Method</th>
            <th className={styles.th}>Type</th>
            <th className={styles.th}>From</th>
            <th className={styles.th}>To</th>
            <th className={styles.th}>Status</th>
            <th className={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginated.length === 0 ? (
            <tr>
              <td className={styles.td} colSpan={11} style={{ textAlign: 'center' }}>No transactions found.</td>
            </tr>
          ) : (
            paginated.map((txn, idx) => (
              <tr
                key={txn._id || idx}
                className={selectedId === (txn._id || idx) ? styles.rowSelected : ''}
                onClick={() => setSelectedId(txn._id || idx)}
                style={{ cursor: 'pointer' }}
              >
                <td className={styles.td}>{idx + 1}</td>
                <td className={styles.td}>{txn.transactionId}</td>
                <td className={styles.td}>{txn.date ? new Date(txn.date).toLocaleDateString() : ''}</td>
                <td className={styles.td}>
                  <ul className={styles.itemList}>
                    {txn.items && txn.items.map((item, i) => (
                      <li key={i}>
                        <span className={styles.itemPartId}>{item.partId}</span>
                        {item.partName && <> - <span>{item.partName}</span></>}
                        {item.category && <> (<span>{item.category}</span>)</>}
                        : <span className={styles.itemCount}>{item.count}</span>
                      </li>
                    ))}
                  </ul>
                </td>
                <td className={styles.td}>{txn.total}</td>
                <td className={styles.td}>{txn.transactionMethod}</td>
                <td className={styles.td}>{txn.transactionType}</td>
                <td className={styles.td}>{txn.from}</td>
                <td className={styles.td}>{txn.to}</td>
                <td className={styles.td}>{txn.transactionStatus}</td>
                <td className={styles.td}>
                  <button className={styles.iconBtn} type="button" onClick={e => { e.stopPropagation(); onEdit(); }}>✏️</button>
                  <button className={styles.iconBtn} type="button" onClick={e => { e.stopPropagation(); onDelete(); }}>🗑️</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionTable;
