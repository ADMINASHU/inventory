import { NextResponse } from "next/server";
import connectToServiceEaseDB from "@/lib/serviceDB";
import { Transaction } from "@/models/Transaction";

// Helper to parse JSON body for PUT/DELETE
async function parseBody(request) {
  try {
    return await request.json();
  } catch {
    return {};
  }
}

// Helper to generate transactionId
function generateTransactionId(branchName, date, series = 1) {
  if (!branchName || !date) return "";
  const prefix = branchName.slice(0, 3).toUpperCase();
  const yymmdd = date.replace(/-/g, "").slice(2, 8); // "YYYY-MM-DD" -> "YYMMDD"
  const seriesStr = String(series).padStart(4, "0");
  return `${prefix}${yymmdd}-${seriesStr}`;
}

export async function GET(request) {
  await connectToServiceEaseDB();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const userId = searchParams.get("userId");
  const stock = searchParams.get("stock");
  if (id) {
    const item = await Transaction.findById(id);
    return NextResponse.json(item);
  }
  if (userId) {
    const transactions = await Transaction.find({
      $or: [{ from: userId }, { to: userId }],
    }).sort({ date: -1 });
    console.log("transactions: UserID");
    return NextResponse.json(transactions);
  }
  if (stock) {
    // Fetch transactions where:
    // - from == stock (any status)
    // - OR to == stock AND transactionStatus == "RECEIVED"
    const transactions = await Transaction.find({
      $or: [
        { from: stock },
        { to: stock, transactionStatus: "RECEIVED" }
      ]
    }).sort({ date: -1 });
    console.log("transactions:  stock");
    return NextResponse.json(transactions);
  }

  const transactions = await Transaction.find({});
  return NextResponse.json(transactions);
}

export async function POST(request) {
  await connectToServiceEaseDB();
  const body = await request.json();
  try {
    // --- Server-side transactionId generation ---
    // You may need to adjust this if your branch field is named differently
    const branchName = body.branch || "";
    const date = body.date ? body.date.slice(0, 10) : ""; // "YYYY-MM-DD"
    if (!branchName || !date) {
      return NextResponse.json({ error: "branch and date are required" }, { status: 400 });
    }

    // Find latest transaction for this branch and date
    const prefix = branchName.slice(0, 3).toUpperCase();
    const yymmdd = date.replace(/-/g, "").slice(2, 8);
    const idPrefix = `${prefix}${yymmdd}-`;

    // Find the latest transactionId for this branch/date
    const latest = await Transaction.findOne(
      { transactionId: { $regex: `^${idPrefix}\\d{4}$` } },
      {},
      { sort: { transactionId: -1 } }
    );

    let nextSeries = 1;
    if (latest && latest.transactionId) {
      const match = latest.transactionId.match(/-(\d{4})$/);
      if (match) {
        nextSeries = parseInt(match[1], 10) + 1;
      }
    }

    body.transactionId = generateTransactionId(branchName, date, nextSeries);

    const transaction = await Transaction.create(body);
    return NextResponse.json(transaction, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

export async function PUT(request) {
  await connectToServiceEaseDB();
  const body = await parseBody(request);
  const { _id, ...update } = body;
  try {
    const updated = await Transaction.findByIdAndUpdate(_id, update, { new: true });
    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

export async function DELETE(request) {
  try {
    await connectToServiceEaseDB();
    const body = await parseBody(request);
    const { _id } = body;
    if (!_id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }
    await Transaction.findByIdAndDelete(_id);
    // Use status 200 with an empty object for JSON response (204 is not valid for JSON)
    return NextResponse.json({});
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
