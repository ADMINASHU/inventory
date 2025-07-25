"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import styles from "@/components/(Stock)/Stock.module.css";

const StockDetails = ({ id, loggedUser }) => {
  const [item, setItem] = useState(null);
  const [users, setUsers] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [stock, setStock] = useState([]);
  const [search, setSearch] = useState(""); // Add search state
  const router = useRouter();

  const fetchUsers = useCallback(async () => {
    const res = await fetch("/api/users");
    if (res.ok) setUsers(await res.json());
  }, []);

  const fetchCustomers = useCallback(async () => {
    const res = await fetch("/api/customers");
    if (res.ok) setCustomers(await res.json());
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

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
  const getUserName = (id) => {
    const user = users.find((u) => u._id === id);
    const customer = customers.find((c) => c._id === id);
    return user ? user.fName : customer ? customer.name : id;
  };

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
      <div className={styles.stockHeader}>
        <div className={styles.stockHeaderInner}>
          <button className={styles.backBtn} onClick={() => router.back()} type="button">
            Back
          </button>
          <span className={styles.stockHeaderTitle}>Stock Details</span>
          <input
            type="text"
            placeholder="Search Transaction ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={styles.input}
            style={{ maxWidth: 260 }}
          />
        </div>
      </div>
      <div className={styles.detailsContentRow}>
        <div className={styles.detailsCardModern}>
          <div className={styles.headerSection}>
            <h2 className={styles.detailsTitleModern}>{item.partName}</h2>
            <span className={styles.categoryBadge}>{item.category}</span>
          </div>
          <div className={styles.detailsGridModern}>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Description:</span>
              <span className={styles.detailValue}>{item.description}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Total Stock:</span>
              <span className={styles.detailValue}>{item.count}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Stock on the way:</span>
              <span className={styles.detailValue}>{item.pending}</span>
            </div>
          </div>
        </div>
        <div className={styles.transactionsSectionModern}>
          <h3 className={styles.transactionsTitleModern}>Transactions</h3>
          {transactions.length === 0 ? (
            <div className={styles.noTransactionsModern}>No transactions found.</div>
          ) : (
            <div className={styles.tableWrapper}>
              <table className={styles.tableModern}>
                <thead>
                  <tr>
                    <th className={styles.thModern}>S No.</th>
                    <th className={styles.thModern}>Date</th>
                    <th className={styles.thModern}>Transaction ID</th>
                    <th className={styles.thModern}>Type</th>
                    <th className={styles.thModern}>Account</th>
                    <th className={styles.thModern}>Method</th>
                    <th className={styles.thModern}>Total</th>
                    <th className={styles.thModern}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions
                    .filter(
                      (txn) =>
                        !search ||
                        (txn.transactionId || txn._id).toLowerCase().includes(search.toLowerCase())
                    )
                    .map((txn, idx) => {
                      // Find the item in the transaction's items array
                      const itemInTxn = (txn.items || []).find(
                        (i) => String(i._id) === String(item._id)
                      );
                      if (!itemInTxn) return null;
                      // Determine type and sign

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

                      return (
                        <tr key={txn._id || idx}>
                          <td className={styles.tdModern}>{idx + 1}</td>
                          <td className={styles.tdModern}>
                            {txn.date ? new Date(txn.date).toLocaleDateString() : ""}
                          </td>
                          <td className={styles.tdModern}>{txn.transactionId || txn._id}</td>
                          <td className={styles.tdModern}>{type}</td>
                          <td className={styles.tdModern}>{getUserName(account)}</td>
                          <td className={styles.tdModern}>{txn.transactionMethod || ""}</td>
                          <td className={styles.tdModern}>{itemInTxn.count}</td>
                          <td className={styles.tdModern}>{txn.transactionStatus || ""}</td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StockDetails;
