import React from "react";
import styles from "./Transaction.module.css";

const TransactionHeader = ({ searchObj, setSearchObj, onAdd, data = [] }) => {
  const { year, month, search } = searchObj;

  // Update searchObj state
  const setSearch = (key, value) => {
    setSearchObj((prev) => ({ ...prev, [key]: value }));
  };

  // Extract month and year from item.date
  const monthOptions = Array.from(
    new Set(
      data
        .map((item) =>
          item.date ? new Date(item.date).toLocaleString("default", { month: "long" }) : null
        )
        .filter(Boolean)
    )
  );
  const yearOptions = Array.from(
    new Set(
      data.map((item) => (item.date ? new Date(item.date).getFullYear() : null)).filter(Boolean)
    )
  );

  const monthSelectOptions = monthOptions.map((month) => (
    <option key={month} value={month}>
      {month}
    </option>
  ));
  const yearSelectOptions = yearOptions.map((year) => (
    <option key={year} value={year}>
      {year}
    </option>
  ));

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.filters}>
          {/* add here select inputs for user, transactionType, Month, Year */}
          <select
            className={styles.select}
            value={year}
            onChange={(e) => setSearch("year", e.target.value)}
          >
            <option value="">All Years</option>
            {yearSelectOptions}
          </select>
          <select
            className={styles.select}
            value={month}
            onChange={(e) => setSearch("month", e.target.value)}
          >
            <option value="">All Months</option>
            {monthSelectOptions}
          </select>

          <input
            type="text"
            placeholder="Search part name..."
            value={search}
            onChange={(e) => setSearch("search", e.target.value)}
            className={styles.input}
          />
        </div>
        <button className={styles.addBtn} onClick={onAdd}>
          Add Transaction
        </button>
      </div>
    </div>
  );
};
export default TransactionHeader;
