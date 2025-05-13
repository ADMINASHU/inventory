import React from 'react';
import styles from './Transaction.module.css';

const PaginationCard = ({ paginated, total, page, setPage, startPage, endPage, pageNumbers, totalPages }) => (
  <div className={styles.card}>
    <div className={styles.pagination}>
      <div className={styles.pageInfo}>
        Showing {paginated.length} of {total} items
      </div>
      <div className={styles.pageBtns}>
        <button
          className={styles.pageBtn}
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >&lt;</button>
        {startPage > 1 && (
          <>
            <button className={styles.pageBtn} onClick={() => setPage(1)}>1</button>
            {startPage > 2 && <span className={styles.ellipsis}>...</span>}
          </>
        )}
        {pageNumbers.map(p => (
          <button
            key={p}
            className={`${styles.pageBtn} ${p === page ? styles.active : ''}`}
            onClick={() => setPage(p)}
          >{p}</button>
        ))}
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className={styles.ellipsis}>...</span>}
            <button className={styles.pageBtn} onClick={() => setPage(totalPages)}>{totalPages}</button>
          </>
        )}
        <button
          className={styles.pageBtn}
          disabled={page === totalPages || totalPages === 0}
          onClick={() => setPage(page + 1)}
        >&gt;</button>
      </div>
    </div>
  </div>
);

export default PaginationCard;
