"use client";
import React, { useState, useEffect, useMemo } from "react";
import PaginationCard from "./PaginationCard";
import StockHeader from "./StockHeader";
import styles from "./Stock.module.css";
import StockTable from "./StockTable";
const PAGE_SIZE = 20;

function TransactionTable({ loggedUser }) {
  const [stock, setStock] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);

  // Fetch stock data from new API
  useEffect(() => {
    if (!loggedUser?.sub) return;
    fetch(`/api/stock?stock=${loggedUser.sub}`)
      .then((res) => (res.ok ? res.json() : []))
      .then(setStock);
  }, [loggedUser?.sub]);

  // Filter by category and search term
  const filtered = useMemo(
    () =>
      stock.filter(
        (item) =>
          (!category || item.category === category) &&
          (!search || item.partName.toLowerCase().includes(search.toLowerCase()))
      ),
    [stock, category, search]
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
        data={stock}
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
