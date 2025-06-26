"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import TransactionHeader from "./TransactionHeader";
import TransactionTable from "./TransactionTable";
import PaginationCard from "./PaginationCard";
import TransactionForm from "./TransactionForm";
import styles from "./Transaction.module.css";

const PAGE_SIZE = 10;

const Transaction = ({ loggedUser }) => {
  const [stock, setStock] = useState([]);
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [parts, setParts] = useState([]);
  const [users, setUsers] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [branches, setBranches] = useState([]);
  const now = new Date();
  const [searchObj, setSearchObj] = useState({
    year: now.getFullYear().toString(),
    month: now.toLocaleString("default", { month: "long" }),
    search: "",
  });
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  // const [receivedOpen, setReceivedOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

  const fetchData = useCallback(async () => {
    if (!loggedUser?.branch) return;
    if (!loggedUser?.sub) return;
    // Build query string for filters and pagination
    const params = new URLSearchParams({
      userId: loggedUser.sub,
      page: page.toString(),
      pageSize: PAGE_SIZE.toString(),
      year: searchObj.year || "",
      month: searchObj.month || "",
      type: searchObj.type || "",
      user: searchObj.user || "",
      search: searchObj.search || "",
      category: category || "",
    });
    const res = await fetch(`/api/transaction?${params.toString()}`);
    if (res.ok) {
      const json = await res.json();
      setData(json.items || []);
      setTotal(json.total || 0);
    }
  }, [loggedUser?.branch, loggedUser?.sub, page, PAGE_SIZE, searchObj, category]);

  useEffect(() => {
    if (!loggedUser?.sub) return;
    fetch(`/api/stock?stock=${loggedUser.sub}`)
      .then((res) => (res.ok ? res.json() : []))
      .then(setStock);
  }, [loggedUser?.sub]);

  const fetchParts = useCallback(async () => {
    const res = await fetch("/api/list");
    if (res.ok) setParts(await res.json());
  }, []);

  const fetchUsers = useCallback(async () => {
    const res = await fetch("/api/users");
    if (res.ok) setUsers(await res.json());
  }, []);
  const fetchBranches = useCallback(async () => {
    const res = await fetch("/api/branch");
    if (res.ok) setBranches(await res.json());
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
    fetchBranches();
  }, [fetchBranches]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  // Remove client-side filtering and slicing, use server data directly
  const paginated = data;
  const totalPages = Math.ceil(total / PAGE_SIZE);

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
        body: JSON.stringify({ ...obj, _id: editItem._id }),
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
        searchObj={searchObj}
        setSearchObj={setSearchObj}
        onAdd={handleAdd}
        data={data}
        users={users}
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
        branches={branches}
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
        stock={stock}
        loggedUser={loggedUser}
      />
    </div>
  );
};

export default Transaction;

