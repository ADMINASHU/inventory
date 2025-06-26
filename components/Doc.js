import React from "react";
import styles from "./Doc.module.css";

// Helper to get user's fName by id
const getUserName = (id, users) => {
  const user = users?.find((u) => u._id === id);
  return user ? user.fName : id;
};
const getBranchAddress = (id, branches) => {
  const branch = branches?.find((b) => b._id === id);
  return branch ? branch.address : "";
};
const getBranchGST = (id, branches) => {
  const branch = branches?.find((b) => b._id === id);
  return branch ? branch.gst : "";
};
// Update getUserAddress to support inBranch logic
const getUserAddress = (id, users, branches) => {
  const user = users?.find((u) => u._id === id);
  if (!user) return "";
  if (user.inBranch && user.branch && branches) {
    const branch = getBranchAddress(user.branch, branches);
    return branch ? branch : "";
  }
  return user.address;
};
const getUserContact = (id, users) => {
  const user = users?.find((u) => u._id === id);
  return user ? user.mobileNo : "";
};

const getAreaOfficeAddress = (id, users, branches) => {
  const user = users?.find((u) => u._id === id);
  if (!user) return "";
  if (user.branch && branches) {
    const address = getBranchAddress(user.branch, branches);
    return address ? address : "";
  }
};
const getAreaOfficeGST = (id, users, branches) => {
  const user = users?.find((u) => u._id === id);
  if (!user) return "";
  if (user.branch && branches) {
    const gst = getBranchGST(user.branch, branches);
    return gst ? gst : "";
  }
};

// Make entry values a little bold and colored
const entryStyle = { color: "rgb(120,120,120)", fontWeight: 500 };

const Doc = ({
  txn = {},
  users = [],
  branches = [],
  getItemCategory,
  getItemName,
}) => (
  <div className={styles.docWrapper}>
    <div className={styles.title}>DELIVERY CHALLAN</div>
    <div className={styles.headerRow}>
      <div>
        <span className={styles.bold}>
          GSTIN/UIN: {getAreaOfficeGST(txn.from, users, branches)}
        </span>
      </div>
      <div>
        <div>
          No.: <span style={entryStyle}>{txn.transactionId || ""}</span>
        </div>
        <div>
          Dated:{" "}
          <span style={entryStyle}>
            {txn.date ? new Date(txn.date).toLocaleDateString() : ""}
          </span>
        </div>
      </div>
    </div>
    <div className={styles.companyName}>TECHSER POWER SOLUTIONS PVT. LTD.</div>
    <div className={styles.officeInfo}>
      <span className={styles.bold}>Area Office:</span>
      {getAreaOfficeAddress(txn.from, users, branches)}
      {getUserContact(txn.from, users)
        ? `, Ph. No.: ${getUserContact(txn.from, users)}`
        : ""}
      <br />
    </div>
    <div className={styles.officeInfo}>
      <span className={styles.bold}>Head Office:</span> “TECHSER HOUSE” #12/1,
      5th Cross, MES Ring Road, Sharadamba Nagar, Jalahalli, Bangalore - 560013,
      Ph. No.: 080 - 28384854 / 28384517 / 23458706
    </div>
    <table className={styles.infoTable}>
      <tbody>
        <tr>
          <td className={styles.infoCellLeft}>
            <div>
              M/s. <span style={entryStyle}>{getUserName(txn.to, users)}</span>
              , <br />
              <span style={entryStyle}>
                {getUserAddress(txn.to, users, branches)}
                {getUserContact(txn.to, users) ? (
                  <>
                    , <br />
                    Ph. No.: {getUserContact(txn.to, users)}
                  </>
                ) : (
                  ""
                )}
              </span>
            </div>
          </td>
          <td className={styles.infoCellRight}>
            <div>
              Order Date:{" "}
              <span style={entryStyle}>
                {txn.date ? new Date(txn.date).toLocaleDateString() : ""}
              </span>
            </div>
            <div>
              Order No.:{" "}
              <span style={entryStyle}>{txn.transactionId || ""}</span>
            </div>
            <div>
              GSTIN: <span style={entryStyle}></span>
            </div>
            <div>
              Mode of despatch:{" "}
              <span style={entryStyle}>{txn.transactionMethod || ""}</span>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <table className={styles.itemsTable}>
      <thead>
        <tr>
          <th className={styles.cell + " " + styles.center + " " + styles.slno}>
            S.No
          </th>
          <th className={styles.cell + " " + styles.center + " " + styles.desc}>
            DESCRIPTION
          </th>
          <th className={styles.cell + " " + styles.center + " " + styles.qty}>
            QTY.
          </th>
          <th className={styles.cell + " " + styles.center + " " + styles.rate}>
            RATE / UNIT
         
          </th>
          <th
            className={styles.cell + " " + styles.center + " " + styles.amount}
          >
            AMOUNT
            
          </th>
        </tr>
      </thead>
      <tbody>
        {txn.items && txn.items.length > 0 ? (
          txn.items.map((item, idx) => (
            <tr key={idx}>
              <td className={styles.cell + " " + styles.center}>
                <span style={entryStyle}>{idx + 1}</span>
              </td>
              <td className={styles.cell}>
                <span style={entryStyle}>{getItemName(item._id)}</span>
                <span style={entryStyle}> ({getItemCategory(item._id)})</span>
              </td>
              <td className={styles.cell + " " + styles.right}>
                <span style={entryStyle}>{item.count} Nos</span>
              </td>
              <td className={styles.cell}>
                <span style={entryStyle}></span>
              </td>
              <td className={styles.cell}>
                <span style={entryStyle}></span>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td className={styles.cell} style={{ height: 120 }}>
              <span style={entryStyle}></span>
            </td>
            <td className={styles.cell}>
              <span style={entryStyle}></span>
            </td>
            <td className={styles.cell}>
              <span style={entryStyle}></span>
            </td>
            <td className={styles.cell}>
              <span style={entryStyle}></span>
            </td>
            <td className={styles.cell}>
              <span style={entryStyle}></span>
            </td>
          </tr>
        )}
      </tbody>
      <tr>
        <td className={styles.cell} colSpan={2} style={{ textAlign: "right", fontWeight: 600 }}>
          Total Nos
        </td>
        <td className={styles.cell}>
          <span style={entryStyle}>{txn.total} Nos</span>
        </td>
        <td className={styles.cell} colSpan={1} style={{ textAlign: "right", fontWeight: 600 }}>
          Total Amount
        </td>
        <td className={styles.cell}>
          <span style={entryStyle}></span>
        </td>
      </tr>
    </table>
    <div className={styles.footerRow}>
      <div>
        <span>
          Received the above goods in good conditions.
          <br />
          <br />
          <span className={styles.footerNote}>Receiver’s Signature</span>
        </span>
      </div>
      <div className={styles.footerRight}>
        <span>
          For{" "}
          <span className={styles.bold}>Techser Power Solutions Pvt. Ltd.</span>
          <br />
          <br />
          <span className={styles.footerNote}>Authorised Signatory</span>
        </span>
      </div>
    </div>
  </div>
);

export default Doc;
