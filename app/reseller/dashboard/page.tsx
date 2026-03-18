'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/lib/auth-context'
import {
  getOrdersByReseller,
  getResellerProductsByReseller,
  getWalletBalance,
  getTransactionsByReseller,
  formatCurrency,
  formatDateTime,
} from '@/lib/mock-data'
import {
  Wallet,
  Truck,
  Package,
  ShoppingCart,
  Link as LinkIcon,
  ArrowUpRight,
  Copy,
  CheckCircle,
  Sparkles,
} from 'lucide-react'
import { useState } from 'react'

export default function ResellerDashboard() {
  const { user } = useAuth()
  const [copied, setCopied] = useState(false)

  if (!user) return null

  const orders = getOrdersByReseller(user.id)
  const resellerProducts = getResellerProductsByReseller(user.id)
  const walletBalance = getWalletBalance(user.id)
  const transactions = getTransactionsByReseller(user.id)

  const deliveredOrders = orders.filter(o => o.status === 'delivered').length
  const totalOrders = orders.length
  const recentOrders = [...orders].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ).slice(0, 5)
  const recentTransactions = [...transactions].sort((a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ).slice(0, 3)

  const shopLink = `https://shop.resellerhub.com/${user.shopSlug}`

  const copyLink = () => {
    navigator.clipboard.writeText(shopLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

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
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <Sparkles className="w-6 h-6 text-pink-500" />
        </div>
        <p className="text-gray-500">ยินดีต้อนรับกลับ, {user.name}!</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Wallet Balance */}
        <Card className="border-0 shadow-lg shadow-pink-100/50 bg-gradient-to-br from-pink-500 via-pink-500 to-purple-600 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12" />
          <CardContent className="p-6 relative">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-pink-100 text-sm font-medium">กำไรสะสม Wallet</p>
                <p className="text-3xl font-bold mt-2">{formatCurrency(walletBalance)}</p>
                <div className="flex items-center gap-1 mt-2">
                  <ArrowUpRight className="w-3 h-3 text-emerald-300" />
                  <span className="text-emerald-300 text-xs font-medium">+฿420 วันนี้</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Wallet className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Delivered Orders */}
        <Card className="border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">ออเดอร์จัดส่งแล้ว</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{deliveredOrders}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-emerald-50 rounded-xl flex items-center justify-center">
                <Truck className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Products in Shop */}
        <Card className="border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">สินค้าในร้าน</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{resellerProducts.length}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-sky-100 to-sky-50 rounded-xl flex items-center justify-center">
                <Package className="w-6 h-6 text-sky-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Orders */}
        <Card className="border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">ออเดอร์ทั้งหมด</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{totalOrders}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-50 rounded-xl flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Shop Link */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-sky-50 via-pink-50 to-purple-50 overflow-hidden">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-md">
                <LinkIcon className="w-7 h-7 text-pink-500" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-semibold text-gray-900">ลิ้งก์ร้านของฉัน</p>
                  <span className="flex items-center gap-1 text-xs text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                    Live
                  </span>
                </div>
                <p className="text-sm text-gray-500 font-mono">{shopLink}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={copyLink}
                className="bg-white hover:bg-gray-50 rounded-xl"
              >
                {copied ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-1.5 text-emerald-500" />
                    คัดลอกแล้ว!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-1.5" />
                    คัดลอก
                  </>
                )}
              </Button>
              <Button
                size="sm"
                className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white rounded-xl shadow-lg shadow-pink-200/50"
                onClick={() => window.open(shopLink, '_blank')}
              >
                <ArrowUpRight className="w-4 h-4 mr-1.5" />
                เปิดร้าน
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card className="border border-gray-100 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl flex items-center gap-2">
                <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center">
                  <ShoppingCart className="w-4 h-4 text-pink-600" />
                </div>
                ออเดอร์ล่าสุด
              </CardTitle>
              <a href="/reseller/orders" className="text-sm text-pink-600 hover:text-pink-700 font-medium flex items-center gap-1">
                ดูทั้งหมด
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentOrders.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <ShoppingCart className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500">ยังไม่มีออเดอร์</p>
                </div>
              ) : (
                recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-900 text-sm">{order.orderNumber}</span>
                        {getStatusBadge(order.status)}
                      </div>
                      <p className="text-xs text-gray-500">{order.customerName}</p>
                      <p className="text-xs text-gray-400 mt-1">{formatDateTime(order.createdAt)}</p>
                    </div>
                    <div className="text-right ml-4">
                      <p className="font-bold text-gray-900">{formatCurrency(order.totalAmount)}</p>
                      <p className="text-xs text-emerald-600 font-medium">+{formatCurrency(order.resellerProfit)}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card className="border border-gray-100 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl flex items-center gap-2">
                <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center">
                  <Wallet className="w-4 h-4 text-pink-600" />
                </div>
                ธุรกรรมล่าสุด
              </CardTitle>
              <a href="/reseller/wallet" className="text-sm text-pink-600 hover:text-pink-700 font-medium flex items-center gap-1">
                ดูทั้งหมด
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentTransactions.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Wallet className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500">ยังไม่มีธุรกรรม</p>
                </div>
              ) : (
                recentTransactions.map((txn) => (
                  <div
                    key={txn.id}
                    className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{txn.description}</p>
                      <p className="text-xs text-gray-400 mt-1">{formatDateTime(txn.createdAt)}</p>
                    </div>
                    <div className="text-right">
                      <p className={cn('font-bold', txn.type === 'profit' ? 'text-emerald-600' : 'text-red-600')}>
                        {txn.type === 'profit' ? '+' : '-'}{formatCurrency(txn.amount)}
                      </p>
                    </div>
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

function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ')
}
