'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  mockProducts,
  formatCurrency,
  type Product,
} from '@/lib/mock-data'
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Package,
  AlertTriangle,
} from 'lucide-react'

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>(mockProducts)
  const [searchTerm, setSearchTerm] = useState('')
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    costPrice: 0,
    suggestedPrice: 0,
    stock: 0,
    category: '',
    sku: '',
  })

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const openCreateDialog = () => {
    setEditingProduct(null)
    setFormData({
      name: '',
      description: '',
      costPrice: 0,
      suggestedPrice: 0,
      stock: 0,
      category: '',
      sku: '',
    })
    setIsDialogOpen(true)
  }

  const openEditDialog = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      description: product.description,
      costPrice: product.costPrice,
      suggestedPrice: product.suggestedPrice,
      stock: product.stock,
      category: product.category,
      sku: product.sku,
    })
    setIsDialogOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingProduct) {
      setProducts(products.map((p) =>
        p.id === editingProduct.id
          ? { ...p, ...formData }
          : p
      ))
    } else {
      const newProduct: Product = {
        id: `prod-${Date.now()}`,
        ...formData,
        image: '/placeholder.svg?height=200&width=200',
        createdAt: new Date().toISOString(),
      }
      setProducts([...products, newProduct])
    }
    setIsDialogOpen(false)
  }

  const handleDelete = (id: string) => {
    if (confirm('ต้องการลบสินค้านี้หรือไม่?')) {
      setProducts(products.filter((p) => p.id !== id))
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-500 mt-1">จัดการสินค้าในระบบ</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={openCreateDialog}
              className="bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600 text-white shadow-lg shadow-sky-200/50 rounded-xl"
            >
              <Plus className="w-4 h-4 mr-2" />
              เพิ่มสินค้า
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl">
                {editingProduct ? 'แก้ไขสินค้า' : 'เพิ่มสินค้าใหม่'}
              </DialogTitle>
              <DialogDescription>
                {editingProduct ? 'แก้ไขข้อมูลสินค้าในระบบ' : 'กรอกข้อมูลสินค้าใหม่'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div>
                <label className="text-sm font-medium text-gray-700">ชื่อสินค้า</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1.5 rounded-xl"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">รายละเอียด</label>
                <Input
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="mt-1.5 rounded-xl"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">ราคาทุน</label>
                  <Input
                    type="number"
                    value={formData.costPrice}
                    onChange={(e) => setFormData({ ...formData, costPrice: Number(e.target.value) })}
                    className="mt-1.5 rounded-xl"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">ราคาแนะนำ</label>
                  <Input
                    type="number"
                    value={formData.suggestedPrice}
                    onChange={(e) => setFormData({ ...formData, suggestedPrice: Number(e.target.value) })}
                    className="mt-1.5 rounded-xl"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">สต๊อก</label>
                  <Input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                    className="mt-1.5 rounded-xl"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">SKU</label>
                  <Input
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="mt-1.5 rounded-xl"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">หมวดหมู่</label>
                <Input
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="mt-1.5 rounded-xl"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="rounded-xl">
                  ยกเลิก
                </Button>
                <Button type="submit" className="bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600 text-white rounded-xl">
                  {editingProduct ? 'บันทึก' : 'เพิ่มสินค้า'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <Card className="border border-gray-100 shadow-sm rounded-2xl">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="ค้นหาสินค้า..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-12 rounded-xl border-gray-200"
            />
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card className="border border-gray-100 shadow-sm rounded-2xl overflow-hidden">
        <CardHeader className="pb-4 bg-gray-50/50">
          <CardTitle className="text-xl flex items-center gap-2">
            <div className="w-8 h-8 bg-sky-100 rounded-lg flex items-center justify-center">
              <Package className="w-4 h-4 text-sky-600" />
            </div>
            สินค้าทั้งหมด ({filteredProducts.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left py-4 px-6 font-semibold text-gray-600 text-sm">สินค้า</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-600 text-sm">SKU</th>
                  <th className="text-right py-4 px-6 font-semibold text-gray-600 text-sm">ราคาทุน</th>
                  <th className="text-right py-4 px-6 font-semibold text-gray-600 text-sm">ราคาแนะนำ</th>
                  <th className="text-center py-4 px-6 font-semibold text-gray-600 text-sm">สต๊อก</th>
                  <th className="text-center py-4 px-6 font-semibold text-gray-600 text-sm">จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product, index) => (
                  <tr 
                    key={product.id} 
                    className={`border-b border-gray-50 hover:bg-sky-50/30 transition-colors ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
                    }`}
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-gray-100 to-gray-50 rounded-xl flex items-center justify-center">
                          <Package className="w-7 h-7 text-gray-400" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{product.name}</p>
                          <p className="text-sm text-gray-500">{product.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-mono text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                        {product.sku}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right font-semibold text-gray-900">
                      {formatCurrency(product.costPrice)}
                    </td>
                    <td className="py-4 px-6 text-right font-semibold text-emerald-600">
                      {formatCurrency(product.suggestedPrice)}
                    </td>
                    <td className="py-4 px-6 text-center">
                      {product.stock < 10 ? (
                        <Badge className="bg-red-100 text-red-700 border-red-200 font-semibold">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          {product.stock}
                        </Badge>
                      ) : (
                        <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 font-semibold">
                          {product.stock}
                        </Badge>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditDialog(product)}
                          className="text-sky-600 hover:text-sky-700 hover:bg-sky-100 rounded-lg"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(product.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-100 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
