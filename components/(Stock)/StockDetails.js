"use client";
import React, { useState, useEffect, useCallback } from "react";
import styles from "@/components/(Stock)/Stock.module.css";

const StockDetails = ({ id, loggedUser }) => {
  const [item, setItem] = useState(null);

  const [stock, setStock] = useState([]);
  // Fetch stock data from new API
  useEffect(() => {
    if (!loggedUser?.sub) return;
    fetch(`/api/stock?stock=${loggedUser.sub}`)
      .then((res) => (res.ok ? res.json() : []))
      .then(setStock);
  }, [loggedUser?.sub]);

  const getStockById = useCallback(
    (id) => stock.find((item) => String(item._id) === String(id)),
    [stock]
  );

  useEffect(() => {
    if (!id) return;
    if (stock.length === 0) return;
    const foundItem = getStockById(id);

    setItem(foundItem);
  }, [id,stock]);



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
};

export default StockDetails;
