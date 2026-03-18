'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  mockOrders,
  mockUsers,
  formatCurrency,
} from '@/lib/mock-data'
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  Truck,
  Store,
  Package,
  BarChart3,
  Award,
  ArrowUpRight,
} from 'lucide-react'

export default function AdminReports() {
  // Calculate overall stats
  const paidOrders = mockOrders.filter(o => o.paymentStatus === 'paid')
  const totalSales = paidOrders.reduce((sum, o) => sum + o.totalAmount, 0)
  const adminCost = paidOrders.reduce((sum, o) => sum + o.adminRevenue, 0)
  const totalResellerProfit = paidOrders.reduce((sum, o) => sum + o.resellerProfit, 0)
  const deliveredOrders = mockOrders.filter(o => o.status === 'delivered').length

  // Calculate sales per shop
  const resellers = mockUsers.filter(u => u.role === 'reseller' && u.status === 'approved')
  const shopSales = resellers.map(reseller => {
    const orders = mockOrders.filter(o => o.resellerId === reseller.id && o.paymentStatus === 'paid')
    const sales = orders.reduce((sum, o) => sum + o.totalAmount, 0)
    const profit = orders.reduce((sum, o) => sum + o.resellerProfit, 0)
    return {
      id: reseller.id,
      shopName: reseller.shopName || reseller.name,
      orderCount: orders.length,
      sales,
      profit,
    }
  }).sort((a, b) => b.sales - a.sales)

  // Calculate best selling products
  const productSales: Record<string, { name: string; quantity: number; revenue: number }> = {}
  paidOrders.forEach(order => {
    order.items.forEach(item => {
      if (!productSales[item.productId]) {
        productSales[item.productId] = { name: item.productName, quantity: 0, revenue: 0 }
      }
      productSales[item.productId].quantity += item.quantity
      productSales[item.productId].revenue += item.unitPrice * item.quantity
    })
  })
  const bestSellers = Object.values(productSales).sort((a, b) => b.quantity - a.quantity).slice(0, 5)

  // Profit/Loss Summary
  const netProfit = totalSales - adminCost
  const profitMargin = totalSales > 0 ? ((netProfit / totalSales) * 100).toFixed(1) : '0'

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
        <p className="text-gray-500 mt-1">สรุปรายงานยอดขายและผลการดำเนินงาน</p>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="border-0 shadow-lg shadow-sky-100/50 bg-gradient-to-br from-sky-500 to-sky-600 text-white overflow-hidden relative rounded-2xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
          <CardContent className="p-6 relative">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sky-100 text-sm font-medium">ยอดขายรวม</p>
                <p className="text-3xl font-bold mt-2">{formatCurrency(totalSales)}</p>
                <p className="text-sky-200 text-xs mt-2">จากออเดอร์ที่ชำระแล้ว</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg shadow-emerald-100/50 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white overflow-hidden relative rounded-2xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
          <CardContent className="p-6 relative">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-emerald-100 text-sm font-medium">รายได้ Admin (ต้นทุน)</p>
                <p className="text-3xl font-bold mt-2">{formatCurrency(adminCost)}</p>
                <p className="text-emerald-200 text-xs mt-2">ต้นทุนสินค้าทั้งหมด</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg shadow-purple-100/50 bg-gradient-to-br from-purple-500 to-purple-600 text-white overflow-hidden relative rounded-2xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
          <CardContent className="p-6 relative">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">กำไรรวมของตัวแทน</p>
                <p className="text-3xl font-bold mt-2">{formatCurrency(totalResellerProfit)}</p>
                <p className="text-purple-200 text-xs mt-2">ตัวแทนได้รับทั้งหมด</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg shadow-green-100/50 bg-gradient-to-br from-green-500 to-green-600 text-white overflow-hidden relative rounded-2xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
          <CardContent className="p-6 relative">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">ออเดอร์จัดส่งแล้ว</p>
                <p className="text-3xl font-bold mt-2">{deliveredOrders}</p>
                <p className="text-green-200 text-xs mt-2">สำเร็จ</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Truck className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Profit Summary */}
      <Card className="border border-gray-100 shadow-sm rounded-2xl overflow-hidden">
        <CardHeader className="pb-4 bg-gray-50/50">
          <CardTitle className="text-xl flex items-center gap-2">
            <div className="w-8 h-8 bg-sky-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-sky-600" />
            </div>
            สรุปกำไรขาดทุน
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-sky-50 to-sky-100/50 rounded-2xl p-6 text-center">
              <div className="w-12 h-12 bg-sky-200 rounded-xl flex items-center justify-center mx-auto mb-4">
                <ShoppingCart className="w-6 h-6 text-sky-700" />
              </div>
              <p className="text-sm text-gray-600 mb-2 font-medium">ยอดขายรวม</p>
              <p className="text-3xl font-bold text-sky-700">{formatCurrency(totalSales)}</p>
            </div>
            <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-2xl p-6 text-center">
              <div className="w-12 h-12 bg-amber-200 rounded-xl flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-6 h-6 text-amber-700" />
              </div>
              <p className="text-sm text-gray-600 mb-2 font-medium">ต้นทุน (Admin Revenue)</p>
              <p className="text-3xl font-bold text-amber-700">{formatCurrency(adminCost)}</p>
            </div>
            <div className={`rounded-2xl p-6 text-center ${netProfit >= 0 ? 'bg-gradient-to-br from-emerald-50 to-emerald-100/50' : 'bg-gradient-to-br from-red-50 to-red-100/50'}`}>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 ${netProfit >= 0 ? 'bg-emerald-200' : 'bg-red-200'}`}>
                {netProfit >= 0 ? (
                  <TrendingUp className="w-6 h-6 text-emerald-700" />
                ) : (
                  <TrendingDown className="w-6 h-6 text-red-700" />
                )}
              </div>
              <p className="text-sm text-gray-600 mb-2 font-medium">กำไรสุทธิ (ตัวแทน)</p>
              <p className={`text-3xl font-bold ${netProfit >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
                {formatCurrency(totalResellerProfit)}
              </p>
              <p className={`text-sm mt-2 font-medium ${netProfit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                {netProfit >= 0 ? (
                  <span className="flex items-center justify-center gap-1">
                    <ArrowUpRight className="w-4 h-4" />
                    Margin {profitMargin}%
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-1">
                    <TrendingDown className="w-4 h-4" />
                    Loss
                  </span>
                )}
              </p>
            </div>
          </div>

          <div className="mt-6 p-5 bg-gradient-to-r from-pink-50 to-sky-50 rounded-xl border border-pink-100">
            <p className="text-sm text-gray-700">
              <strong className="text-gray-800">หมายเหตุ:</strong> ตัวแทนได้รับกำไร = ราคาที่ตั้งขาย - ราคาทุนสินค้า x จำนวนที่ขายได้
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales by Shop */}
        <Card className="border border-gray-100 shadow-sm rounded-2xl overflow-hidden">
          <CardHeader className="pb-4 bg-gray-50/50">
            <CardTitle className="text-xl flex items-center gap-2">
              <div className="w-8 h-8 bg-sky-100 rounded-lg flex items-center justify-center">
                <Store className="w-4 h-4 text-sky-600" />
              </div>
              ยอดขายแต่ละร้าน
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {shopSales.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Store className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500">ไม่มีข้อมูล</p>
                </div>
              ) : (
                shopSales.map((shop, index) => (
                  <div
                    key={shop.id}
                    className="flex items-center justify-between p-4 bg-gray-50 hover:bg-sky-50/50 rounded-xl transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-md ${
                        index === 0 ? 'bg-gradient-to-br from-amber-400 to-amber-500' : 
                        index === 1 ? 'bg-gradient-to-br from-gray-400 to-gray-500' : 
                        index === 2 ? 'bg-gradient-to-br from-amber-600 to-amber-700' : 
                        'bg-gray-300'
                      }`}>
                        {index === 0 ? <Award className="w-5 h-5" /> : index + 1}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{shop.shopName}</p>
                        <p className="text-xs text-gray-500">{shop.orderCount} ออเดอร์</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">{formatCurrency(shop.sales)}</p>
                      <p className="text-xs text-emerald-600 font-medium">กำไร {formatCurrency(shop.profit)}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Best Selling Products */}
        <Card className="border border-gray-100 shadow-sm rounded-2xl overflow-hidden">
          <CardHeader className="pb-4 bg-gray-50/50">
            <CardTitle className="text-xl flex items-center gap-2">
              <div className="w-8 h-8 bg-sky-100 rounded-lg flex items-center justify-center">
                <Package className="w-4 h-4 text-sky-600" />
              </div>
              สินค้าขายดี
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {bestSellers.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Package className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500">ไม่มีข้อมูล</p>
                </div>
              ) : (
                bestSellers.map((product, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-50 hover:bg-sky-50/50 rounded-xl transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-md ${
                        index === 0 ? 'bg-gradient-to-br from-amber-400 to-amber-500' : 
                        index === 1 ? 'bg-gradient-to-br from-gray-400 to-gray-500' : 
                        index === 2 ? 'bg-gradient-to-br from-amber-600 to-amber-700' : 
                        'bg-gray-300'
                      }`}>
                        {index === 0 ? <Award className="w-5 h-5" /> : index + 1}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{product.name}</p>
                        <p className="text-xs text-gray-500">ขายได้ {product.quantity} ชิ้น</p>
                      </div>
                    </div>
                    <Badge className="bg-sky-100 text-sky-700 border-sky-200 font-semibold">
                      {formatCurrency(product.revenue)}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
