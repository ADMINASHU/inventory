"use client";
import React, { useState, useEffect, useCallback } from "react";
import styles from "@/components/(Stock)/Stock.module.css";


const StockDetails = ({ id }) => {
  const [item, setItem] = useState(null);
  const fetchData = useCallback(async () => {
    if (!id) return;
    const res = await fetch(`/api/list?id=${id}`);
    if (res.ok) setItem(await res.json());
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);
  const transactions = [];

  if (!item) {
    return (
      <div className={styles.detailsPage}>
        <div className={styles.detailsCard}>
          <h2 className={styles.detailsTitle}>Item Not Found</h2>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.detailsPage}>
      <div className={styles.detailsCard}>
        <h2 className={styles.detailsTitle}>{item.partName}</h2>
        <div className={styles.detailsGrid}>
          <div>
            <strong>Category:</strong> {item.category}
          </div>
          <div>
            <strong>Description:</strong> {item.description}
          </div>
          <div>
            <strong>Total Stock:</strong> {item.count}
          </div>
        </div>
      </div>
      <div className={styles.transactionsSection}>
        <h3 className={styles.transactionsTitle}>Transactions</h3>
        {transactions.length === 0 ? (
          <div className={styles.noTransactions}>No transactions found.</div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Quantity</th>
                <th>Remarks</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((txn) => (
                <tr key={txn.id}>
                  <td>{new Date(txn.date).toLocaleString()}</td>
                  <td>{txn.type}</td>
                  <td>{txn.quantity}</td>
                  <td>{txn.remarks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default StockDetails;
