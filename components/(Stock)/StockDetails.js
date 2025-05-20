"use client";
import React, { useState, useEffect, useCallback } from "react";
import styles from "@/components/(Stock)/Stock.module.css";
import { set } from "mongoose";

const StockDetails = ({ id, loggedUser }) => {
  const [item, setItem] = useState(null);
  const [transactions, setTransactions] = useState([]);
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
  }, [id, stock, getStockById]);

  useEffect(() => {
    if (!item) return;
    fetch(`/api/stock?item=${item._id}&user=${loggedUser?.sub}`)
      .then((res) => (res.ok ? res.json() : []))
      .then(setTransactions);
  }, [item, loggedUser?.sub]);

  if (!item) {
    return (
      <div className={styles.detailsPage}>
        <div className={styles.detailsCard}>
          <h2 className={styles.detailsTitle}>Item Not Found </h2>
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
                  <th className={styles.th}>S No.</th>
            <th className={styles.th}>Date</th>
            <th className={styles.th}>Transaction ID</th>
            <th className={styles.th}>Type</th>
            <th className={styles.th}>Account</th>
            <th className={styles.th}>Method</th>
            <th className={styles.th}>Total</th>
        
          
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr>
                  <td className={styles.td} colSpan={8} style={{ textAlign: "center" }}>
                    No transactions found.
                  </td>
                </tr>
              ) : (
                transactions.map((txn, idx) => {
                  // Find the item in the transaction's items array
                  const itemInTxn = (txn.items || []).find(
                    (i) => String(i._id) === String(item._id)
                  );
                  if (!itemInTxn) return null;
                  // Determine type and sign
                  const isOut = txn.from === loggedUser?.sub;
                  // Transaction type logic similar to TransactionTable
                  const type =
                    txn.from === loggedUser?.sub
                      ? txn.createdBy === loggedUser?.sub
                        ? "SEND"
                        : "SEND*"
                      : txn.createdBy === loggedUser?.sub
                        ? "RECEIVE*"
                        : "RECEIVE";
                  // Account logic: show the other party
                  const account = txn.from === loggedUser?.sub ? txn.to : txn.from;
                  // Quantity
                  const quantity = isOut ? -Math.abs(itemInTxn.count || 0) : Math.abs(itemInTxn.count || 0);
                  // Use itemInTxn.count for total
                  return (
                    <tr key={txn._id || idx}>
                      <td className={styles.td}>{idx + 1}</td>
                      <td className={styles.td}>
                        {txn.date ? new Date(txn.date).toLocaleDateString() : ""}
                      </td>
                      <td className={styles.td}>{txn.transactionId || txn._id}</td>
                      <td className={styles.td}>{type}</td>
                      <td className={styles.td}>{account}</td>
                      <td className={styles.td}>{txn.transactionMethod || ""}</td>
                      <td className={styles.td}>{itemInTxn.count}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default StockDetails;
