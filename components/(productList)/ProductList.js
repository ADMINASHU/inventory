'use client'
import React, { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"
import styles from './ProductList.module.css'

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'category', label: 'Category' },
  { key: 'price', label: 'Price' },
  { key: 'stock', label: 'Stock' },
]

const PAGE_SIZE = 20

const ProductList = () => {
  const [products, setProducts] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [sort, setSort] = useState('createdAt')
  const [order, setOrder] = useState('desc')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const [showAdd, setShowAdd] = useState(false)
  const [addLoading, setAddLoading] = useState(false)
  const [form, setForm] = useState({ name: '', category: '', price: '', stock: '' })
  const [formError, setFormError] = useState('')

  useEffect(() => {
    setLoading(true)
    fetch(`/api/products?page=${page}&limit=${PAGE_SIZE}&sort=${sort}&order=${order}&search=${encodeURIComponent(search)}`)
      .then(async res => {
        if (!res.ok) {
          setProducts([])
          setTotal(0)
          setLoading(false)
          return
        }
        try {
          const data = await res.json()
          setProducts(data.products || [])
          setTotal(data.total || 0)
        } catch {
          setProducts([])
          setTotal(0)
        }
        setLoading(false)
      })
      .catch(() => {
        setProducts([])
        setTotal(0)
        setLoading(false)
      })
  }, [page, sort, order, search])

  const handleSort = (col) => {
    if (sort === col) {
      setOrder(order === 'asc' ? 'desc' : 'asc')
    } else {
      setSort(col)
      setOrder('asc')
    }
  }

  const handleAddProduct = async (e) => {
    e.preventDefault()
    setFormError('')
    if (!form.name || !form.category || !form.price || !form.stock) {
      setFormError('All fields are required')
      return
    }
    setAddLoading(true)
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.name,
        category: form.category,
        price: Number(form.price),
        stock: Number(form.stock),
      }),
    })
    setAddLoading(false)
    if (res.ok) {
      setShowAdd(false)
      setForm({ name: '', category: '', price: '', stock: '' })
      setPage(1)
      fetch(`/api/products?page=1&limit=${PAGE_SIZE}&sort=${sort}&order=${order}&search=${encodeURIComponent(search)}`)
        .then(res => res.json())
        .then(data => {
          setProducts(data.products)
          setTotal(data.total)
        })
    } else {
      setFormError('Failed to add product')
    }
  }

  const totalPages = Math.ceil(total / PAGE_SIZE)
  const start = (page - 1) * PAGE_SIZE + 1
  const end = Math.min(page * PAGE_SIZE, total)

  return (
    <div className="space-y-6">
      <div className={styles.header}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold">Products</h1>
          </div>
          <div className="flex items-center gap-2">
            <Input
              placeholder="Search products..."
              value={search}
              onChange={e => { setPage(1); setSearch(e.target.value) }}
              className="w-48"
            />
            <Button
              variant="outline"
              className="flex items-center gap-1"
              onClick={() => setShowAdd(true)}
            >
              <Plus size={16} /> Add New Product
            </Button>
          </div>
        </div>
      </div>
      {showAdd && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2 className="text-lg font-semibold mb-4">Add Product</h2>
            <form onSubmit={handleAddProduct} className="space-y-3">
              <Input
                placeholder="Name"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              />
              <Input
                placeholder="Category"
                value={form.category}
                onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
              />
              <Input
                placeholder="Price"
                type="number"
                value={form.price}
                onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
              />
              <Input
                placeholder="Stock"
                type="number"
                value={form.stock}
                onChange={e => setForm(f => ({ ...f, stock: e.target.value }))}
              />
              {formError && <div className="text-red-500 text-sm">{formError}</div>}
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => setShowAdd(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={addLoading}>
                  {addLoading ? "Adding..." : "Add"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
      <div className={styles.tableWrapper}>
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map(col => (
                <TableHead
                  key={col.key}
                  className="cursor-pointer select-none"
                  onClick={() => handleSort(col.key)}
                >
                  <span className="flex items-center">
                    {col.label}
                    {sort === col.key && (
                      <span className="ml-1">{order === 'asc' ? '▲' : '▼'}</span>
                    )}
                  </span>
                </TableHead>
              ))}
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length + 1}>Loading...</TableCell>
              </TableRow>
            ) : products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + 1}>No products found.</TableCell>
              </TableRow>
            ) : (
              products.map(product => (
                <TableRow key={product._id}>
                  {columns.map(col => (
                    <TableCell key={col.key}>{product[col.key]}</TableCell>
                  ))}
                  <TableCell>
                    <Button size="sm" variant="outline">Edit</Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <div className={styles.pagination}>
        <div className="text-sm text-muted-foreground">
          {end === 0 ? 0 : start} - {end} of {total}
        </div>
        <div className={styles.paginationButtons}>
          <Button
            size="icon"
            variant="outline"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            <ChevronLeft size={16} />
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(p =>
              p === 1 ||
              p === totalPages ||
              (p >= page - 1 && p <= page + 1)
            )
            .map((p, idx, arr) => (
              <React.Fragment key={p}>
                {idx > 0 && p - arr[idx - 1] > 1 && <span className="px-1">...</span>}
                <Button
                  size="icon"
                  variant={p === page ? "default" : "outline"}
                  onClick={() => setPage(p)}
                >
                  {p}
                </Button>
              </React.Fragment>
            ))}
          <Button
            size="icon"
            variant="outline"
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            <ChevronRight size={16} />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ProductList