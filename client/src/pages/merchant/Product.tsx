import React, { useState, useEffect, KeyboardEvent } from 'react'
import { motion } from 'framer-motion'
import { Search, ChevronLeft, ChevronRight } from 'lucide-react'
import { toggleProtection } from '@/services/productService'
import { Link } from 'react-router-dom'
import { useMerchantContext } from '@/context/MerchantContext'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
}
const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100, damping: 15 } },
}

interface ToggleSwitchProps {
  checked: boolean
  onChange: () => void
}
const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ checked, onChange }) => {
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onChange()
    }
  }
  return (
    <div
      role="switch"
      aria-checked={checked}
      tabIndex={0}
      onClick={onChange}
      onKeyDown={handleKeyDown}
      className="tw-relative tw-w-11 tw-h-6 tw-cursor-pointer tw-select-none"
    >
      <span className={`tw-block tw-w-full tw-h-full tw-rounded-full tw-transition-colors ${checked ? 'tw-bg-green-500' : 'tw-bg-gray-600'}`} />
      <span
        className={`tw-absolute tw-top-[2px] tw-w-5 tw-h-5 tw-bg-white tw-rounded-full tw-shadow tw-transition-transform ${checked ? 'tw-left-[calc(100%-1.25rem)]' : 'tw-left-[2px]'
          }`}
      />
    </div>
  )
}

const ProductsPage: React.FC = () => {
  const { products, isLoading } = useMerchantContext()
  const [localProducts, setLocalProducts] = useState(products)

  const [searchBy, setSearchBy] = useState<'Name' | 'Product ID'>('Product ID')
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  useEffect(() => {
    setLocalProducts(products);
  }, [products]);

  useEffect(() => {
    const max = Math.max(0, Math.ceil(products.length / rowsPerPage) - 1)
    if (page > max) setPage(max)
  }, [products, rowsPerPage, page])


  const handleToggle = async (id: string, numericId: number) => {
  const prod = localProducts.find(p => p.id === id)
  if (!prod || typeof prod.displayOffered !== 'boolean') return
  const old = prod.displayOffered

  // Optimistic update
  setLocalProducts(ps =>
    ps.map(p => (p.id === id ? { ...p, displayOffered: !old } : p))
  )

  try {
    // Use numericId here, not Number(id)
    await toggleProtection(numericId)
  } catch (err) {
    // Revert on error
    setLocalProducts(ps =>
      ps.map(p => (p.id === id ? { ...p, displayOffered: old } : p))
    )
    console.error('Toggle failed', err)
  }
}





  if (isLoading) {
    return (
      <div className="tw-min-h-screen tw-flex tw-justify-center tw-items-center tw-h-64">
        <div className="tw-w-12 tw-h-12 tw-border-t-4 tw-border-cyan-400 tw-border-solid tw-rounded-full tw-animate-spin" />
      </div>
    )
  }

  const filtered = localProducts.filter(p =>
    searchBy === 'Name'
      ? p.name.toLowerCase().includes(searchTerm.toLowerCase())
      : String(p.product_id).includes(searchTerm)
  )
  const total = filtered.length
  const maxPage = Math.max(0, Math.ceil(total / rowsPerPage) - 1)
  const from = total ? page * rowsPerPage + 1 : 0
  const to = Math.min((page + 1) * rowsPerPage, total)
  const paginated = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="tw-bg-[#202020] tw-min-h-screen tw-p-6 tw-space-y-6"
    >
      <motion.div variants={itemVariants} className="tw-flex tw-justify-between tw-items-center">
        <div>
          <h1 className="tw-text-2xl tw-font-bold tw-text-gray-100">Products</h1>
          <p className="tw-text-[#BBBBBB]">Browse and manage your products</p>
        </div>
        <button className="tw-px-4 tw-py-2 tw-border tw-border-cyan-400 tw-text-cyan-400 tw-rounded hover:tw-bg-cyan-400 hover:tw-text-white">
          Export Products
        </button>
      </motion.div>

      <motion.div variants={itemVariants} className="tw-bg-[#1c1c1e] tw-rounded-lg tw-p-4">
        <div className="tw-flex tw-space-x-3">
          <select
            value={searchBy}
            onChange={e => setSearchBy(e.target.value as any)}
            className="tw-bg-[#202020] tw-text-gray-100 tw-border tw-border-gray-700 tw-rounded tw-px-3 tw-py-2 tw-text-sm"
          >
            <option>Product ID</option>
            <option>Name</option>
          </select>
          <div className="tw-relative tw-flex-1">
            <Search className="tw-absolute tw-left-3 tw-top-1/2 tw--translate-y-1/2 tw-text-gray-500" />
            <input
              type="text"
              placeholder="Search…"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="tw-w-full tw-pl-10 tw-bg-[#202020] tw-text-gray-100 tw-border tw-border-gray-700 tw-rounded tw-py-2 tw-text-sm focus:tw-outline-none focus:tw-border-cyan-500"
            />
          </div>
          <button className="tw-flex tw-items-center tw-space-x-1 tw-bg-cyan-400 hover:tw-bg-cyan-500 tw-text-gray-900 tw-rounded-lg tw-px-4 tw-py-2 tw-text-sm">
            <Search size={16} />
            <span>Filter</span>
          </button>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="tw-bg-[#202020] tw-rounded-lg tw-border tw-border-[#4b4b4b]">
        <div className="tw-overflow-x-auto tw-w-full tw-p-6 tw-min-w-0">
          <table className="tw-w-full tw-table-auto tw-divide-y tw-divide-[#4b4b4b]">
            <thead>
              <tr>
                {['Image', 'Name', 'Product ID', 'Price', 'Display Offered', 'Action'].map(th => (
                  <th key={th} className="tw-px-4 tw-py-3 tw-text-center tw-text-xs tw-font-medium tw-text-white uppercase">
                    {th}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="tw-divide-y tw-divide-[#4b4b4b]">
              {paginated.map(p => (
                <tr key={p.id} className="hover:tw-bg-[#4b4b4b]">
                  <td className="tw-px-4 tw-py-3 tw-flex tw-justify-center tw-items-center">
                    <img src={p.imageUrl} alt={p.name} className="tw-w-10 tw-h-10 tw-object-cover tw-rounded" />
                  </td>
                  <td className="tw-px-4 tw-py-3 tw-text-center tw-text-[#BBBBBB]">{p.name}</td>
                  <td className="tw-px-4 tw-py-3 tw-text-center tw-text-[#BBBBBB]">{p.product_id}</td>
                  <td className="tw-px-4 tw-py-3 tw-text-center tw-text-[#BBBBBB]">{typeof p.price === 'number' ? `₹${p.price.toLocaleString()}` : '—'}</td>
                  <td className="tw-px-4 tw-py-3 tw-flex tw-justify-center tw-items-center">
                    <ToggleSwitch checked={p.displayOffered} onChange={() => handleToggle(p.id, p.product_id)} />
                  </td>
                  <td className="tw-px-4 tw-py-3 tw-text-center tw-text-cyan-400">
                    <Link to={p.id}>View</Link>
                  </td>
                </tr>
              ))}
              {paginated.length === 0 && (
                <tr>
                  <td colSpan={6} className="tw-py-8 tw-text-center tw-text-gray-500">
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="tw-flex tw-justify-between tw-items-center tw-px-6 tw-py-4 tw-border-t tw-border-gray-800">
          <div className="tw-flex tw-items-center tw-space-x-2">
            <span className="tw-text-[#A79C9C] tw-text-sm">Rows per page:</span>
            <select
              value={rowsPerPage}
              onChange={e => {
                setRowsPerPage(Number(e.target.value))
                setPage(0)
              }}
              className="tw-bg-[#202020] tw-border tw-border-[#505050] tw-text-[#A79C9C] tw-text-sm tw-rounded-md tw-py-1 tw-pl-2 tw-pr-6"
            >
              {[5, 10, 20, 50].map(n => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
          <div className="tw-flex tw-items-center tw-space-x-2">
            <button onClick={() => setPage(p => Math.max(p - 1, 0))} disabled={page === 0} className="disabled:tw-opacity-50">
              <ChevronLeft size={20} className="tw-text-[#A79C9C]" />
            </button>
            <span className="tw-text-[#A79C9C] tw-text-sm">
              {from}–{to} of {total}
            </span>
            <button onClick={() => setPage(p => Math.min(p + 1, maxPage))} disabled={page === maxPage} className="disabled:tw-opacity-50">
              <ChevronRight size={20} className="tw-text-[#A79C9C]" />
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default ProductsPage
