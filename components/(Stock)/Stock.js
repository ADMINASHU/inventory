"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import PaginationCard from "./PaginationCard";
import StockHeader from "./StockHeader";
import styles from "./Stock.module.css";
import StockTable from "./StockTable";
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
  const getPartsDescription = (id) => {
    const part = parts.find((part) => String(part._id) === id);
    return part ? part.description : "Unknown Description";
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
    idCountMap[id].description = getPartsDescription(id);
  });

  // Convert to array and apply search filter
  let idCountArray = Object.values(idCountMap);

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
    <div className={styles.container}>
      <StockHeader
        category={category}
        setCategory={setCategory}
        search={search}
        setSearch={setSearch}
      />
      <StockTable paginated={paginated} PAGE_SIZE={PAGE_SIZE} page={page} />
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
