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
} from '@/components/ui/dialog'
import { useAuth } from '@/lib/auth-context'
import {
  mockProducts,
  mockResellerProducts,
  formatCurrency,
  getProductById,
  type ResellerProduct,
} from '@/lib/mock-data'
import {
  Store,
  Package,
  Pencil,
  Trash2,
  Link as LinkIcon,
  TrendingUp,
  Copy,
  ArrowUpRight,
} from 'lucide-react'

export default function ResellerMyShop() {
  const { user } = useAuth()
  const [resellerProducts, setResellerProducts] = useState<ResellerProduct[]>(mockResellerProducts)
  const [editingProduct, setEditingProduct] = useState<ResellerProduct | null>(null)
  const [newPrice, setNewPrice] = useState(0)
  const [copied, setCopied] = useState(false)

  if (!user) return null

  const myProducts = resellerProducts.filter(rp => rp.resellerId === user.id)
  const shopLink = `https://shop.resellerhub.com/${user.shopSlug}`

  // Calculate total potential profit
  const totalPotentialProfit = myProducts.reduce((sum, rp) => {
    const product = getProductById(rp.productId)
    if (!product) return sum
    return sum + (rp.sellingPrice - product.costPrice) * product.stock
  }, 0)

  const copyLink = () => {
    navigator.clipboard.writeText(shopLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const openEditDialog = (rp: ResellerProduct) => {
    setEditingProduct(rp)
    setNewPrice(rp.sellingPrice)
  }

  const handleUpdatePrice = () => {
    if (!editingProduct || newPrice <= 0) return

    setResellerProducts(resellerProducts.map(rp =>
      rp.id === editingProduct.id ? { ...rp, sellingPrice: newPrice } : rp
    ))
    setEditingProduct(null)
  }

  const handleDelete = (id: string) => {
    if (confirm('ต้องการลบสินค้านี้ออกจากร้านหรือไม่?')) {
      setResellerProducts(resellerProducts.filter(rp => rp.id !== id))
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Shop</h1>
        <p className="text-gray-500">จัดการสินค้าในร้านของคุณ</p>
      </div>

      {/* Shop Link & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 border-0 shadow-sm bg-gradient-to-r from-pink-50 to-sky-50">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                  <LinkIcon className="w-6 h-6 text-pink-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">ลิ้งก์หน้าร้าน</p>
                  <p className="text-sm text-gray-500">{shopLink}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyLink}
                  className="bg-white"
                >
                  <Copy className="w-4 h-4 mr-1" />
                  {copied ? 'คัดลอกแล้ว!' : 'คัดลอก'}
                </Button>
                <Button
                  size="sm"
                  className="bg-pink-500 hover:bg-pink-600 text-white"
                  onClick={() => window.open(shopLink, '_blank')}
                >
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                  เปิดร้าน
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">กำไรรวมหากขายได้ทั้งหมด</p>
                <p className="text-xl font-bold text-green-600">{formatCurrency(totalPotentialProfit)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Products */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Store className="w-5 h-5 text-pink-600" />
            สินค้าในร้าน ({myProducts.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {myProducts.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">ยังไม่มีสินค้าในร้าน</p>
              <Button
                onClick={() => window.location.href = '/reseller/products'}
                className="bg-pink-500 hover:bg-pink-600 text-white"
              >
                เพิ่มสินค้า
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">สินค้า</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-500 text-sm">ราคาทุน</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-500 text-sm">ราคาขาย</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-500 text-sm">กำไร/ชิ้น</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-500 text-sm">สต๊อก</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-500 text-sm">จัดการ</th>
                  </tr>
                </thead>
                <tbody>
                  {myProducts.map((rp) => {
                    const product = getProductById(rp.productId)
                    if (!product) return null
                    const profit = rp.sellingPrice - product.costPrice
                    return (
                      <tr key={rp.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                              <Package className="w-6 h-6 text-gray-400" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{product.name}</p>
                              <p className="text-xs text-gray-500">{product.category}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right text-gray-600">
                          {formatCurrency(product.costPrice)}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <span className="font-bold text-pink-600">{formatCurrency(rp.sellingPrice)}</span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Badge className={profit > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                            {profit > 0 ? '+' : ''}{formatCurrency(profit)}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-center text-gray-600">
                          {product.stock}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openEditDialog(rp)}
                              className="text-sky-600 hover:text-sky-700 hover:bg-sky-50"
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(rp.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Price Dialog */}
      <Dialog open={!!editingProduct} onOpenChange={() => setEditingProduct(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>แก้ไขราคาขาย</DialogTitle>
            <DialogDescription>ปรับราคาขายสินค้าในร้านของคุณ</DialogDescription>
          </DialogHeader>
          {editingProduct && (
            <div className="space-y-4">
              {(() => {
                const product = getProductById(editingProduct.productId)
                if (!product) return null
                return (
                  <>
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                        <Package className="w-8 h-8 text-gray-400" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{product.name}</h3>
                        <p className="text-sm text-gray-500">ราคาทุน: {formatCurrency(product.costPrice)}</p>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700">ราคาขายใหม่</label>
                      <Input
                        type="number"
                        value={newPrice}
                        onChange={(e) => setNewPrice(Number(e.target.value))}
                        min={product.costPrice}
                        className="mt-1"
                      />
                    </div>

                    {newPrice > product.costPrice && (
                      <div className="p-4 bg-green-50 rounded-xl">
                        <div className="flex items-center justify-between">
                          <span className="text-green-700">กำไรต่อชิ้น</span>
                          <span className="font-bold text-green-700">
                            {formatCurrency(newPrice - product.costPrice)}
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        onClick={() => setEditingProduct(null)}
                        className="flex-1"
                      >
                        ยกเลิก
                      </Button>
                      <Button
                        onClick={handleUpdatePrice}
                        disabled={newPrice <= product.costPrice}
                        className="flex-1 bg-pink-500 hover:bg-pink-600 text-white"
                      >
                        บันทึก
                      </Button>
                    </div>
                  </>
                )
              })()}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
