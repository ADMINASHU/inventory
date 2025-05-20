import { NextResponse } from "next/server";
import connectToServiceEaseDB from "@/lib/serviceDB";
import { Transaction } from "@/models/Transaction";
import { List } from "@/models/List";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const stockId = searchParams.get("stock");
  if (!stockId) {
    return NextResponse.json([], { status: 400 });
  }

  await connectToServiceEaseDB();

  // Fetch all transactions for this stock
  const transactions = await Transaction.find({
    $or: [{ from: stockId }, { to: stockId }],
  }).lean();

  // Fetch all lists
  const lists = await List.find({}).lean();

  // Aggregate stock counts
  const allItems = transactions.flatMap((tx) =>
    (tx.items || []).map((item) => ({
      ...item,
      adjustedCount: tx.from == stockId ? -(item.count || 0) : item.count || 0,
    }))
  );

  const idCountMap = {};
  allItems.forEach((item) => {
    const id = item._id ? String(item._id) : "Unknown ID";
    if (!idCountMap[id]) {
      idCountMap[id] = { _id: id, count: 0 };
    }
    idCountMap[id].count += item.adjustedCount;
  });

  // Attach list info
  Object.keys(idCountMap).forEach((id) => {
    const list = lists.find((p) => String(p._id) === id);
    idCountMap[id].partName = list ? list.partName : "Unknown List";
    idCountMap[id].category = list ? list.category : "Unknown Category";
    idCountMap[id].description = list ? list.description : "Unknown Description";
  });

  const result = Object.values(idCountMap);

  return NextResponse.json(result);
}
