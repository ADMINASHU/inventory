import { NextResponse } from "next/server";
import connectToServiceEaseDB from "@/lib/serviceDB";
import { Transaction } from "@/models/Transaction";
import User from "@/models/User";
import Customer from "@/models/Customer";
import Branch from "@/models/Branch";

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

  // Pagination and filter params
  const page = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = parseInt(searchParams.get("pageSize") || "10", 10);
  const year = searchParams.get("year");
  const month = searchParams.get("month");
  const type = searchParams.get("type");
  const user = searchParams.get("user");
  const search = searchParams.get("search");
  const category = searchParams.get("category");

  if (id) {
    const item = await Transaction.findById(id);
    return NextResponse.json(item);
  }

  // Server-side pagination and filtering
  if (userId) {
    // Build filter object
    const filter = {
      $or: [{ from: userId }, { to: userId }],
    };

    if (type) filter.transactionType = type;
    if (category) filter.category = category;
    if (user) {
      // If type is SEND, filter by to; else by from
      if (type === "SEND") filter.to = user;
      else if (type) filter.from = user;
      else filter.$or = [{ from: userId, to: user }, { to: userId, from: user }];
    }
    if (year) {
      const yearNum = parseInt(year, 10);
      filter.date = filter.date || {};
      filter.date.$gte = new Date(`${yearNum}-01-01`);
      filter.date.$lte = new Date(`${yearNum}-12-31T23:59:59.999Z`);
    }
    if (month) {
      // If year is also set, use that year, else current year
      const yearNum = year ? parseInt(year, 10) : new Date().getFullYear();
      const monthNum = new Date(`${month} 1, ${yearNum}`).getMonth();
      const start = new Date(yearNum, monthNum, 1);
      const end = new Date(yearNum, monthNum + 1, 0, 23, 59, 59, 999);
      filter.date = filter.date || {};
      filter.date.$gte = start;
      filter.date.$lte = end;
    }
    if (search) {
      filter.partName = { $regex: search, $options: "i" };
    }

    // Count total for pagination
    const total = await Transaction.countDocuments(filter);

    // Fetch paginated results
    const items = await Transaction.find(filter)
      .sort({ date: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    return NextResponse.json({ items, total });
  }

  // Stock-specific logic
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
    // If branch is an _id, fetch the branch name from the Branch model
    let branchName = body.branch || "";
    if (branchName && branchName.length === 24) { // likely a MongoDB ObjectId
        const branchDoc = await Branch.findById(branchName);
        if (branchDoc && branchDoc.name) {
          branchName = branchDoc.name;
        }
     
    }
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


    const loggedUser = await User.findById(body.createdBy);
    if (!loggedUser) {  
      return NextResponse.json({ error: "User not logged in" }, { status: 400 });
    }
    let to = await User.findById(body.to);
    if (!to) {
      to = await Customer.findById(body.to);
      if (!to) {
        return NextResponse.json({ error: "to User not found" }, { status: 400 });
      }
    }
    let from = await User.findById(body.from);
    if (!from) {
      from = await Customer.findById(body.from);
      if (!from) {
        return NextResponse.json({ error: "from User not found" }, { status: 400 });
      }
    }
    let nextSeries = 1;
    if (latest && latest.transactionId) {
      const match = latest.transactionId.match(/-(\d{4})$/);
      if (match) {
        nextSeries = parseInt(match[1], 10) + 1;
      }
    }

    body.transactionId = generateTransactionId(branchName, date, nextSeries);
    body.transactionStatus = body.transactionType === "SEND" ? to?.isSecure ? "IN PROCESS" : "RECEIVED" : from?.isSecure ? "IN PROCESS" : "RECEIVED" ;


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
