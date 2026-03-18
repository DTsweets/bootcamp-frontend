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
  type Product,
  type ResellerProduct,
} from '@/lib/mock-data'
import {
  Search,
  Package,
  Plus,
  TrendingUp,
} from 'lucide-react'

export default function ResellerProducts() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [resellerProducts, setResellerProducts] = useState<ResellerProduct[]>(mockResellerProducts)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [sellingPrice, setSellingPrice] = useState(0)

  if (!user) return null

  const myProductIds = resellerProducts
    .filter(rp => rp.resellerId === user.id)
    .map(rp => rp.productId)

  const availableProducts = mockProducts.filter(
    p => !myProductIds.includes(p.id) &&
    (p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     p.sku.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const handleAddToShop = () => {
    if (!selectedProduct || sellingPrice <= 0) return

    const newResellerProduct: ResellerProduct = {
      id: `rp-${Date.now()}`,
      resellerId: user.id,
      productId: selectedProduct.id,
      sellingPrice,
      isActive: true,
    }

    setResellerProducts([...resellerProducts, newResellerProduct])
    setSelectedProduct(null)
    setSellingPrice(0)
  }

  const openAddDialog = (product: Product) => {
    setSelectedProduct(product)
    setSellingPrice(product.suggestedPrice)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        <p className="text-gray-500">สินค้ากลาง - เลือกเพิ่มเข้าร้านของคุณ</p>
      </div>

      {/* Search */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="ค้นหาสินค้า..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {availableProducts.map((product) => {
          const potentialProfit = product.suggestedPrice - product.costPrice
          return (
            <Card key={product.id} className="border-0 shadow-sm overflow-hidden">
              <div className="h-40 bg-gray-100 flex items-center justify-center">
                <Package className="w-16 h-16 text-gray-300" />
              </div>
              <CardContent className="p-4">
                <div className="mb-2">
                  <Badge className="bg-gray-100 text-gray-600 text-xs">{product.category}</Badge>
                </div>
                <h3 className="font-medium text-gray-900 mb-1">{product.name}</h3>
                <p className="text-sm text-gray-500 mb-3 line-clamp-2">{product.description}</p>
                
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-xs text-gray-500">ราคาทุน</p>
                    <p className="font-bold text-gray-900">{formatCurrency(product.costPrice)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">ราคาแนะนำ</p>
                    <p className="font-bold text-pink-600">{formatCurrency(product.suggestedPrice)}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-2 bg-green-50 rounded-lg mb-3">
                  <div className="flex items-center gap-1 text-green-700">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm">กำไรที่คาดว่าจะได้</span>
                  </div>
                  <span className="font-bold text-green-700">{formatCurrency(potentialProfit)}</span>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                  <span>สต๊อก: {product.stock}</span>
                  <span>SKU: {product.sku}</span>
                </div>

                <Button
                  onClick={() => openAddDialog(product)}
                  className="w-full bg-pink-500 hover:bg-pink-600 text-white"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  เพิ่มเข้าร้าน
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {availableProducts.length === 0 && (
        <Card className="border-0 shadow-sm">
          <CardContent className="p-12 text-center">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">ไม่พบสินค้า หรือคุณเพิ่มสินค้าทั้งหมดเข้าร้านแล้ว</p>
          </CardContent>
        </Card>
      )}

      {/* Add to Shop Dialog */}
      <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>เพิ่มสินค้าเข้าร้าน</DialogTitle>
            <DialogDescription>ตั้งราคาขายและเพิ่มสินค้าเข้าร้านของคุณ</DialogDescription>
          </DialogHeader>
          {selectedProduct && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                  <Package className="w-8 h-8 text-gray-400" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{selectedProduct.name}</h3>
                  <p className="text-sm text-gray-500">ราคาทุน: {formatCurrency(selectedProduct.costPrice)}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">ราคาขายที่ต้องการ</label>
                <Input
                  type="number"
                  value={sellingPrice}
                  onChange={(e) => setSellingPrice(Number(e.target.value))}
                  min={selectedProduct.costPrice}
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">
                  ราคาแนะนำ: {formatCurrency(selectedProduct.suggestedPrice)}
                </p>
              </div>

              {sellingPrice > selectedProduct.costPrice && (
                <div className="p-4 bg-green-50 rounded-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-green-700">กำไรต่อชิ้น</span>
                    <span className="font-bold text-green-700">
                      {formatCurrency(sellingPrice - selectedProduct.costPrice)}
                    </span>
                  </div>
                </div>
              )}

              {sellingPrice <= selectedProduct.costPrice && sellingPrice > 0 && (
                <div className="p-4 bg-red-50 rounded-xl">
                  <p className="text-red-700 text-sm">ราคาขายต้องมากกว่าราคาทุน</p>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setSelectedProduct(null)}
                  className="flex-1"
                >
                  ยกเลิก
                </Button>
                <Button
                  onClick={handleAddToShop}
                  disabled={sellingPrice <= selectedProduct.costPrice}
                  className="flex-1 bg-pink-500 hover:bg-pink-600 text-white"
                >
                  เพิ่มเข้าร้าน
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
