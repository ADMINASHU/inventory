"use client";
import React, { useState } from "react";
import { useEffect, useCallback } from "react";

function TransactionTable({ loggedUser }) {
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState("");
    const [parts, setParts] = useState([]);

  const fetchData = useCallback(async () => {
    if (!loggedUser?.branch) return;
    if (!loggedUser?.sub) return;
    const res = await fetch(`/api/transaction?userId=${loggedUser.sub}`);
    if (res.ok) setTransactions(await res.json());
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);
  const fetchParts = async () => {
    const res = await fetch("/api/list");
    if (res.ok) setParts(await res.json());
  };

  useEffect(() => {
    fetchParts();
  }, []);

  const allItems = transactions.flatMap((tx) =>
    (tx.items || []).map((item) => ({
      ...item,
      adjustedCount: tx.from === loggedUser.sub ? -(item.count || 0) : item.count || 0,
    }))
  );

  // Group by _id and sum adjusted counts
  const idCountMap = {};
  allItems.forEach((item) => {
    const id = item._id ? String(item._id) : "Unknown ID";
    if (!idCountMap[id]) {
      idCountMap[id] = { _id: id, count: 0 };
    }
    idCountMap[id].count += item.adjustedCount;
  });

  // Convert to array and apply search filter
  let idCountArray = Object.values(idCountMap);
  if (search.trim()) {
    idCountArray = idCountArray.filter((item) =>
      item._id.toLowerCase().includes(search.trim().toLowerCase())
    );
  }

  // Pagination
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 10;
  const totalPages = Math.max(1, Math.ceil(idCountArray.length / ITEMS_PER_PAGE));
  const paginatedIdCounts = idCountArray.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  const getPartsName = (id) => {
    const part = parts.find((part) => String(part._id) === id);
    return part ? part.partName : "Unknown Part";
  }
  const getPartsCategory = (id) => {
    const part = parts.find((part) => String(part._id) === id);
    return part ? part.category : "Unknown Category";
  }

  return (
    <div>
      <h2 style={{ marginBottom: "1em" }}>{loggedUser.name}'s Stock List</h2>
      <div style={{ marginBottom: "1em" }}>
        <input
          type="text"
          placeholder="Search _id..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          style={{ padding: "0.5em", width: "250px" }}
        />
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#f5f5f5" }}>
            <th style={{ padding: "8px", border: "1px solid #ddd" }}>S. No</th>
            <th style={{ padding: "8px", border: "1px solid #ddd" }}>Item Name</th>
            <th style={{ padding: "8px", border: "1px solid #ddd" }}>Category</th>
            <th style={{ padding: "8px", border: "1px solid #ddd" }}>Total Count</th>
          </tr>
        </thead>
        <tbody>
          {paginatedIdCounts.length === 0 ? (
            <tr>
              <td colSpan={3} style={{ textAlign: "center", padding: "1em" }}>
                No data found
              </td>
            </tr>
          ) : (
            paginatedIdCounts.map((item, idx) => (
              <tr key={item._id}>
                <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                  {(page - 1) * ITEMS_PER_PAGE + idx + 1}
                </td>
                <td style={{ padding: "8px", border: "1px solid #ddd" }}>{getPartsName(item._id)}</td>
                <td style={{ padding: "8px", border: "1px solid #ddd" }}>{getPartsCategory(item._id)}</td>
                <td style={{ padding: "8px", border: "1px solid #ddd" }}>{item.count}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <div style={{ marginTop: "1em", display: "flex", alignItems: "center" }}>
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          style={{ padding: "0.5em 1em", marginRight: "1em" }}
        >
          Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          style={{ padding: "0.5em 1em", marginLeft: "1em" }}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default TransactionTable;
