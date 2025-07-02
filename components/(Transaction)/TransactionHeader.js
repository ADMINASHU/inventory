import React from "react";
import styles from "./Transaction.module.css";

const TransactionHeader = ({ searchObj, setSearchObj, onAdd, data = [] }) => {
  const { year, month, search } = searchObj;
    const now = new Date();

  // Update searchObj state
  const setSearch = (key, value) => {
    setSearchObj((prev) => ({ ...prev, [key]: value }));
  };

  // Month options: all months (Jan-Dec)
  const monthOptions = Array.from({ length: 12 }, (_, i) =>
    new Date(2000, i, 1).toLocaleString("default", { month: "long" })
  );
  // Year options: current year and next 4 years
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 5 }, (_, i) => (currentYear + i).toString());

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
            placeholder="Search Transaction ID"
            value={search}
            onChange={(e) => {
              // If search is present, clear year and month
              setSearchObj((prev) => ({
                ...prev,
                search: e.target.value,
                ...(e.target.value
                  ? { year: "", month: "" }
                  : {
                      year: now.getFullYear().toString(),
                      month: now.toLocaleString("default", { month: "long" }),
                    }),
              }));
            }}
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

