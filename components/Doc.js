import React from "react";
import styles from "./Doc.module.css";

// Helper to get user's fName by id
const getUserName = (id, users) => {
  const user = users?.find((u) => u._id === id);
  return user ? user.fName : id;
};

// Make entry values a little bold and colored
const entryStyle = { color: "rgb(120,120,120)", fontWeight: 500 };

const Doc = ({ txn = {}, users = [] }) => (
  <div className={styles.docWrapper}>
    <div className={styles.title}>
      DELIVERY CHALLAN
    </div>
    <div className={styles.headerRow}>
      <div>
        <span className={styles.bold}>GSTIN/UIN: 10AABCT0359D</span>
      </div>
      <div>
        <div>
          No.: <span style={entryStyle}>{txn.transactionId || ""}</span>
        </div>
        <div>
          Dated: <span style={entryStyle}>{txn.date ? new Date(txn.date).toLocaleDateString() : ""}</span>
        </div>
      </div>
    </div>
    <div className={styles.companyName}>
      TECHSER POWER SOLUTIONS PVT. LTD.
    </div>
    <div className={styles.officeInfo}>
      <span className={styles.bold}>Area Office:</span> 2<sup>nd</sup> Floor of Prakash Bhawan, Near Khushi Marriage Garden, West Ramakrishna Nagar, Patna, Bihar - 800027, Mob. No.: +91 9711623853
    </div>
    <div className={styles.officeInfo}>
      <span className={styles.bold}>Head Office:</span> “TECHSER HOUSE” #12/1, 5th Cross, MES Ring Road, Sharadamba Nagar, Jalahalli, Bangalore - 560013, Ph. No.: 080 - 28384854 / 28384517 / 23458706
    </div>
    <table className={styles.infoTable}>
      <tbody>
        <tr>
          <td className={styles.infoCellLeft}>
            <div>
              M/s. <span style={entryStyle}>{getUserName(txn.to, users)}</span>
            </div>
          </td>
          <td className={styles.infoCellRight}>
            <div>
              Order Date: <span style={entryStyle}>{txn.date ? new Date(txn.date).toLocaleDateString() : ""}</span>
            </div>
            <div>
              Order No.: <span style={entryStyle}>{txn.transactionId || ""}</span>
            </div>
            <div>
              GSTIN: <span style={entryStyle}></span>
            </div>
            <div>
              Mode of despatch: <span style={entryStyle}>{txn.transactionMethod || ""}</span>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <table className={styles.itemsTable}>
      <thead>
        <tr>
          <th className={styles.cell + " " + styles.center + " " + styles.slno}>Sl.<br />No.</th>
          <th className={styles.cell + " " + styles.center + " " + styles.desc}>DESCRIPTION</th>
          <th className={styles.cell + " " + styles.center + " " + styles.qty}>QTY.</th>
          <th className={styles.cell + " " + styles.center + " " + styles.rate}>RATE / UNIT<br />Rs.</th>
          <th className={styles.cell + " " + styles.center + " " + styles.amount}>AMOUNT<br />Rs.</th>
        </tr>
      </thead>
      <tbody>
        {txn.items && txn.items.length > 0 ? (
          txn.items.map((item, idx) => (
            <tr key={idx}>
              <td className={styles.cell}><span style={entryStyle}>{idx + 1}</span></td>
              <td className={styles.cell}>
                <span style={entryStyle}>{item.partName || item._id}</span>
                {item.category ? <span style={entryStyle}> ({item.category})</span> : ""}
              </td>
              <td className={styles.cell}><span style={entryStyle}>{item.count}</span></td>
              <td className={styles.cell}><span style={entryStyle}></span></td>
              <td className={styles.cell}><span style={entryStyle}></span></td>
            </tr>
          ))
        ) : (
          <tr>
            <td className={styles.cell} style={{ height: 120 }}><span style={entryStyle}></span></td>
            <td className={styles.cell}><span style={entryStyle}></span></td>
            <td className={styles.cell}><span style={entryStyle}></span></td>
            <td className={styles.cell}><span style={entryStyle}></span></td>
            <td className={styles.cell}><span style={entryStyle}></span></td>
          </tr>
        )}
      </tbody>
    </table>
    <div className={styles.footerRow}>
      <div>
        <span>
          Received the above goods in good conditions.<br /><br />
          <span className={styles.footerNote}>Receiver’s Signature</span>
        </span>
      </div>
      <div className={styles.footerRight}>
        <span>
          For <span className={styles.bold}>Techser Power Solutions Pvt. Ltd.</span><br /><br />
          <span className={styles.footerNote}>Authorised Signatory</span>
        </span>
      </div>
    </div>
  </div>
);

export default Doc;

