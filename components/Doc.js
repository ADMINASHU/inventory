import React from "react";

const tableBorder = {
  border: "1px solid #000",
  borderCollapse: "collapse",
};

const cell = {
  border: "1px solid #000",
  padding: "6px 8px",
  fontSize: "15px",
  verticalAlign: "top",
};

const Doc = () => (
  <div style={{ maxWidth: 800, margin: "30px auto", fontFamily: "Arial, sans-serif", background: "#fff", padding: 24 }}>
    <div style={{ textAlign: "center", fontWeight: "bold", fontSize: 18, marginBottom: 8, textDecoration: "underline" }}>
      DELIVERY CHALLAN
    </div>
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 15, marginBottom: 6 }}>
      <div>
        <span style={{ fontWeight: "bold" }}>GSTIN/UIN: 10AABCT0359D</span>
      </div>
      <div>
        <div>No.:</div>
        <div>Dated:</div>
      </div>
    </div>
    <div style={{ fontWeight: "bold", fontSize: 24, marginBottom: 2 }}>
      TECHSER POWER SOLUTIONS PVT. LTD.
    </div>
    <div style={{ fontSize: 13, marginBottom: 2 }}>
      <span style={{ fontWeight: "bold" }}>Area Office:</span> 2<sup>nd</sup> Floor of Prakash Bhawan, Near Khushi Marriage Garden, West Ramakrishna Nagar, Patna, Bihar - 800027,<br />
      Mob. No.: +91 9711623853
    </div>
    <div style={{ fontSize: 13, marginBottom: 8 }}>
      <span style={{ fontWeight: "bold" }}>Head Office:</span> “TECHSER HOUSE” #12/1, 5th Cross, MES Ring Road, Sharadamba Nagar, Jalahalli, Bangalore - 560013,<br />
      Ph. No.: 080 - 28384854 / 28384517 / 23458706
    </div>
    <table style={{ width: "100%", ...tableBorder, marginBottom: 0 }}>
      <tbody>
        <tr>
          <td style={{ ...cell, width: "55%", height: 70 }}>
            <div>M/s.</div>
          </td>
          <td style={{ ...cell, width: "45%" }}>
            <div>Order Date:</div>
            <div>Order No.:</div>
            <div>GSTIN:</div>
            <div>Mode of despatch:</div>
          </td>
        </tr>
      </tbody>
    </table>
    <table style={{ width: "100%", ...tableBorder, marginBottom: 0, marginTop: 0 }}>
      <thead>
        <tr style={{ background: "#f5f5f5" }}>
          <th style={{ ...cell, width: "6%", textAlign: "center" }}>Sl.<br />No.</th>
          <th style={{ ...cell, width: "44%", textAlign: "center" }}>DESCRIPTION</th>
          <th style={{ ...cell, width: "10%", textAlign: "center" }}>QTY.</th>
          <th style={{ ...cell, width: "20%", textAlign: "center" }}>RATE / UNIT<br />Rs.</th>
          <th style={{ ...cell, width: "20%", textAlign: "center" }}>AMOUNT<br />Rs.</th>
        </tr>
      </thead>
      <tbody>
        {/* Empty rows for now */}
        <tr>
          <td style={{ ...cell, height: 120 }}></td>
          <td style={cell}></td>
          <td style={cell}></td>
          <td style={cell}></td>
          <td style={cell}></td>
        </tr>
      </tbody>
    </table>
    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 32, fontSize: 15 }}>
      <div>
        Received the above goods in good conditions.<br /><br />
        <span style={{ fontSize: 13 }}>Receiver’s Signature</span>
      </div>
      <div style={{ textAlign: "right" }}>
        For <span style={{ fontWeight: "bold" }}>Techser Power Solutions Pvt. Ltd.</span><br /><br />
        <span style={{ fontSize: 13 }}>Authorised Signatory</span>
      </div>
    </div>
  </div>
);

export default Doc;

