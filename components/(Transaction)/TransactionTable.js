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
  customers = [],
  parts = [],
}) => {
  // Helper to get user's fName by id
  const getUserName = (id) => {
    const user = users.find((u) => u._id === id);
    const customer = customers.find((c) => c._id === id);
    return user ? user.fName : customer ? customer.name : id;
  };

  const getItemName = (id) => {
    const item = parts.find((i) => i._id === id);
    return item ? item.partName : id;
  };
  const getItemCategory = (id) => {
    const item = parts.find((i) => i._id === id);
    return item ? item.category : id;
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
      // A4 size in pt: 595.28 x 841.89, 1cm = 28.35pt, so margins = 28.35pt
      const margin = 28.35; // 1cm in pt
      const pdfWidth = 595.28;
      const pdfHeight = 841.89;
      const contentWidth = pdfWidth - 2 * margin;

      // Render the DOM node to canvas
      const canvas = await html2canvas(challanRef.current, { scale: 2, backgroundColor: "#fff" });
      const imgData = canvas.toDataURL("image/png");

      // Calculate image dimensions to fit page width (ignore vertical centering)
      let imgWidth = contentWidth;
      let imgHeight = (canvas.height * imgWidth) / canvas.width;

      // If the image is too tall, scale it down to fit the page height minus top and bottom margin
      const maxImgHeight = pdfHeight - 2 * margin;
      if (imgHeight > maxImgHeight) {
        imgHeight = maxImgHeight;
        imgWidth = (canvas.width * imgHeight) / canvas.height;
      }

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: "a4",
      });

      // Place image at (left margin, top margin) -- aligns to top, not centered
      pdf.addImage(imgData, "PNG", margin, margin, imgWidth, imgHeight);

      // Add a line above the footer text
      const now = new Date();
      const timestamp = now.toLocaleString();
      const pageWidth = pdf.internal.pageSize.getWidth();
      const y = pdf.internal.pageSize.getHeight() - margin; // 1cm from bottom

      // Draw a horizontal line (100% width)
      pdf.setDrawColor(120, 120, 120);
      pdf.setLineWidth(0.5);
      pdf.line(margin, y - 14, pageWidth - margin, y - 14);

      // Footer text, center aligned
      const footerText = `This is a computer-generated challan printed at :${timestamp}.`;
      pdf.setFontSize(10);
      pdf.setTextColor(120, 120, 120);
      const lines = footerText.split("\n");
      lines.forEach((line, i) => {
        const textWidth = pdf.getTextWidth(line);
        const x = (pageWidth - textWidth) / 2;
        pdf.text(line, x, y + i * 12); // 12pt line height
      });

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
          <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
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
                          <span>
                            <>
                              {getItemName(item._id)}{" "} : <span className={styles.itemCount}>{item.count}</span>
                              <br />(<span>{getItemCategory(item._id)}</span>)
                            </>
                          </span>
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
