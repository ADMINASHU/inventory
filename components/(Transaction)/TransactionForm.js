import React, { useState, useEffect, useMemo, use } from "react";
import styles from "./Transaction.module.css";

// Floating label input component
function FloatingLabelInput({ label, value, onChange, type = "text", required, ...props }) {
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
      <label className={`${styles.floatingLabel} ${value ? styles.floatingLabelActive : ""}`}>
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
      <label className={`${styles.floatingLabel} ${value ? styles.floatingLabelActive : ""}`}>
        {label}
      </label>
    </div>
  );
}

const emptyItem = { _id: "", count: 0, partName: "", category: "", state: "" };
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
  from,
  setFrom,
  transactionType,
  setTransactionType,
}) => {
  const [date, setDate] = useState("");
  const [items, setItems] = useState([{ ...emptyItem }]);
  const [total, setTotal] = useState(0);
  const [transactionMethod, setTransactionMethod] = useState("");
  const [to, setTo] = useState("");
  const [orderedDate, setOrderedDate] = useState("");
  const [orderNo, setOrderNo] = useState(null);
  const [createdBy, setCreatedBy] = useState("");
  const [note, setNote] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [isDeleted, setIsDeleted] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [approvedBy, setApprovedBy] = useState("");
  const [approvedAt, setApprovedAt] = useState("");
  const [updateHistory, setUpdateHistory] = useState([]);

  // Helper to get partId by category and partName
  const getPartId = (category, partName) => {
    const found = parts.find((p) => p.category === category && p.partName === partName);
    return found ? found._id : "";
  };
  const availableToUsers = useMemo(
    () => [...users.filter((u) => u._id !== from), ...customers.filter((c) => c._id !== from)],
    [users, customers, from]
  );
  const availableFromUsers = useMemo(
    () => [
      ...users.filter((u) => u._id !== to && u.isSecure === false),
      ...customers.filter((c) => c._id !== to),
    ],
    [users, customers, to]
  );

  useEffect(() => {
    if (from && from === to && !initial) {
      setTo("");
    }
  }, [from, to]);

  useEffect(() => {
    if (open && initial) {
      // Only run this effect when opening the form for edit (initial exists)
      setDate(initial.date ? initial.date.slice(0, 10) : "");
      setItems(
        initial.items && initial.items.length > 0
          ? initial.items.map((item) => {
              const part =
                parts.find((p) => p._id === (item.partId || item._id)) ||
                stock.find((s) => s._id === (item.partId || item._id));
              return {
                ...item,
                partId: item.partId || item._id || "",
                category: part ? part.category : item.category || "",
                partName: part ? part.partName : item.partName || "",
              };
            })
          : [{ ...emptyItem }]
      );
      setTransactionMethod(initial.transactionMethod || "");
      setTransactionType(initial.transactionType || "");
      setFrom(initial.from);
      setTo(initial.to);
      setOrderedDate(initial.orderedDate ? initial.orderedDate.slice(0, 10) : "");
      setOrderNo(initial.orderNo || null);
      setCreatedBy(initial.createdBy || "");
      setNote(initial.note || "");
      setAttachments(initial.attachment && initial.attachment.length > 0 ? initial.attachment : []);
      setIsDeleted(initial.isDeleted || false);
      setIsApproved(initial.isApproved || false);
      setApprovedBy(initial.approvedBy || "");
      setApprovedAt(initial.approvedAt ? initial.approvedAt.slice(0, 16) : "");
      setUpdateHistory(initial.updateHistory || []);
    } else if (open && !initial) {
      // Only run this effect when opening the form for add (no initial)
      setDate(new Date().toISOString().slice(0, 10));
      setItems([{ ...emptyItem }]);
      setTransactionMethod("");
      setTransactionType("SEND");
      setFrom(""); // will be set by transactionType effect below
      setTo("");
      setOrderedDate(new Date().toISOString().slice(0, 10));
      setOrderNo(null);
      setCreatedBy(loggedUser?.sub || "");
      setNote("");
      setAttachments([]);
      setIsDeleted(false);
      setIsApproved(false);
      setApprovedBy("");
      setApprovedAt("");
      setUpdateHistory([]);
    }
    // transactionType is not a dependency here, so it will not reset when changed by user
  }, [open, initial, parts, loggedUser]);

  useEffect(() => {
    // This effect only runs when transactionType changes (for add mode)
    if (open && !initial) {
      setFrom(transactionType === "SEND" ? loggedUser?.sub : "");
      setTo(transactionType === "RECEIVED" ? loggedUser?.sub : "");
    }
  }, [transactionType, open, initial, loggedUser]);

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
  const handleRemoveItem = (idx) => setItems((items) => items.filter((_, i) => i !== idx));

  const handleAttachmentChange = (idx, field, value) => {
    setAttachments((attachments) =>
      attachments.map((att, i) => (i === idx ? { ...att, [field]: value } : att))
    );
  };

  const handleAddAttachment = () => setAttachments((atts) => [...atts, { ...emptyAttachment }]);
  const handleRemoveAttachment = (idx) =>
    setAttachments((atts) => atts.filter((_, i) => i !== idx));

  // Helper to get available stock for a part (by _id)
  const getAvailableStock = (partId, idx = -1) => {
    const part = stock.find((s) => s._id === partId);
    let available = part ? part.count : 0;
    return available;
  };

  // Helper to get selected part ids (excluding current idx)
  const getSelectedPartIds = (excludeIdx = -1) =>
    items.map((item, idx) => (idx !== excludeIdx ? item._id : null)).filter(Boolean);

  // Helper to get available categories for each item row
  const getAvailableCategories = (excludeIdx = -1) => {
    const selectedIds = getSelectedPartIds(excludeIdx);
    const source = transactionType === "RECEIVED" ? parts : stock;
    // Only include categories that have at least one part not already selected
    return Array.from(
      new Set(
        source
          .filter((p) => !selectedIds.includes(p._id))
          .map((p) => p.category)
          .filter(Boolean)
      )
    );
  };

  // Helper to get available part names for a category for each item row
  const getAvailablePartNamesByCategory = (category, excludeIdx = -1) => {
    const selectedIds = getSelectedPartIds(excludeIdx);
    const source = transactionType === "RECEIVED" ? parts : stock;
    return source
      .filter((p) => p.category === category && !selectedIds.includes(p._id))
      .map((p) => p.partName);
  };

  // Disable add item button if all items are selected
  const allSelectableIds = useMemo(() => {
    const source = transactionType === "RECEIVED" ? parts : stock;
    return source.map((p) => p._id);
  }, [transactionType, parts, stock]);
  const allSelected = items.length >= allSelectableIds.length;

  // Helper: is the selected "to" a customer?
  const isToCustomer =
    transactionType === "SEND" &&
    to &&
    customers.some((c) => c._id === to) &&
    !users.some((u) => u._id === to);

  const isFromCustomer =
    transactionType === "RECEIVED" &&
    from &&
    customers.some((c) => c._id === from) &&
    !users.some((u) => u._id === from);

  if (!open) return null;
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalCard}>
        <h3 className={styles.formTitle}>{initial ? "Edit" : "Add"} Transaction</h3>
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
              orderedDate,
              orderNo,
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
                        {u.fName || u.name || u._id}
                      </option>
                    ))}
                  </select>
                  <label className={`${styles.floatingLabel} ${styles.floatingLabelActive}`}>
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
                  >
                    <option value="">Select To User</option>
                    {availableToUsers.map((u) => (
                      <option key={u._id} value={u._id}>
                        {u.fName || u.name || u._id}
                      </option>
                    ))}
                  </select>
                  <label className={`${styles.floatingLabel} ${styles.floatingLabelActive}`}>
                    To
                  </label>
                </div>
              )}
              {/* Show Ordered Date/No only if SEND and To is a customer */}
              {isToCustomer && (
                <>
                  <FloatingLabelInput
                    label="Ordered Date"
                    type="date"
                    value={orderedDate}
                    onChange={(e) => setOrderedDate(e.target.value)}
                    required
                  />
                  <FloatingLabelInput
                    label="Order No."
                    value={orderNo}
                    onChange={(e) => setOrderNo(e.target.value)}
                    required
                  />
                </>
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
                  disabled={allSelected}
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
                <span>State</span>
                <span>Count</span>
                <span style={{ minWidth: 60 }}></span>
              </div>
              {items.map((item, idx) => (
                <React.Fragment key={idx}>
                  <div className={styles.itemListRow}>
                    {/* Dynamic Category dropdown */}
                    <select
                      className={styles.input}
                      value={item.category || ""}
                      onChange={(e) => handleItemChange(idx, "category", e.target.value)}
                      required
                    >
                      <option value="">Select Category</option>
                      {getAvailableCategories(idx).map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                    {/* Part Name dropdown */}
                    <select
                      className={styles.input}
                      value={item.partName || ""}
                      onChange={(e) => handleItemChange(idx, "partName", e.target.value)}
                      required
                      disabled={!item.category}
                    >
                      <option value="">Select Part Name</option>
                      {item.category &&
                        getAvailablePartNamesByCategory(item.category, idx).map((name) => (
                          <option key={name} value={name}>
                            {name}
                          </option>
                        ))}
                    </select>

                    {/* State */}
                    <select
                      className={styles.input}
                      type="text"
                      value={item.state ?? ""}
                      onChange={(e) => handleItemChange(idx, "state", e.target.value)}
                      required
                    >
                      <option value="">Select State</option>
                      <option value="NEW">New</option>
                      <option value="FAULTY">Faulty</option>
                      <option value="USED">Used</option>
                      <option value="REPAIRED">Repaired</option>
                    </select>
                    {/* Count */}
                    <input
                      className={styles.input}
                      type="number"
                      min={1}
                      value={item.count ?? 0}
                      disabled={!item.partName}
                      onChange={(e) => handleItemChange(idx, "count", Number(e.target.value))}
                      required
                      max={
                        !isFromCustomer ? getAvailableStock(item._id, idx) : undefined
                      }
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
                  {/* Available stock row just below each item */}
                  {!isFromCustomer &&
                    item.category &&
                    item.partName &&
                    (item.count === null || item.count > 0) && (
                      <div
                        className={styles.availableStockRow}
                        style={{
                          color:
                            Number(item.count) > getAvailableStock(item._id, idx) ? "red" : "#888",
                          fontSize: "0.95em",
                          marginBottom: 4,
                          marginLeft: 2,
                        }}
                      >
                        Available stock: {getAvailableStock(item._id, idx)}
                      </div>
                    )}
                </React.Fragment>
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
              {(attachments.length === 0 ? [emptyAttachment] : attachments).map((att, idx) => (
                <div key={idx} className={styles.itemListRow}>
                  <input
                    className={styles.input}
                    type="text"
                    value={att.name}
                    onChange={(e) => handleAttachmentChange(idx, "name", e.target.value)}
                  />
                  <input
                    className={styles.input}
                    type="text"
                    value={att.type}
                    onChange={(e) => handleAttachmentChange(idx, "type", e.target.value)}
                  />
                  <input
                    className={styles.input}
                    type="number"
                    min={0}
                    value={att.id}
                    onChange={(e) => handleAttachmentChange(idx, "id", Number(e.target.value))}
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
              ))}
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
                    <span>{hist.updatedAt ? new Date(hist.updatedAt).toLocaleString() : ""}</span>
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
