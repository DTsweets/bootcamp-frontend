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
import {
  mockOrders,
  formatCurrency,
  formatDateTime,
  getResellerById,
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

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>(mockOrders)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  const filteredOrders = orders
    .filter((o) => {
      const reseller = getResellerById(o.resellerId)
      const matchesSearch =
        o.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reseller?.shopName?.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === 'all' || o.status === statusFilter
      return matchesSearch && matchesStatus
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  const handleStatusChange = (orderId: string, newStatus: Order['status']) => {
    setOrders(orders.map((o) =>
      o.id === orderId ? { ...o, status: newStatus, updatedAt: new Date().toISOString() } : o
    ))
    if (selectedOrder?.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus })
    }
  }

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
  const totalOrders = orders.length
  const pendingOrders = orders.filter(o => o.status === 'pending' || o.status === 'confirmed').length
  const shippedOrders = orders.filter(o => o.status === 'shipped').length
  const deliveredOrders = orders.filter(o => o.status === 'delivered').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        <p className="text-gray-500">จัดการออเดอร์ทั้งหมดในระบบ</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-sky-100 rounded-lg flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 text-sky-600" />
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
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Truck className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">กำลังส่ง</p>
                <p className="text-xl font-bold text-gray-900">{shippedOrders}</p>
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

      {/* Orders Table */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-sky-600" />
            รายการออเดอร์ ({filteredOrders.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">เลขออเดอร์</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">ร้านตัวแทน</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">ลูกค้า</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">สินค้า</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-500 text-sm">ยอดรวม</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-500 text-sm">กำไรตัวแทน</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">วันที่</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-500 text-sm">สถานะ</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-500 text-sm">จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => {
                  const reseller = getResellerById(order.resellerId)
                  return (
                    <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <span className="font-medium text-sky-600">{order.orderNumber}</span>
                      </td>
                      <td className="py-3 px-4 text-gray-700">
                        {reseller?.shopName || '-'}
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-gray-900">{order.customerName}</p>
                        <p className="text-xs text-gray-500">{order.customerPhone}</p>
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-gray-700 text-sm">
                          {order.items.map(i => `${i.productName} x${i.quantity}`).join(', ')}
                        </p>
                      </td>
                      <td className="py-3 px-4 text-right font-medium text-gray-900">
                        {formatCurrency(order.totalAmount)}
                      </td>
                      <td className="py-3 px-4 text-right text-green-600">
                        +{formatCurrency(order.resellerProfit)}
                      </td>
                      <td className="py-3 px-4 text-gray-500 text-sm">
                        {formatDateTime(order.createdAt)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {getStatusBadge(order.status)}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedOrder(order)}
                            className="text-sky-600 hover:text-sky-700 hover:bg-sky-50"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Order Detail Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>รายละเอียดออเดอร์ {selectedOrder?.orderNumber}</DialogTitle>
            <DialogDescription>ข้อมูลออเดอร์และการจัดการสถานะ</DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">ร้านตัวแทน</p>
                  <p className="font-medium">{getResellerById(selectedOrder.resellerId)?.shopName}</p>
                </div>
                <div>
                  <p className="text-gray-500">วันที่สั่งซื้อ</p>
                  <p className="font-medium">{formatDateTime(selectedOrder.createdAt)}</p>
                </div>
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
                  <span>กำไรตัวแทน</span>
                  <span className="font-medium">+{formatCurrency(selectedOrder.resellerProfit)}</span>
                </div>
                <div className="flex justify-between text-sky-600">
                  <span>รายได้ Admin</span>
                  <span className="font-medium">{formatCurrency(selectedOrder.adminRevenue)}</span>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-2">อัปเดตสถานะ</p>
                <Select
                  value={selectedOrder.status}
                  onValueChange={(value) => handleStatusChange(selectedOrder.id, value as Order['status'])}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">รอยืนยัน</SelectItem>
                    <SelectItem value="confirmed">ยืนยันแล้ว</SelectItem>
                    <SelectItem value="shipped">กำลังจัดส่ง</SelectItem>
                    <SelectItem value="delivered">จัดส่งแล้ว</SelectItem>
                    <SelectItem value="cancelled">ยกเลิก</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
