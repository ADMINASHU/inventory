"use client"
import React, { useEffect, useState } from "react";
import styles from "./Transaction.module.css";

const TransactionDetails = ({ id, onBack }) => {
  const [item, setItem] = useState(null);

  useEffect(() => {
    if (!id) return;
    let ignore = false;
    const fetchItem = async () => {
      const res = await fetch(`/api/transaction?id=${id}`);
      if (res.ok) {
        const data = await res.json();
        if (!ignore) setItem(Array.isArray(data) ? data[0] : data);
      }
    };
    fetchItem();
    return () => { ignore = true; };
  }, [id]);

  if (!id) return null;
  if (!item) return <div className={styles.card}>Loading...</div>;

  return (
    <div className={styles.card}>
      <button className={styles.pageBtn} onClick={onBack} style={{ marginBottom: 12 }}>Back</button>
      <h2 style={{ marginBottom: 8 }}>{item.partName}</h2>
      <div><b>Category:</b> {item.category}</div>
      <div><b>Description:</b> {item.description}</div>
      <div style={{ marginTop: 8 }}>
        <b>Counts:</b>
        <ul>
          {item.counts?.map((c, i) => (
            <li key={i}>
              <b>{c.account}:</b> {c.count}
            </li>
          ))}
        </ul>
      </div>
      <div style={{ fontSize: 13, color: "#888", marginTop: 12 }}>
        Created: {new Date(item.createdAt).toLocaleString()}<br />
        Updated: {new Date(item.updatedAt).toLocaleString()}
      </div>
    </div>
  );
};

export default TransactionDetails;
