"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import CustomersHeader from "./CustomersHeader";
import CustomersTable from "./CustomersTable";
import PaginationCard from "../(List)/PaginationCard";
import CustomerForm from "./CustomersForm";
import styles from "./Customers.module.css";

const PAGE_SIZE = 20;

const Customers = () => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editCustomer, setEditCustomer] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

  const fetchData = useCallback(async () => {
    const res = await fetch("/api/customers");
    if (res.ok) {
      const json = await res.json();
      // Ensure data is always an array
      setData(Array.isArray(json) ? json : json?.customers || []);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filtered = useMemo(
    () =>
      Array.isArray(data)
        ? data.filter(
            (customer) =>
              (!type || customer.type === type) &&
              (!search ||
                customer.name?.toLowerCase().includes(search.toLowerCase()) ||
                customer.email?.toLowerCase().includes(search.toLowerCase()))
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
    setEditCustomer(null);
    setModalOpen(true);
  };
  const handleEdit = () => {
    const customer = data.find((u) => (u._id || data.indexOf(u)) === selectedId);
    setEditCustomer(customer);
    setModalOpen(true);
  };
  const handleDelete = async () => {
    const customer = data.find((u) => (u._id || data.indexOf(u)) === selectedId);
    if (!customer) return;
    if (!window.confirm("Delete this customer?")) return;
    await fetch("/api/customers", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ _id: customer._id }),
    });
    setSelectedId(null);
    fetchData();
  };
  const handleSave = async (customer) => {
    if (editCustomer && editCustomer._id) {
      await fetch("/api/customers", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...customer, _id: editCustomer._id }),
      });
    } else {
      await fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(customer),
      });
    }
    setModalOpen(false);
    setEditCustomer(null);
    setSelectedId(null);
    fetchData();
  };

  return (
    <div className={styles.container}>
      <CustomersHeader
        type={type}
        setType={setType}
        search={search}
        setSearch={setSearch}
        onAdd={handleAdd}
      />
      <CustomersTable
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
      <CustomerForm
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditCustomer(null);
        }}
        onSave={handleSave}
        initial={editCustomer}
      />
    </div>
  );
};

export default Customers;
