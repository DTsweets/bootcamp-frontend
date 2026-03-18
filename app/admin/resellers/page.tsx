'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  mockUsers,
  mockOrders,
  formatCurrency,
  formatDate,
  type User,
} from '@/lib/mock-data'
import {
  Search,
  Users,
  Check,
  X,
  Store,
  ShoppingCart,
  TrendingUp,
} from 'lucide-react'

export default function AdminResellers() {
  const [users, setUsers] = useState<User[]>(mockUsers.filter(u => u.role === 'reseller'))
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const filteredResellers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.shopName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || u.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleApprove = (id: string) => {
    setUsers(users.map((u) =>
      u.id === id ? { ...u, status: 'approved' as const } : u
    ))
  }

  const handleReject = (id: string) => {
    setUsers(users.map((u) =>
      u.id === id ? { ...u, status: 'rejected' as const } : u
    ))
  }

  const getResellerStats = (resellerId: string) => {
    const orders = mockOrders.filter(o => o.resellerId === resellerId)
    const totalSales = orders.reduce((sum, o) => sum + o.totalAmount, 0)
    const totalProfit = orders
      .filter(o => o.paymentStatus === 'paid')
      .reduce((sum, o) => sum + o.resellerProfit, 0)
    return { orderCount: orders.length, totalSales, totalProfit }
  }

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'bg-amber-100 text-amber-700 border-amber-200',
      approved: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      rejected: 'bg-red-100 text-red-700 border-red-200',
    }
    const labels: Record<string, string> = {
      pending: 'รออนุมัติ',
      approved: 'อนุมัติแล้ว',
      rejected: 'ปฏิเสธ',
    }
    return (
      <Badge variant="outline" className={`${styles[status] || 'bg-gray-100 text-gray-700'} font-medium`}>
        {labels[status] || status}
      </Badge>
    )
  }

  const pendingCount = users.filter(u => u.status === 'pending').length
  const approvedCount = users.filter(u => u.status === 'approved').length

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Resellers</h1>
        <p className="text-gray-500 mt-1">จัดการตัวแทนจำหน่ายในระบบ</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <Card className="border border-gray-100 shadow-sm hover:shadow-md transition-shadow rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-sky-100 to-sky-50 rounded-2xl flex items-center justify-center">
                <Users className="w-7 h-7 text-sky-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">ตัวแทนทั้งหมด</p>
                <p className="text-3xl font-bold text-gray-900">{users.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-100 shadow-sm hover:shadow-md transition-shadow rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-100 to-emerald-50 rounded-2xl flex items-center justify-center">
                <Check className="w-7 h-7 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">อนุมัติแล้ว</p>
                <p className="text-3xl font-bold text-gray-900">{approvedCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-100 shadow-sm hover:shadow-md transition-shadow rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-amber-100 to-amber-50 rounded-2xl flex items-center justify-center">
                <Store className="w-7 h-7 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">รออนุมัติ</p>
                <p className="text-3xl font-bold text-gray-900">{pendingCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search & Filter */}
      <Card className="border border-gray-100 shadow-sm rounded-2xl">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="ค้นหาตัวแทน..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-12 rounded-xl border-gray-200"
              />
            </div>
            <div className="flex gap-2">
              {['all', 'pending', 'approved', 'rejected'].map((status) => (
                <Button
                  key={status}
                  variant={statusFilter === status ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter(status)}
                  className={`rounded-xl ${
                    statusFilter === status 
                      ? 'bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600 text-white' 
                      : ''
                  }`}
                >
                  {status === 'all' ? 'ทั้งหมด' : 
                   status === 'pending' ? 'รออนุมัติ' :
                   status === 'approved' ? 'อนุมัติแล้ว' : 'ปฏิเสธ'}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resellers Table */}
      <Card className="border border-gray-100 shadow-sm rounded-2xl overflow-hidden">
        <CardHeader className="pb-4 bg-gray-50/50">
          <CardTitle className="text-xl flex items-center gap-2">
            <div className="w-8 h-8 bg-sky-100 rounded-lg flex items-center justify-center">
              <Users className="w-4 h-4 text-sky-600" />
            </div>
            รายชื่อตัวแทน ({filteredResellers.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left py-4 px-6 font-semibold text-gray-600 text-sm">ตัวแทน</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-600 text-sm">ร้านค้า</th>
                  <th className="text-center py-4 px-6 font-semibold text-gray-600 text-sm">ออเดอร์</th>
                  <th className="text-right py-4 px-6 font-semibold text-gray-600 text-sm">ยอดขาย</th>
                  <th className="text-right py-4 px-6 font-semibold text-gray-600 text-sm">กำไร</th>
                  <th className="text-center py-4 px-6 font-semibold text-gray-600 text-sm">สถานะ</th>
                  <th className="text-center py-4 px-6 font-semibold text-gray-600 text-sm">จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {filteredResellers.map((reseller, index) => {
                  const stats = getResellerStats(reseller.id)
                  return (
                    <tr 
                      key={reseller.id} 
                      className={`border-b border-gray-50 hover:bg-sky-50/30 transition-colors ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
                      }`}
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-sky-400 to-indigo-500 rounded-xl flex items-center justify-center shadow-md">
                            <span className="font-bold text-white">
                              {reseller.name.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{reseller.name}</p>
                            <p className="text-sm text-gray-500">{reseller.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <Store className="w-4 h-4 text-gray-400" />
                          <span className="font-medium text-gray-700">{reseller.shopName || '-'}</span>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">
                          สมัคร: {formatDate(reseller.createdAt)}
                        </p>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <div className="flex items-center justify-center gap-1.5 text-gray-700">
                          <ShoppingCart className="w-4 h-4 text-gray-400" />
                          <span className="font-semibold">{stats.orderCount}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-right font-semibold text-gray-900">
                        {formatCurrency(stats.totalSales)}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5 text-emerald-600 font-semibold">
                          <TrendingUp className="w-4 h-4" />
                          {formatCurrency(stats.totalProfit)}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-center">
                        {getStatusBadge(reseller.status)}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-center gap-1">
                          {reseller.status === 'pending' && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleApprove(reseller.id)}
                                className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-100 rounded-lg"
                              >
                                <Check className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleReject(reseller.id)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-100 rounded-lg"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                          {reseller.status === 'approved' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleReject(reseller.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-100 rounded-lg"
                            >
                              <X className="w-4 h-4 mr-1" />
                              ระงับ
                            </Button>
                          )}
                          {reseller.status === 'rejected' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleApprove(reseller.id)}
                              className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-100 rounded-lg"
                            >
                              <Check className="w-4 h-4 mr-1" />
                              อนุมัติ
                            </Button>
                          )}
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
    </div>
  )
}
