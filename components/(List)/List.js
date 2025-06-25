"use client"
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import ListHeader from './ListHeader';
import ListTable from './ListTable';
import PaginationCard from './PaginationCard';
import ListForm from './ListForm';
import styles from './List.module.css';

const PAGE_SIZE = 20;

const List = () => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

  const fetchData = useCallback(async () => {
    const res = await fetch('/api/list');
    if (res.ok) setData(await res.json());
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const filtered = useMemo(() =>
    data.filter(item =>
      (!category || item.category === category) &&
      (!search || item.partName.toLowerCase().includes(search.toLowerCase()))
    ), [data, category, search]
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

  const handleAdd = () => { setEditItem(null); setModalOpen(true); };
  const handleEdit = () => {
    const item = data.find(i => (i._id || data.indexOf(i)) === selectedId);
    setEditItem(item); setModalOpen(true);
  };
  const handleDelete = async () => {
    const item = data.find(i => (i._id || data.indexOf(i)) === selectedId);
    if (!item) return;
    if (!window.confirm('Delete this part?')) return;
    await fetch('/api/list', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ _id: item._id }),
    });
    setSelectedId(null);
    fetchData();
  };
  const handleSave = async (item) => {
    if (editItem && editItem._id) {
      await fetch('/api/list', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...item, _id: editItem._id }),
      });
    } else {
      await fetch('/api/list', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
    }
    setModalOpen(false);
    setEditItem(null);
    setSelectedId(null);
    fetchData();
  };

  return (
    <div className={styles.container}>
      <ListHeader
        category={category}
        setCategory={setCategory}
        search={search}
        setSearch={setSearch}
        onAdd={handleAdd}
        data={data}
      />
      <ListTable
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
      <ListForm
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditItem(null); }}
        onSave={handleSave}
        initial={editItem}
        data={data}
      />
    </div>
  );
}

export default List