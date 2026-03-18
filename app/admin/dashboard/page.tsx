'use client'

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  mockOrders,
  mockProducts,
  mockUsers,
  formatCurrency,
  formatDateTime,
  getResellerById,
} from '@/lib/mock-data'
import {
  DollarSign,
  TrendingUp,
  Users,
  Truck,
  Clock,
  AlertTriangle,
  Package,
  ShoppingCart,
  ArrowUpRight,
  Pencil,
} from 'lucide-react'

export default function AdminDashboard() {
  // Calculate stats
  const totalSales = mockOrders.reduce((sum, o) => sum + o.totalAmount, 0)
  const adminRevenue = mockOrders
    .filter(o => o.paymentStatus === 'paid')
    .reduce((sum, o) => sum + o.adminRevenue, 0)
  const totalResellerProfit = mockOrders
    .filter(o => o.paymentStatus === 'paid')
    .reduce((sum, o) => sum + o.resellerProfit, 0)
  const pendingShipments = mockOrders.filter(o => o.status === 'confirmed' || o.status === 'pending').length
  const approvedResellers = mockUsers.filter(u => u.role === 'reseller' && u.status === 'approved').length
  const pendingResellers = mockUsers.filter(u => u.role === 'reseller' && u.status === 'pending').length
  const lowStockProducts = mockProducts.filter(p => p.stock < 10)
  const recentOrders = [...mockOrders].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ).slice(0, 5)

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'bg-amber-100 text-amber-700 border-amber-200',
      confirmed: 'bg-blue-100 text-blue-700 border-blue-200',
      shipped: 'bg-purple-100 text-purple-700 border-purple-200',
      delivered: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      cancelled: 'bg-red-100 text-red-700 border-red-200',
    }
    const labels: Record<string, string> = {
      pending: 'รอยืนยัน',
      confirmed: 'ยืนยันแล้ว',
      shipped: 'กำลังจัดส่ง',
      delivered: 'จัดส่งแล้ว',
      cancelled: 'ยกเลิก',
    }
    return (
      <Badge variant="outline" className={cn(styles[status] || 'bg-gray-100 text-gray-700', 'text-xs font-medium')}>
        {labels[status] || status}
      </Badge>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">ภาพรวมระบบจัดการตัวแทนจำหน่าย</p>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Sales */}
        <Card className="border-0 shadow-lg shadow-sky-100/50 bg-gradient-to-br from-sky-500 to-sky-600 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
          <CardContent className="p-6 relative">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sky-100 text-sm font-medium">ยอดขายรวม</p>
                <p className="text-3xl font-bold mt-2">{formatCurrency(totalSales)}</p>
                <p className="text-sky-200 text-xs mt-2">จากออเดอร์ทั้งหมด</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Admin Revenue */}
        <Card className="border-0 shadow-lg shadow-emerald-100/50 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
          <CardContent className="p-6 relative">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-emerald-100 text-sm font-medium">รายได้ Admin (สุทธิ)</p>
                <p className="text-3xl font-bold mt-2">{formatCurrency(adminRevenue)}</p>
                <p className="text-emerald-200 text-xs mt-2">ตัวแทนได้ {formatCurrency(totalResellerProfit)}</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reseller Profit */}
        <Card className="border-0 shadow-lg shadow-purple-100/50 bg-gradient-to-br from-purple-500 to-purple-600 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
          <CardContent className="p-6 relative">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">รายได้ตัวแทนรวม</p>
                <p className="text-3xl font-bold mt-2">{formatCurrency(totalResellerProfit)}</p>
                <p className="text-purple-200 text-xs mt-2">จากร้านทั้งหมด</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pending Shipments */}
        <Card className="border-0 shadow-lg shadow-amber-100/50 bg-gradient-to-br from-amber-500 to-orange-500 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
          <CardContent className="p-6 relative">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-amber-100 text-sm font-medium">รอจัดส่ง</p>
                <p className="text-3xl font-bold mt-2">{pendingShipments}</p>
                <p className="text-amber-200 text-xs mt-2">ออเดอร์</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Truck className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <Card className="border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-100 to-emerald-50 rounded-2xl flex items-center justify-center">
                <Users className="w-7 h-7 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">ตัวแทนอนุมัติ</p>
                <p className="text-3xl font-bold text-gray-900">{approvedResellers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-amber-100 to-amber-50 rounded-2xl flex items-center justify-center">
                <Clock className="w-7 h-7 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">รออนุมัติ</p>
                <p className="text-3xl font-bold text-gray-900">{pendingResellers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-red-100 to-red-50 rounded-2xl flex items-center justify-center">
                <AlertTriangle className="w-7 h-7 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">สต๊อกต่ำ</p>
                <p className="text-3xl font-bold text-gray-900">{lowStockProducts.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders & Low Stock */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <Card className="lg:col-span-2 border border-gray-100 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl flex items-center gap-2">
                <div className="w-8 h-8 bg-sky-100 rounded-lg flex items-center justify-center">
                  <ShoppingCart className="w-4 h-4 text-sky-600" />
                </div>
                ออเดอร์ล่าสุด
              </CardTitle>
              <a href="/admin/orders" className="text-sm text-sky-600 hover:text-sky-700 font-medium flex items-center gap-1">
                ดูทั้งหมด
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentOrders.map((order) => {
                const reseller = getResellerById(order.resellerId)
                return (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-900">{order.orderNumber}</span>
                        {getStatusBadge(order.status)}
                      </div>
                      <p className="text-sm text-gray-500 truncate">
                        {reseller?.shopName || 'Unknown'} - {order.customerName}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">{formatDateTime(order.createdAt)}</p>
                    </div>
                    <div className="text-right ml-4">
                      <p className="font-bold text-gray-900">{formatCurrency(order.totalAmount)}</p>
                      <p className="text-xs text-emerald-600 font-medium">+{formatCurrency(order.resellerProfit)} กำไร</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Low Stock */}
        <Card className="border border-gray-100 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl flex items-center gap-2">
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                  <Package className="w-4 h-4 text-red-600" />
                </div>
                สต๊อกต่ำ
              </CardTitle>
              <Link href="/admin/products" className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1">
                จัดการสต๊อก
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {lowStockProducts.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Package className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 text-sm">ไม่มีสินค้าสต๊อกต่ำ</p>
                </div>
              ) : (
                lowStockProducts.map((product) => (
                  <Link
                    key={product.id}
                    href="/admin/products"
                    className="flex items-center justify-between p-4 bg-red-50 hover:bg-red-100 rounded-xl transition-colors cursor-pointer group"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 truncate group-hover:text-red-700">{product.name}</p>
                      <p className="text-xs text-gray-500 mt-1">SKU: {product.sku}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-red-100 text-red-700 border-red-200 font-semibold">
                        เหลือ {product.stock}
                      </Badge>
                      <Button size="sm" variant="ghost" className="opacity-0 group-hover:opacity-100 transition-opacity text-red-600 hover:text-red-700 hover:bg-red-200 h-8 w-8 p-0">
                        <Pencil className="w-4 h-4" />
                      </Button>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ')
}
