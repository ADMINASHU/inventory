import React from "react";
import { useRouter } from "next/navigation";
import styles from "./Stock.module.css";

const StockTable = ({ paginated, PAGE_SIZE, page }) => {
  const router = useRouter();

  const handleRowDoubleClick = (id) => {
    router.push(`/stock/${id}`);
  };

  return (
    <div className={styles.card}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>S No</th>
            <th>Category</th>
            <th>Part Name</th>
            <th>Description</th>
            <th>Total Stock</th>
          </tr>
        </thead>
        <tbody>
          {paginated.length === 0 ? (
            <tr>
              <td colSpan={5} style={{ textAlign: "center", padding: 16 }}>
                No data found.
              </td>
            </tr>
          ) : (
            paginated.map((item, idx) => {
              const rowId = item._id || idx;
              return (
                <tr
                  key={rowId}
                  style={{
                    position: "relative",

                    cursor: "pointer",
                  }}
                  onDoubleClick={() => handleRowDoubleClick(item._id)}
                >
                  <td> {(page - 1) * PAGE_SIZE + idx + 1}</td>
                  <td>{item.category}</td>
                  <td>{item.partName}</td>
                  <td style={{ position: "relative" }}>{item.description}</td>
                  <td>{item.count}</td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default StockTable;
