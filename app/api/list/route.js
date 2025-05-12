import { NextResponse } from 'next/server';
import connectToServiceEaseDB from '@/lib/serviceDB';
import { List } from '@/models/List';

// Helper to parse JSON body for PUT/DELETE
async function parseBody(request) {
  try {
    return await request.json();
  } catch {
    return {};
  }
}

export async function GET(request) {
  await connectToServiceEaseDB();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (id) {
    const item = await List.findById(id);
    return NextResponse.json(item);
  }
  const lists = await List.find({});
  return NextResponse.json(lists);
}

export async function POST(request) {
  await connectToServiceEaseDB();
  const body = await request.json();
  try {
    const list = await List.create(body);
    return NextResponse.json(list, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

export async function PUT(request) {
  await connectToServiceEaseDB();
  const body = await parseBody(request);
  const { _id, ...update } = body;
  try {
    const updated = await List.findByIdAndUpdate(_id, update, { new: true });
    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

export async function DELETE(request) {
  await connectToServiceEaseDB();
  const body = await parseBody(request);
  const { _id } = body;
  try {
    await List.findByIdAndDelete(_id);
    return NextResponse.json({}, { status: 204 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
