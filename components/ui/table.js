import React from "react"

export const Table = ({ children, ...props }) => (
  <table className="min-w-full divide-y divide-gray-200" {...props}>{children}</table>
)
export const TableHeader = ({ children, ...props }) => (
  <thead className="bg-gray-50" {...props}>{children}</thead>
)
export const TableRow = ({ children, ...props }) => (
  <tr className="border-b" {...props}>{children}</tr>
)
export const TableHead = ({ children, className = "", ...props }) => (
  <th className={`px-4 py-2 text-left font-medium ${className}`} {...props}>{children}</th>
)
export const TableBody = ({ children, ...props }) => (
  <tbody {...props}>{children}</tbody>
)
export const TableCell = ({ children, ...props }) => (
  <td className="px-4 py-2" {...props}>{children}</td>
)
