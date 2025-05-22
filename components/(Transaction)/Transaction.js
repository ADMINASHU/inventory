"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import TransactionHeader from "./TransactionHeader";
import TransactionTable from "./TransactionTable";
import PaginationCard from "./PaginationCard";
import TransactionForm from "./TransactionForm";
import styles from "./Transaction.module.css";


const PAGE_SIZE = 20;

const Transaction = ({ loggedUser }) => {
  const [data, setData] = useState([]);
  const [parts, setParts] = useState([]);
  const [users, setUsers] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  // const [receivedOpen, setReceivedOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

  const fetchData = useCallback(async () => {
    if (!loggedUser?.branch) return;
    if (!loggedUser?.sub) return;
    const res = await fetch(`/api/transaction?userId=${loggedUser.sub}`);
    if (res.ok) setData(await res.json());
  }, []);

  const fetchParts = useCallback(async () => {
    const res = await fetch("/api/list");
    if (res.ok) setParts(await res.json());
  }, []);

  const fetchUsers = useCallback(async () => {
    const res = await fetch("/api/users");
    if (res.ok) setUsers(await res.json());
  }, []);

  const fetchCustomers = useCallback(async () => {
    const res = await fetch("/api/customers");
    if (res.ok) setCustomers(await res.json());
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    fetchParts();
  }, [fetchParts]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const filtered = useMemo(
    () =>
      data.filter(
        (item) =>
          (!category || item.category === category) &&
          (!search || item.partName.toLowerCase().includes(search.toLowerCase()))
      ),
    [data, category, search]
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
    setEditItem(null);
    setModalOpen(true);
  };
  const handleEdit = (id) => {
    setSelectedId(id);
    const item = data.find((i) => (i._id || data.indexOf(i)) === id);
    setEditItem(item);
    setModalOpen(true);
  };
  const handleReceive = async (id) => {
    setSelectedId(id);
    const item = data.find((i) => (i._id || data.indexOf(i)) === id);
    setEditItem({ ...item, transactionStatus: "RECEIVED" });

    const res = await fetch("/api/transaction", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...item, transactionStatus: "RECEIVED" }),
    });
    if (res.ok) {
      setTimeout(() => {
        fetchData();
      }, 2000);
    }
  };
  const handleDelete = async (id) => {
    setSelectedId(id);
    const item = data.find((i) => (i._id || data.indexOf(i)) === id);
    if (!item) return;
    if (!window.confirm("Delete this part?")) return;
    await fetch("/api/transaction", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ _id: item._id }),
    });
    setSelectedId(null);
    fetchData();
  };
  const handleSave = async (obj) => {
    if (editItem && editItem._id) {
      await fetch("/api/transaction", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...obj, _id: editItem._id}),
      });
    } else {
      await fetch("/api/transaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(obj),
      });
    }
    setModalOpen(false);
    setEditItem(null);
    setSelectedId(null);
    fetchData();
  };

  return (
    <div className={styles.container}>
      <TransactionHeader
        category={category}
        setCategory={setCategory}
        search={search}
        setSearch={setSearch}
        onAdd={handleAdd}
      />
      <TransactionTable
        paginated={paginated}
        selectedId={selectedId}
        setSelectedId={setSelectedId}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onReceive={handleReceive}
        loggedUser={loggedUser}
        users={users}
        customers={customers}
        parts={parts}
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
      <TransactionForm
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditItem(null);
        }}
        onSave={handleSave}
        initial={editItem}
        parts={parts}
        users={users}
        customers={customers}
        loggedUser={loggedUser}
      />
    </div>
  );
};

export default Transaction;
