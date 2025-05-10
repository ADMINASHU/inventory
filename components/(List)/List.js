"use client"
import React, { useState, useEffect } from 'react';
import styles from './List.module.css';

const mockData = [
  { partName: 'Resistor', category: 'Passive', description: '1k Ohm', counts: [{ account: 'Main', count: 100 }] },
  { partName: 'Capacitor', category: 'Passive', description: '10uF', counts: [{ account: 'Main', count: 50 }] },
  { partName: 'Inductor', category: 'Passive', description: '10mH', counts: [{ account: 'Main', count: 30 }] },
  { partName: 'Diode', category: 'Active', description: '1N4007', counts: [{ account: 'Main', count: 200 }] },
  { partName: 'Transistor', category: 'Active', description: 'BC547', counts: [{ account: 'Main', count: 150 }] },
  { partName: 'LED', category: 'Active', description: 'Red 5mm', counts: [{ account: 'Main', count: 300 }] },
  { partName: 'Potentiometer', category: 'Passive', description: '10k', counts: [{ account: 'Main', count: 40 }] },
  { partName: 'Switch', category: 'Active', description: 'Push Button', counts: [{ account: 'Main', count: 60 }] },
  { partName: 'Relay', category: 'Active', description: '5V', counts: [{ account: 'Main', count: 25 }] },
  { partName: 'Fuse', category: 'Passive', description: '1A', counts: [{ account: 'Main', count: 80 }] },
  { partName: 'Crystal Oscillator', category: 'Passive', description: '16MHz', counts: [{ account: 'Main', count: 35 }] },
  { partName: 'IC 555', category: 'Active', description: 'Timer IC', counts: [{ account: 'Main', count: 90 }] },
  { partName: 'IC 7805', category: 'Active', description: 'Voltage Regulator', counts: [{ account: 'Main', count: 70 }] },
  { partName: 'IC 4017', category: 'Active', description: 'Decade Counter', counts: [{ account: 'Main', count: 45 }] },
  { partName: 'IC 7400', category: 'Active', description: 'NAND Gate', counts: [{ account: 'Main', count: 55 }] },
  { partName: 'IC 741', category: 'Active', description: 'Op-Amp', counts: [{ account: 'Main', count: 65 }] },
  { partName: 'IC 4051', category: 'Active', description: 'Multiplexer', counts: [{ account: 'Main', count: 20 }] },
  { partName: 'IC 4093', category: 'Active', description: 'NAND Schmitt', counts: [{ account: 'Main', count: 18 }] },
  { partName: 'IC 4011', category: 'Active', description: 'Quad NAND', counts: [{ account: 'Main', count: 22 }] },
  { partName: 'IC 4040', category: 'Active', description: 'Counter', counts: [{ account: 'Main', count: 17 }] },
  { partName: 'IC 4060', category: 'Active', description: 'Oscillator/Counter', counts: [{ account: 'Main', count: 19 }] },
  { partName: 'IC 4094', category: 'Active', description: 'Shift Register', counts: [{ account: 'Main', count: 13 }] },
  { partName: 'IC 4013', category: 'Active', description: 'Dual D Flip-Flop', counts: [{ account: 'Main', count: 21 }] },
  { partName: 'IC 4027', category: 'Active', description: 'Dual JK Flip-Flop', counts: [{ account: 'Main', count: 16 }] },
  { partName: 'IC 4047', category: 'Active', description: 'Multivibrator', counts: [{ account: 'Main', count: 14 }] },
  { partName: 'IC 4070', category: 'Active', description: 'Quad XOR', counts: [{ account: 'Main', count: 12 }] },
  { partName: 'IC 4081', category: 'Active', description: 'Quad AND', counts: [{ account: 'Main', count: 11 }] },
  { partName: 'IC 4093', category: 'Active', description: 'Quad NAND Schmitt', counts: [{ account: 'Main', count: 10 }] },
  { partName: 'IC 40106', category: 'Active', description: 'Hex Schmitt Trigger', counts: [{ account: 'Main', count: 9 }] },
  { partName: 'IC 4049', category: 'Active', description: 'Hex Inverter', counts: [{ account: 'Main', count: 8 }] },
];

const PAGE_SIZE = 20;

const ListHeader = ({ category, setCategory, search, setSearch, onAdd }) => (
  <div className={styles.card}>
    <div className={styles.header}>
      <div className={styles.filters}>
        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          className={styles.select}
        >
          <option value="">All Categories</option>
          <option value="Passive">Passive</option>
          <option value="Active">Active</option>
          {/* Add more categories as needed */}
        </select>
        <input
          type="text"
          placeholder="Search part name..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className={styles.input}
        />
      </div>
      <button className={styles.addBtn} onClick={onAdd}>
        Add List
      </button>
    </div>
  </div>
);

const ListTable = ({ paginated }) => (
  <div className={styles.card}>
    <table className={styles.table}>
      <thead>
        <tr>
          <th>S No</th>
          <th>Part Name</th>
          <th>Category</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        {paginated.length === 0 ? (
          <tr>
            <td colSpan={5} style={{ textAlign: 'center', padding: 16 }}>No data found.</td>
          </tr>
        ) : paginated.map((item, idx) => (
          <tr key={idx}>
            <td>{idx + 1}</td>
            <td>{item.partName}</td>
            <td>{item.category}</td>
            <td>{item.description}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const PaginationCard = ({ paginated, total, page, setPage, startPage, endPage, pageNumbers, totalPages }) => (
  <div className={styles.card}>
    <div className={styles.pagination}>
      <div className={styles.pageInfo}>
        Showing {paginated.length} of {total} items
      </div>
      <div className={styles.pageBtns}>
        <button
          className={styles.pageBtn}
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >&lt;</button>
        {startPage > 1 && (
          <>
            <button className={styles.pageBtn} onClick={() => setPage(1)}>1</button>
            {startPage > 2 && <span className={styles.ellipsis}>...</span>}
          </>
        )}
        {pageNumbers.map(p => (
          <button
            key={p}
            className={`${styles.pageBtn} ${p === page ? styles.active : ''}`}
            onClick={() => setPage(p)}
          >{p}</button>
        ))}
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className={styles.ellipsis}>...</span>}
            <button className={styles.pageBtn} onClick={() => setPage(totalPages)}>{totalPages}</button>
          </>
        )}
        <button
          className={styles.pageBtn}
          disabled={page === totalPages || totalPages === 0}
          onClick={() => setPage(page + 1)}
        >&gt;</button>
      </div>
    </div>
  </div>
);

const List = () => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);

  // Simulate fetching data
  useEffect(() => {
    // Replace with real fetch logic
    setData(mockData);
  }, []);

  // Filtered and paginated data
  const filtered = data.filter(item =>
    (!category || item.category === category) &&
    (!search || item.partName.toLowerCase().includes(search.toLowerCase()))
  );
  const total = filtered.length;
  const totalPages = Math.ceil(total / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Pagination logic for max 5 page buttons
  let startPage = Math.max(1, page - 2);
  let endPage = Math.min(totalPages, startPage + 4);
  if (endPage - startPage < 4) startPage = Math.max(1, endPage - 4);
  const pageNumbers = [];
  for (let i = startPage; i <= endPage; i++) pageNumbers.push(i);

  const handleAdd = () => {
    // Placeholder for add logic
  };

  return (
    <div className={styles.container}>
      <ListHeader
        category={category}
        setCategory={setCategory}
        search={search}
        setSearch={setSearch}
        onAdd={handleAdd}
      />
      <ListTable paginated={paginated} />
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

export default List