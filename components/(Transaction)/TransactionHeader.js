import React from "react";
import styles from "./Transaction.module.css";

const TransactionHeader = ({ search, setSearch, onAdd, data = [] }) => {

  console.log(data);
  const userOptions = Array.from(new Set(data.map((item) => item.to)));
  const transactionTypeOptions = Array.from(new Set(data.map((item) => item.transactionType)));
  const monthOptions = Array.from(new Set(data.map((item) => item.month)));
  const yearOptions = Array.from(new Set(data.map((item) => item.year)));
  const userSelectOptions = userOptions.map((user) => (
    <option key={user} value={user}>
      {user}
    </option>
  ));
  const transactionTypeSelectOptions = transactionTypeOptions.map((type) => (
    <option key={type} value={type}>
      {type}
    </option>
  ));
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
          <select className={styles.select}>
            <option value="">All Years</option>
            {yearSelectOptions}
          </select>
          <select className={styles.select}>
            <option value="">All Months</option>
            {monthSelectOptions}
          </select>

          <select className={styles.select}>
            <option value="">All Transaction Types</option>
            {transactionTypeSelectOptions}
          </select>
          <select className={styles.select}>
            <option value="">All Users</option>
            {userSelectOptions}
          </select>

          <input
            type="text"
            placeholder="Search part name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
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
