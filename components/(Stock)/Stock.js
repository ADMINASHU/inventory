"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import PaginationCard from "./PaginationCard";
import StockHeader from "./StockHeader";
import styles from "./Stock.module.css";
const PAGE_SIZE = 20;

function TransactionTable({ loggedUser }) {
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [parts, setParts] = useState([]);

  const getPartsName = (id) => {
    const part = parts.find((part) => String(part._id) === id);
    return part ? part.partName : "Unknown Part";
  };
  const getPartsCategory = (id) => {
    const part = parts.find((part) => String(part._id) === id);
    return part ? part.category : "Unknown Category";
  };

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
    idCountMap[id].partName = getPartsName(id);
    idCountMap[id].category = getPartsCategory(id);
  });

  // Convert to array and apply search filter
  let idCountArray = Object.values(idCountMap);

  console.log(idCountArray);
  // Filter by category and search term
  const filtered = useMemo(
    () =>
      idCountArray.filter(
        (item) =>
          (!category || item.category === category) &&
          (!search || item.partName.toLowerCase().includes(search.toLowerCase()))
      ),
    [idCountArray, category, search]
  );
  const total = filtered.length;
  const totalPages = Math.ceil(total / PAGE_SIZE);
  const paginated = useMemo(
    () => filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filtered, page]
  );

  // Pagination logic for max 5 page buttons
  let startPage = Math.max(1, page - 2);
  let endPage = Math.min(totalPages, startPage + 4);
  if (endPage - startPage < 4) startPage = Math.max(1, endPage - 4);
  const pageNumbers = [];
  for (let i = startPage; i <= endPage; i++) pageNumbers.push(i);

  return (
    <div>
      <StockHeader
        category={category}
        setCategory={setCategory}
        search={search}
        setSearch={setSearch}
      />
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
          {paginated.length === 0 ? (
            <tr>
              <td colSpan={3} style={{ textAlign: "center", padding: "1em" }}>
                No data found
              </td>
            </tr>
          ) : (
            paginated.map((item, idx) => (
              <tr key={item._id}>
                <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                  {(page - 1) * PAGE_SIZE + idx + 1}
                </td>
                <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                  {item.partName}
                </td>
                <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                  {item.category}
                </td>
                <td style={{ padding: "8px", border: "1px solid #ddd" }}>{item.count}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <PaginationCard
        paginated={paginated}
        total={total}
        page={page}
        setPage={setPage}
        startPage={startPage}
        endPage={endPage}
        pageNumbers={pageNumbers}
        totalPages={totalPages}
      />
    </div>
  );
}

export default TransactionTable;
