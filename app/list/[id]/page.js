"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "@/components/(List)/List.module.css";

const ListDetailsPage = (props) => {
  // Unwrap params using React.use() for future compatibility
  const { id } = React.use(props.params);
  const router = useRouter();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    let ignore = false;
    setLoading(true);
    fetch(`/api/list?id=${id}`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (!ignore) setItem(data);
        setLoading(false);
      });
    return () => { ignore = true; };
  }, [id]);

  if (loading) return <div className={styles.card}>Loading...</div>;
  if (!item) return <div className={styles.card}>Not found.</div>;

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <button
          className={styles.pageBtn}
          onClick={() => router.push("/list")}
          style={{ marginBottom: 12 }}
        >
          Back to List
        </button>
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
          Created: {item.createdAt ? new Date(item.createdAt).toLocaleString() : "-"}<br />
          Updated: {item.updatedAt ? new Date(item.updatedAt).toLocaleString() : "-"}
        </div>
      </div>
    </div>
  );
};

export default ListDetailsPage;
