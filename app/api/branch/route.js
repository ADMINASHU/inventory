import { NextResponse } from 'next/server';
import connectToServiceEaseDB from '@/lib/serviceDB';
import Branch from '@/models/Branch';

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
  try {
    if (id) {
      const branch = await Branch.findById(id);
      if (!branch) {
        return NextResponse.json({ error: 'Branch not found' }, { status: 404 });
      }
      return NextResponse.json(branch);
    }
    const branches = await Branch.find({});
    return NextResponse.json(branches);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  await connectToServiceEaseDB();
  try {
    const body = await request.json();
    const branch = await Branch.create(body);
    return NextResponse.json(branch, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

export async function PUT(request) {
  await connectToServiceEaseDB();
  const body = await parseBody(request);
  const { _id, ...update } = body;
  if (!_id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }
  try {
    const updated = await Branch.findByIdAndUpdate(_id, update, { new: true });
    if (!updated) {
      return NextResponse.json({ error: 'Branch not found' }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

export async function DELETE(request) {
  await connectToServiceEaseDB();
  const body = await parseBody(request);
  const { _id } = body;
  if (!_id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }
  try {
    const deleted = await Branch.findByIdAndDelete(_id);
    if (!deleted) {
      return NextResponse.json({ error: 'Branch not found' }, { status: 404 });
    }
    return NextResponse.json({});
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
