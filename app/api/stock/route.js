import { NextResponse } from "next/server";
import connectToServiceEaseDB from "@/lib/serviceDB";
import { Transaction } from "@/models/Transaction";
import { List } from "@/models/List";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const stockId = searchParams.get("stock");
  const loggedUser = searchParams.get("user");
  const itemId = searchParams.get("item");
  if (stockId) {
    await connectToServiceEaseDB();

    // Fetch all transactions for this stock
    const transactions = await Transaction.find({
      $or: [
        { from: stockId, transactionStatus: "RECEIVED" },
        { to: stockId, transactionStatus: "RECEIVED" }
      ]
    }).lean();

    // Fetch all pending transactions for this stock (transactionStatus != "RECEIVED")
    const pendingTransactions = await Transaction.find({
      $or: [
        { from: stockId, transactionStatus: { $ne: "RECEIVED" } },
        { to: stockId, transactionStatus: { $ne: "RECEIVED" } }
      ]
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
        idCountMap[id] = { _id: id, count: 0, pending: 0 };
      }
      idCountMap[id].count += item.adjustedCount;
    });

    // Add pending count for each item
    pendingTransactions.forEach((tx) => {
      (tx.items || []).forEach((item) => {
        const id = item._id ? String(item._id) : "Unknown ID";
        if (!idCountMap[id]) {
          idCountMap[id] = { _id: id, count: 0, pending: 0 };
        }
        // Pending count: negative if from, positive if to
        const pendingAdj = tx.from == stockId ? -(item.count || 0) : item.count || 0;
        idCountMap[id].pending += pendingAdj;
      });
    });

    // Attach list info
    Object.keys(idCountMap).forEach((id) => {
      const list = lists.find((p) => String(p._id) === id);
      idCountMap[id].partName = list ? list.partName : "Unknown List";
      idCountMap[id].category = list ? list.category : "Unknown Category";
      idCountMap[id].description = list ? list.description : "Unknown Description";
    });

    // Only include items with count !== 0
    const result = Object.values(idCountMap);

    return NextResponse.json(result);
  }
  if (itemId && loggedUser) {
    await connectToServiceEaseDB();

    // Fetch transactions for the user where the item exists in the items array
    const transactions = await Transaction.find({
      $or: [{ from: loggedUser }, { to: loggedUser }],
      items: {
        $elemMatch: {
          _id: itemId,
        },
      },
    }).lean();

    if (!transactions || transactions.length === 0) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    }

    // For each transaction, set total to the count of the matched item
    const updatedTransactions = transactions.map((txn) => {
      const matchedItem = (txn.items || []).find((i) => String(i._id) === String(itemId));
      return {
        ...txn,
        total: matchedItem ? matchedItem.count : 0,
      };
    });

    return NextResponse.json(updatedTransactions);
  }
}