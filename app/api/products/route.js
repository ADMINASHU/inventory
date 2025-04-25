import { NextResponse } from 'next/server'
import Product from '@/models/Product'
import connectToDatabase from '@/lib/db'

export async function GET(req) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const sort = searchParams.get('sort') || 'createdAt'
    const order = searchParams.get('order') === 'asc' ? 1 : -1
    const search = searchParams.get('search') || ''
    const filter = searchParams.get('filter') || ''

    let query = {}
    if (search) {
      query.name = { $regex: search, $options: 'i' }
    }
    // Add more filters as needed

    const total = await Product.countDocuments(query)
    const products = await Product.find(query)
      .sort({ [sort]: order })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean()

    return NextResponse.json({ products, total })
  } catch (err) {
    console.error('GET /api/products error:', err)
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(req) {
  try {
    await connectToDatabase();
    const data = await req.json()
    if (!data.name || !data.category || data.price == null || data.stock == null) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 })
    }
    const product = await Product.create({
      name: data.name,
      category: data.category,
      price: data.price,
      stock: data.stock,
    })
    return NextResponse.json(product, { status: 201 })
  } catch (err) {
    console.error('POST /api/products error:', err)
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 })
  }
}
