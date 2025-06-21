"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import BranchHeader from "./BranchHeader";
import BranchTable from "./BranchTable";
import PaginationCard from "./PaginationCard";
import BranchForm from "./BranchForm";
import styles from "./Branch.module.css";

const PAGE_SIZE = 20;

const Branch = () => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editBranch, setEditBranch] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

  const fetchData = useCallback(async () => {
    const res = await fetch("/api/branch");
    if (res.ok) {
      const json = await res.json();
      // Ensure data is always an array
      setData(Array.isArray(json) ? json : json?.branch || []);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filtered = useMemo(
    () =>
      Array.isArray(data)
        ? data.filter(
            (branch) =>
              (!type || branch.type === type) &&
              (!search ||
                branch.name?.toLowerCase().includes(search.toLowerCase()) ||
                branch.email?.toLowerCase().includes(search.toLowerCase()))
          )
        : [],
    [data, type, search]
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

  const handleAdd = () => {
    setEditBranch(null);
    setModalOpen(true);
  };
  const handleEdit = () => {
    const branch = data.find((u) => (u._id || data.indexOf(u)) === selectedId);
    setEditBranch(branch);
    setModalOpen(true);
  };
  const handleDelete = async () => {
    const branch = data.find((u) => (u._id || data.indexOf(u)) === selectedId);
    if (!branch) return;
    if (!window.confirm("Delete this branch?")) return;
    await fetch("/api/branch", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ _id: branch._id }),
    });
    setSelectedId(null);
    fetchData();
  };
  const handleSave = async (branch) => {
    if (editBranch && editBranch._id) {
      await fetch("/api/branch", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...branch, _id: editBranch._id }),
      });
    } else {
      await fetch("/api/branch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(branch),
      });
    }
    setModalOpen(false);
    setEditBranch(null);
    setSelectedId(null);
    fetchData();
  };

  return (
    <div className={styles.container}>
      <BranchHeader
        type={type}
        setType={setType}
        search={search}
        setSearch={setSearch}
        onAdd={handleAdd}
      />
      <BranchTable
        paginated={paginated}
        selectedId={selectedId}
        setSelectedId={setSelectedId}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
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
      <BranchForm
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditBranch(null);
        }}
        onSave={handleSave}
        initial={editBranch}
      />
    </div>
  );
};

export default Branch;
