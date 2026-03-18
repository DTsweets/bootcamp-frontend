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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useAuth } from '@/lib/auth-context'
import {
  getOrdersByReseller,
  formatCurrency,
  formatDateTime,
  type Order,
} from '@/lib/mock-data'
import {
  Search,
  ShoppingCart,
  Eye,
  Truck,
  Package,
  CheckCircle,
  Clock,
  XCircle,
} from 'lucide-react'

export default function ResellerOrders() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  if (!user) return null

  const allOrders = getOrdersByReseller(user.id)

  const filteredOrders = allOrders
    .filter((o) => {
      const matchesSearch =
        o.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.customerName.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === 'all' || o.status === statusFilter
      return matchesSearch && matchesStatus
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  const getStatusBadge = (status: string) => {
    const config: Record<string, { style: string; icon: React.ReactNode; label: string }> = {
      pending: { style: 'bg-yellow-100 text-yellow-700', icon: <Clock className="w-3 h-3" />, label: 'รอยืนยัน' },
      confirmed: { style: 'bg-blue-100 text-blue-700', icon: <Package className="w-3 h-3" />, label: 'ยืนยันแล้ว' },
      shipped: { style: 'bg-purple-100 text-purple-700', icon: <Truck className="w-3 h-3" />, label: 'กำลังจัดส่ง' },
      delivered: { style: 'bg-green-100 text-green-700', icon: <CheckCircle className="w-3 h-3" />, label: 'จัดส่งแล้ว' },
      cancelled: { style: 'bg-red-100 text-red-700', icon: <XCircle className="w-3 h-3" />, label: 'ยกเลิก' },
    }
    const { style, icon, label } = config[status] || config.pending
    return (
      <Badge className={`${style} flex items-center gap-1`}>
        {icon}
        {label}
      </Badge>
    )
  }

  // Stats
  const totalOrders = allOrders.length
  const pendingOrders = allOrders.filter(o => o.status === 'pending' || o.status === 'confirmed').length
  const deliveredOrders = allOrders.filter(o => o.status === 'delivered').length
  const totalProfit = allOrders
    .filter(o => o.paymentStatus === 'paid')
    .reduce((sum, o) => sum + o.resellerProfit, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        <p className="text-gray-500">ออเดอร์ทั้งหมดของร้านคุณ</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 text-pink-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">ทั้งหมด</p>
                <p className="text-xl font-bold text-gray-900">{totalOrders}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">รอดำเนินการ</p>
                <p className="text-xl font-bold text-gray-900">{pendingOrders}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">จัดส่งแล้ว</p>
                <p className="text-xl font-bold text-gray-900">{deliveredOrders}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm bg-gradient-to-r from-pink-500 to-pink-600 text-white">
          <CardContent className="p-4">
            <div>
              <p className="text-xs text-pink-100">กำไรรวม</p>
              <p className="text-xl font-bold">{formatCurrency(totalProfit)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search & Filter */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="ค้นหาออเดอร์..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="สถานะ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ทั้งหมด</SelectItem>
                <SelectItem value="pending">รอยืนยัน</SelectItem>
                <SelectItem value="confirmed">ยืนยันแล้ว</SelectItem>
                <SelectItem value="shipped">กำลังจัดส่ง</SelectItem>
                <SelectItem value="delivered">จัดส่งแล้ว</SelectItem>
                <SelectItem value="cancelled">ยกเลิก</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders List */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-pink-600" />
            รายการออเดอร์ ({filteredOrders.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">ไม่มีออเดอร์</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-pink-600">{order.orderNumber}</span>
                      {getStatusBadge(order.status)}
                    </div>
                    <p className="text-sm text-gray-700">{order.customerName}</p>
                    <p className="text-xs text-gray-500">
                      {order.items.map(i => `${i.productName} x${i.quantity}`).join(', ')}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">{formatDateTime(order.createdAt)}</p>
                  </div>
                  <div className="text-right ml-4">
                    <p className="font-bold text-gray-900">{formatCurrency(order.totalAmount)}</p>
                    <p className="text-sm text-green-600">+{formatCurrency(order.resellerProfit)}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedOrder(order)}
                      className="mt-1 text-pink-600 hover:text-pink-700 hover:bg-pink-50"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      ดูรายละเอียด
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Order Detail Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>รายละเอียดออเดอร์ {selectedOrder?.orderNumber}</DialogTitle>
            <DialogDescription>ข้อมูลออเดอร์และสถานะการจัดส่ง</DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">สถานะ</span>
                {getStatusBadge(selectedOrder.status)}
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-500 mb-2">ข้อมูลลูกค้า</p>
                <p className="font-medium">{selectedOrder.customerName}</p>
                <p className="text-sm text-gray-600">{selectedOrder.customerPhone}</p>
                <p className="text-sm text-gray-600">{selectedOrder.customerAddress}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-2">รายการสินค้า</p>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <div>
                        <p className="font-medium">{item.productName}</p>
                        <p className="text-sm text-gray-500">x{item.quantity}</p>
                      </div>
                      <p className="font-medium">{formatCurrency(item.unitPrice * item.quantity)}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">ยอดรวม</span>
                  <span className="font-bold">{formatCurrency(selectedOrder.totalAmount)}</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>กำไรของคุณ</span>
                  <span className="font-bold">+{formatCurrency(selectedOrder.resellerProfit)}</span>
                </div>
              </div>

              <div className="text-sm text-gray-500">
                <p>สั่งซื้อเมื่อ: {formatDateTime(selectedOrder.createdAt)}</p>
                <p>อัปเดตล่าสุด: {formatDateTime(selectedOrder.updatedAt)}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
