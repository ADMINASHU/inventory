import { NextResponse } from 'next/server';
import connectToServiceEaseDB from '@/lib/serviceDB';
import User from '@/models/User'; // Use default import for consistency

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
      const user = await User.findById(id);
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
      return NextResponse.json(user);
    }
    const users = await User.find({});
    return NextResponse.json(users);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  await connectToServiceEaseDB();
  try {
    const body = await request.json();
    const user = await User.create(body);
    return NextResponse.json(user, { status: 201 });
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
    const updated = await User.findByIdAndUpdate(_id, update, { new: true });
    if (!updated) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
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
    const deleted = await User.findByIdAndDelete(_id);
    if (!deleted) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    return NextResponse.json({});
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
