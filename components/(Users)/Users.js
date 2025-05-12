"use client"
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import UsersHeader from './UsersHeader';
import UsersTable from './UsersTable';
import PaginationCard from '../(List)/PaginationCard';
import UserForm from './UserForm';
import styles from './Users.module.css';

const PAGE_SIZE = 20;

const Users = () => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

  const fetchData = useCallback(async () => {
    const res = await fetch('/api/users');
    if (res.ok) {
      const json = await res.json();
      // Ensure data is always an array
      setData(Array.isArray(json) ? json : (json?.users || []));
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const filtered = useMemo(() =>
    Array.isArray(data)
      ? data.filter(user =>
          (!role || user.role === role) &&
          (!search ||
            (`${user.fName || ""} ${user.eName || ""}`.toLowerCase().includes(search.toLowerCase()) ||
            user.email?.toLowerCase().includes(search.toLowerCase()))
          )
        )
      : [],
    [data, role, search]
  );
  const total = filtered.length;
  const totalPages = Math.ceil(total / PAGE_SIZE);
  const paginated = useMemo(() =>
    filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filtered, page]
  );

  // Pagination logic for max 5 page buttons
  let startPage = Math.max(1, page - 2);
  let endPage = Math.min(totalPages, startPage + 4);
  if (endPage - startPage < 4) startPage = Math.max(1, endPage - 4);
  const pageNumbers = [];
  for (let i = startPage; i <= endPage; i++) pageNumbers.push(i);

  const handleAdd = () => { setEditUser(null); setModalOpen(true); };
  const handleEdit = () => {
    const user = data.find(u => (u._id || data.indexOf(u)) === selectedId);
    setEditUser(user); setModalOpen(true);
  };
  const handleDelete = async () => {
    const user = data.find(u => (u._id || data.indexOf(u)) === selectedId);
    if (!user) return;
    if (!window.confirm('Delete this user?')) return;
    await fetch('/api/users', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ _id: user._id }),
    });
    setSelectedId(null);
    fetchData();
  };
  const handleSave = async (user) => {
    if (editUser && editUser._id) {
      await fetch('/api/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...user, _id: editUser._id }),
      });
    } else {
      await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      });
    }
    setModalOpen(false);
    setEditUser(null);
    setSelectedId(null);
    fetchData();
  };

  return (
    <div className={styles.container}>
      <UsersHeader
        role={role}
        setRole={setRole}
        search={search}
        setSearch={setSearch}
        onAdd={handleAdd}
      />
      <UsersTable
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
      <UserForm
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditUser(null); }}
        onSave={handleSave}
        initial={editUser}
      />
    </div>
  );
}

export default Users;
