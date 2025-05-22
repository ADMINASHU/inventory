import React, { useState, useRef } from "react";
import styles from "./Transaction.module.css";
import Doc from "../Doc";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const TransactionTable = ({
  paginated,
  selectedId,
  setSelectedId,
  onEdit,
  onDelete,
  onReceive,
  loggedUser,
  users = [],
}) => {
  // Helper to get user's fName by id
  const getUserName = (id) => {
    const user = users.find((u) => u._id === id);
    return user ? user.fName : id;
  };

  // Modal state for challan
  const [challanTxn, setChallanTxn] = useState(null);
  const [printing, setPrinting] = useState(false);
  const challanRef = useRef(null);

  // PDF download handler using jsPDF and html2canvas
  const handleDownloadPDF = async () => {
    if (!challanRef.current) return;
    setPrinting(true);
    try {
      const canvas = await html2canvas(challanRef.current, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: "a4",
      });
      // Calculate width/height for A4
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save("challan.pdf");
    } catch (err) {
      alert("Failed to generate PDF");
    }
    setPrinting(false);
  };

  return (
    <div className={styles.tableWrapper}>
      {/* Challan Modal */}
      {challanTxn && (
        <div className={styles.modalOverlay} onClick={() => !printing && setChallanTxn(null)}>
          {/* Attach the ref to a plain div INSIDE modalCard, not to modalCard itself */}
          <div
            className={styles.modalCard}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ marginBottom: 12, fontWeight: 600, fontSize: 18, textAlign: "center" }}>
              Challan Preview
            </div>
            <div ref={challanRef}>
              <Doc txn={challanTxn} users={users} />
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
              <button className={styles.addBtn} onClick={handleDownloadPDF} disabled={printing}>
                Download PDF
              </button>
              <button
                className={styles.iconBtn}
                onClick={() => setChallanTxn(null)}
                disabled={printing}
              >
                ❌
              </button>
            </div>
          </div>
        </div>
      )}
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.th}>S No.</th>
            <th className={styles.th}>Date</th>
            <th className={styles.th}>Transaction ID</th>
            <th className={styles.th}>Type</th>
            <th className={styles.th}>Account</th>
            <th className={styles.th}>Method</th>
            <th className={styles.th}>Total</th>
            <th className={styles.th}>Status</th>
            <th className={styles.th}>Items</th>
            <th className={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginated.length === 0 ? (
            <tr>
              <td className={styles.td} colSpan={11} style={{ textAlign: "center" }}>
                No transactions found.
              </td>
            </tr>
          ) : (
            paginated.map((txn, idx) => (
              <tr
                key={txn._id || idx}
                className={selectedId === (txn._id || idx) ? styles.rowSelected : ""}
                onClick={() => setSelectedId(txn._id || idx)}
                style={{ cursor: "pointer" }}
              >
                <td className={styles.td}>{idx + 1}</td>
                <td className={styles.td}>
                  {txn.date ? new Date(txn.date).toLocaleDateString() : ""}
                </td>
                <td className={styles.td}>{txn.transactionId}</td>
                <td className={styles.td}>
                  {txn.from === loggedUser?.sub
                    ? txn.createdBy === loggedUser?.sub
                      ? "SEND"
                      : "SEND*"
                    : txn.createdBy === loggedUser?.sub
                    ? "RECEIVE*"
                    : "RECEIVE"}
                </td>
                <td className={styles.td}>
                  {getUserName(txn.from === loggedUser?.sub ? txn.to : txn.from)}
                </td>
                <td className={styles.td}>{txn.transactionMethod}</td>
                <td className={styles.td}>{txn.total}</td>
                <td className={styles.td}>{txn.transactionStatus}</td>

                <td className={styles.td}>
                  <ul className={styles.itemList}>
                    {txn.items &&
                      txn.items.map((item, i) => (
                        <li key={i}>
                          <span className={styles.itemPartId}>{item._id}</span>
                          {item.partName && (
                            <>
                              {" "}
                              - <span>{item.partName}</span>
                            </>
                          )}
                          {item.category && (
                            <>
                              {" "}
                              (<span>{item.category}</span>)
                            </>
                          )}
                          : <span className={styles.itemCount}>{item.count}</span>
                        </li>
                      ))}
                  </ul>
                </td>
                <td className={styles.td}>
                  {txn.createdBy === loggedUser?.sub ? (
                    <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                      <button
                        className={styles.iconBtn}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit(txn._id || idx);
                        }}
                      >
                        ✏️
                      </button>
                      <button
                        className={styles.iconBtn}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(txn._id || idx);
                        }}
                      >
                        🗑️
                      </button>
                      <button
                        className={styles.iconBtn}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setChallanTxn(txn);
                        }}
                        title="Create Challan"
                      >
                        📄
                      </button>
                    </div>
                  ) : txn.transactionStatus === "IN PROCESS" ? (
                    <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                      <button
                        className={styles.iconBtn}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onReceive(txn._id || idx);
                        }}
                      >
                        ✅
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: "flex", gap: "6px", alignItems: "center" }}> </div>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionTable;
