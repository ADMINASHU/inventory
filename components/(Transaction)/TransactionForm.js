import React, { useState, useEffect, useMemo } from "react";
import styles from "./Transaction.module.css";

// Floating label input component
function FloatingLabelInput({
  label,
  value,
  onChange,
  type = "text",
  required,
  ...props
}) {
  return (
    <div className={styles.floatingInputWrapper}>
      <input
        className={styles.floatingInput}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        autoComplete="off"
        {...props}
      />
      <label
        className={`${styles.floatingLabel} ${
          value ? styles.floatingLabelActive : ""
        }`}
      >
        {label}
      </label>
    </div>
  );
}

function FloatingLabelTextarea({ label, value, onChange, required, ...props }) {
  return (
    <div className={styles.floatingInputWrapper}>
      <textarea
        className={styles.floatingInput}
        value={value}
        onChange={onChange}
        required={required}
        rows={2}
        {...props}
      />
      <label
        className={`${styles.floatingLabel} ${
          value ? styles.floatingLabelActive : ""
        }`}
      >
        {label}
      </label>
    </div>
  );
}

const emptyItem = { _id: "", count: 0, partName: "", category: "" };
const emptyAttachment = { name: "", type: "", id: 0 };

const TransactionForm = ({
  open,
  onClose,
  onSave,
  initial,
  parts = [],
  users = [],
  customers = [],
  stock = [],
  loggedUser,
}) => {
  const [date, setDate] = useState("");
  const [items, setItems] = useState([{ ...emptyItem }]);
  const [total, setTotal] = useState(0);
  const [transactionMethod, setTransactionMethod] = useState("");
  const [transactionType, setTransactionType] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [createdBy, setCreatedBy] = useState("");
  const [note, setNote] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [isDeleted, setIsDeleted] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [approvedBy, setApprovedBy] = useState("");
  const [approvedAt, setApprovedAt] = useState("");
  const [updateHistory, setUpdateHistory] = useState([]);

  // Dynamically get categories for each item row (in case parts list changes)
  const getCategories = useMemo(
    () => Array.from(new Set(parts.map((p) => p.category).filter(Boolean))),
    [parts]
  );

  // Helper to get part names for a category
  const getPartNamesByCategory = (category) =>
    parts.filter((p) => p.category === category).map((p) => p.partName);

  // Helper to get partId by category and partName
  const getPartId = (category, partName) => {
    const found = parts.find(
      (p) => p.category === category && p.partName === partName
    );
    return found ? found._id : "";
  };

  // Helper to get available "To" users (exclude selected "From")
  const availableToUsers = useMemo(
    () => [
      ...users.filter((u) => u._id !== from ),
      ...customers.filter((c) => c._id !== from )
    ],
    [users, customers, from]
  );
  const availableFromUsers = useMemo(
    () => [
      ...users.filter(
        (u) => (u._id !== to && u.type === "STORE") || u.isSecure === false
      ),
      ...customers.filter((c) => c._id !== to )
    ],
    [users, customers, to]
  );

  // Prevent selecting same user in both fields
  useEffect(() => {
    if (from && from === to) {
      setTo("");
    }
  }, [from, to]);

  useEffect(() => {
    if (open && initial) {
      setDate(initial.date ? initial.date.slice(0, 10) : "");
      // Populate category and partName from partId (_id) for each item
      setItems(
        initial.items && initial.items.length > 0
          ? initial.items.map((item) => {
              if (item.partId || item._id) {
                const part = parts.find(
                  (p) => p._id === (item.partId || item._id)
                );
                return {
                  ...item,
                  partId: item.partId || item._id || "",
                  category: part ? part.category : item.category || "",
                  partName: part ? part.partName : item.partName || "",
                };
              }
              return { ...emptyItem };
            })
          : [{ ...emptyItem }]
      );
      setTransactionMethod(initial.transactionMethod || "");
      setTransactionType(initial.transactionType || "");
      setFrom(initial.from || "");
      setTo(initial.to || "");
      setCreatedBy(initial.createdBy || "");
      setNote(initial.note || "");
      setAttachments(
        initial.attachment && initial.attachment.length > 0
          ? initial.attachment
          : []
      );
      setIsDeleted(initial.isDeleted || false);
      setIsApproved(initial.isApproved || false);
      setApprovedBy(initial.approvedBy || "");
      setApprovedAt(initial.approvedAt ? initial.approvedAt.slice(0, 16) : "");
      setUpdateHistory(initial.updateHistory || []);
    } else if (open) {
      setDate(new Date().toISOString().slice(0, 10));
      setItems([{ ...emptyItem }]);
      setTransactionMethod("");
      setTransactionType("SEND");
      setFrom("");
      setTo("");
      setCreatedBy(loggedUser?.sub || "");
      setNote("");
      setAttachments([]);
      setIsDeleted(false);
      setIsApproved(false);
      setApprovedBy("");
      setApprovedAt("");
      setUpdateHistory([]);
    }
  }, [open, initial, parts]);

  useEffect(() => {
    if (open) {
      setFrom(transactionType === "SEND" ? loggedUser?.sub : "");
      setTo(transactionType === "RECEIVED" ? loggedUser?.sub : "");
    }
  }, [transactionType]);

  // Update total automatically when items change
  useEffect(() => {
    setTotal(items.reduce((sum, item) => sum + (Number(item.count) || 0), 0));
  }, [items]);

  const handleItemChange = (idx, field, value) => {
    setItems((items) => {
      return items.map((item, i) => {
        if (i !== idx) return item;
        let newItem = { ...item, [field]: value };
        // Always recalculate partId if category or partName changes
        if (field === "category") {
          newItem.partName = "";
          newItem.partId = "";
        }
        if (field === "category" || field === "partName") {
          const partId = getPartId(
            field === "category" ? value : newItem.category,
            field === "partName" ? value : newItem.partName
          );
          newItem._id = partId || "";
        }
        return newItem;
      });
    });
  };

  const handleAddItem = () => setItems((items) => [...items, { ...emptyItem }]);
  const handleRemoveItem = (idx) =>
    setItems((items) => items.filter((_, i) => i !== idx));

  const handleAttachmentChange = (idx, field, value) => {
    setAttachments((attachments) =>
      attachments.map((att, i) =>
        i === idx ? { ...att, [field]: value } : att
      )
    );
  };

  const handleAddAttachment = () =>
    setAttachments((atts) => [...atts, { ...emptyAttachment }]);
  const handleRemoveAttachment = (idx) =>
    setAttachments((atts) => atts.filter((_, i) => i !== idx));

  // Helper to get available stock for a part (by _id)
  const getAvailableStock = (partId) => {
    const part = stock.find((s) => s._id === partId);
    return part ? part.count : 0;
  };

  if (!open) return null;
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalCard}>
        <h3 className={styles.formTitle}>
          {initial ? "Edit" : "Add"} Transaction
        </h3>
        <form
          className={styles.form}
          onSubmit={(e) => {
            e.preventDefault();
            onSave({
              branch: loggedUser?.branch || "",
              date,
              items,
              total,
              transactionMethod,
              transactionType,
              from,
              to,
              createdBy,
              note,
              attachment: attachments,
              isDeleted,
              isApproved,
              approvedBy,
              approvedAt: approvedAt ? new Date(approvedAt) : null,
              // updateHistory is not sent from form, it's backend managed
            });
          }}
        >
          <div className={styles.section}>
            <div className={styles.sectionTitle}>Transaction Info</div>
            <div className={styles.grid2col}>
              <FloatingLabelInput
                label="Date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                placeholder="" // Ensure no placeholder for date
              />
              <FloatingLabelInput
                label="Transaction Method"
                value={transactionMethod}
                onChange={(e) => setTransactionMethod(e.target.value)}
                required
              />
              {/* Transaction Type dropdown */}
              <div className={styles.floatingInputWrapper}>
                <select
                  className={styles.floatingInput}
                  value={transactionType}
                  onChange={(e) => setTransactionType(e.target.value)}
                  required
                >
                  <option value="">Select Transaction Type</option>
                  <option value="SEND">SEND</option>
                  <option value="RECEIVED">RECEIVED</option>
                </select>
                <label
                  className={`${styles.floatingLabel} ${
                    transactionType ? styles.floatingLabelActive : ""
                  }`}
                >
                  Transaction Type
                </label>
              </div>
              {/* To dropdown */}
              {transactionType === "RECEIVED" && (
                <div className={styles.floatingInputWrapper}>
                  <select
                    className={styles.floatingInput}
                    value={from}
                    onChange={(e) => setFrom(e.target.value)}
                    required
                    // disabled={!from}
                  >
                    <option value="">Select From User</option>
                    {availableFromUsers.map((u) => (
                      <option key={u._id} value={u._id}>
                        {u.fName || u.name}
                      </option>
                    ))}
                  </select>
                  <label
                    className={`${styles.floatingLabel} ${styles.floatingLabelActive}`}
                  >
                    From
                  </label>
                </div>
              )}
              {transactionType === "SEND" && (
                <div className={styles.floatingInputWrapper}>
                  <select
                    className={styles.floatingInput}
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    required
                    // disabled={!from}
                  >
                    <option value="">Select To User</option>
                    {availableToUsers.map((u) => (
                      <option key={u._id} value={u._id}>
                        {u.fName || u.name}
                      </option>
                    ))}
                  </select>
                  <label
                    className={`${styles.floatingLabel} ${styles.floatingLabelActive}`}
                  >
                    To
                  </label>
                </div>
              )}
            </div>
            <FloatingLabelTextarea
              label="Note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          <div className={styles.section}>
            <div className={styles.sectionTitleRow}>
              <div
                className={styles.sectionTitle}
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                Items
                <button
                  className={styles.iconBtn}
                  type="button"
                  onClick={handleAddItem}
                  title="Add item"
                >
                  +
                </button>
              </div>
              <div className={styles.totalInline}>Total: {total}</div>
            </div>
            <div className={styles.itemListView}>
              <div className={styles.itemListHeader}>
                <span>Category</span>
                <span>Part Name</span>
                {/* <span>Part ID</span> */}
                <span>Count</span>
                <span style={{ minWidth: 60 }}></span>
              </div>
              {items.map((item, idx) => (
                <div key={idx} className={styles.itemListRow}>
                  {/* Dynamic Category dropdown */}
                  <select
                    className={styles.input}
                    value={item.category || ""}
                    onChange={(e) =>
                      handleItemChange(idx, "category", e.target.value)
                    }
                    required
                  >
                    <option value="">Select Category</option>
                    {getCategories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  {/* Part Name dropdown */}
                  <select
                    className={styles.input}
                    value={item.partName || ""}
                    onChange={(e) =>
                      handleItemChange(idx, "partName", e.target.value)
                    }
                    required
                    disabled={!item.category}
                  >
                    <option value="">Select Part Name</option>
                    {item.category &&
                      getPartNamesByCategory(item.category).map((name) => (
                        <option key={name} value={name}>
                          {name}
                        </option>
                      ))}
                  </select>
                  {/* Count */}
                  <input
                    className={styles.input}
                    type="number"
                    min={0}
                    value={item.count ?? 0}
                    disabled={!item.partName}
                    onChange={(e) =>
                      handleItemChange(idx, "count", Number(e.target.value))
                    }
                    required
                  />
                  <div style={{ display: "flex", gap: 4 }}>
                    {items.length > 1 && (
                      <button
                        className={styles.iconBtn}
                        type="button"
                        onClick={() => handleRemoveItem(idx)}
                        title="Remove item"
                      >
                        &minus;
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {items.map((item, idx) => (
                // Show available stock only if partName is selected and count is not yet entered
                // (i.e., item.count is empty, null, or zero string, but not a valid number > 0)
                // Hide after count is entered (i.e., item.count is a valid number > 0)
                item.category && item.partName && (item.count === 0 || item.count === null || item.count === undefined || item.count > getAvailableStock(item._id))  && (
                  <div key={idx} className={styles.availableStockRow} style={{ color: "#888", fontSize: "0.95em", marginBottom: 4, marginLeft: 2 }}>
                    Available stock: {getAvailableStock(item._id)}
                  </div>
                )
              ))}
            </div>
          </div>

          <div className={styles.section}>
            <div
              className={styles.sectionTitle}
              style={{ display: "flex", alignItems: "center", gap: "8px" }}
            >
              Attachments
              <button
                className={styles.iconBtn}
                type="button"
                onClick={handleAddAttachment}
                title="Add attachment"
              >
                +
              </button>
            </div>

            <div className={styles.itemListView}>
              <div className={styles.itemListHeader}>
                <span>Name</span>
                <span>Type</span>
                <span>ID</span>
                <span style={{ minWidth: 60 }}></span>
              </div>
              {(attachments.length === 0 ? [emptyAttachment] : attachments).map(
                (att, idx) => (
                  <div key={idx} className={styles.itemListRow}>
                    <input
                      className={styles.input}
                      type="text"
                      value={att.name}
                      onChange={(e) =>
                        handleAttachmentChange(idx, "name", e.target.value)
                      }
                    />
                    <input
                      className={styles.input}
                      type="text"
                      value={att.type}
                      onChange={(e) =>
                        handleAttachmentChange(idx, "type", e.target.value)
                      }
                    />
                    <input
                      className={styles.input}
                      type="number"
                      min={0}
                      value={att.id}
                      onChange={(e) =>
                        handleAttachmentChange(
                          idx,
                          "id",
                          Number(e.target.value)
                        )
                      }
                    />
                    <div style={{ display: "flex", gap: 4 }}>
                      {attachments.length > 1 && (
                        <button
                          className={styles.iconBtn}
                          type="button"
                          onClick={() => handleRemoveAttachment(idx)}
                          title="Remove attachment"
                        >
                          &minus;
                        </button>
                      )}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>

          {updateHistory.length > 0 && (
            <div className={styles.section}>
              <div className={styles.sectionTitle}>Update History</div>
              <div className={styles.updateHistoryList}>
                {updateHistory.map((hist, idx) => (
                  <div key={idx} className={styles.updateHistoryRow}>
                    <span>{hist.updateType}</span>
                    <span>{hist.updatedBy}</span>
                    <span>
                      {hist.updatedAt
                        ? new Date(hist.updatedAt).toLocaleString()
                        : ""}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className={styles.formActions}>
            <button className={styles.pageBtn} type="button" onClick={onClose}>
              Cancel
            </button>
            <button className={styles.addBtn} type="submit">
              {initial ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionForm;
