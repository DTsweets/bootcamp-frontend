'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/lib/auth-context'
import {
  getOrdersByReseller,
  getTransactionsByReseller,
  formatCurrency,
  formatDateTime,
} from '@/lib/mock-data'
import {
  Wallet,
  ShoppingCart,
  TrendingUp,
  ArrowUpRight,
  History,
  Info,
  Sparkles,
} from 'lucide-react'

export default function ResellerWallet() {
  const { user } = useAuth()

  if (!user) return null

  const orders = getOrdersByReseller(user.id)
  const transactions = getTransactionsByReseller(user.id)
  const paidOrders = orders.filter(o => o.paymentStatus === 'paid')

  // Calculate stats
  const totalProfit = transactions
    .filter(t => t.type === 'profit')
    .reduce((sum, t) => sum + t.amount, 0)
  
  const totalOrders = paidOrders.length
  const avgProfitPerOrder = totalOrders > 0 ? totalProfit / totalOrders : 0
  const totalTransactions = transactions.length

  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-3xl font-bold text-gray-900">Wallet</h1>
          <Sparkles className="w-6 h-6 text-pink-500" />
        </div>
        <p className="text-gray-500">กำไรสะสมและประวัติการรับเงิน</p>
      </div>

      {/* Info Banner */}
      <div className="bg-gradient-to-r from-pink-50 via-purple-50 to-sky-50 border border-pink-100 rounded-2xl p-5 flex items-start gap-4">
        <div className="w-10 h-10 bg-pink-100 rounded-xl flex items-center justify-center shrink-0">
          <Info className="w-5 h-5 text-pink-600" />
        </div>
        <div>
          <p className="font-semibold text-gray-800 mb-1">หมายเหตุ</p>
          <p className="text-sm text-gray-600">
            กำไรในระบบนี้เป็น Wallet จำลอง แสดงผลกำไรสะสมจากทุกออเดอร์ที่ลูกค้าชำระเงินแล้ว
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Profit */}
        <Card className="border-0 shadow-lg shadow-pink-100/50 bg-gradient-to-br from-pink-500 via-pink-500 to-purple-600 text-white overflow-hidden relative rounded-2xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12" />
          <CardContent className="p-6 relative">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-pink-100 text-sm font-medium">ยอดกำไรสะสม</p>
                <p className="text-3xl font-bold mt-2">{formatCurrency(totalProfit)}</p>
                <div className="flex items-center gap-1 mt-2">
                  <ArrowUpRight className="w-3 h-3 text-emerald-300" />
                  <span className="text-emerald-300 text-xs font-medium">กำลังเพิ่มขึ้น</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Wallet className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Orders */}
        <Card className="border border-gray-100 shadow-sm hover:shadow-md transition-shadow rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">ออเดอร์ทั้งหมด</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{totalOrders}</p>
                <p className="text-xs text-gray-400 mt-2">ที่ชำระเงินแล้ว</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-sky-100 to-sky-50 rounded-xl flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-sky-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Average Profit */}
        <Card className="border border-gray-100 shadow-sm hover:shadow-md transition-shadow rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">กำไรเฉลี่ย/ออเดอร์</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{formatCurrency(avgProfitPerOrder)}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-emerald-50 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Transactions */}
        <Card className="border border-gray-100 shadow-sm hover:shadow-md transition-shadow rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">ธุรกรรมทั้งหมด</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{totalTransactions}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-50 rounded-xl flex items-center justify-center">
                <History className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transactions History */}
      <Card className="border border-gray-100 shadow-sm rounded-2xl overflow-hidden">
        <CardHeader className="pb-4 bg-gray-50/50">
          <CardTitle className="text-xl flex items-center gap-2">
            <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center">
              <History className="w-4 h-4 text-pink-600" />
            </div>
            ประวัติการรับกำไร
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {sortedTransactions.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wallet className="w-10 h-10 text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium">ยังไม่มีธุรกรรม</p>
              <p className="text-sm text-gray-400 mt-1">เมื่อมีออเดอร์ที่ชำระเงินแล้ว กำไรจะแสดงที่นี่</p>
            </div>
          ) : (
            <div className="space-y-4">
              {sortedTransactions.map((txn) => (
                <div
                  key={txn.id}
                  className="flex items-center justify-between p-4 bg-gray-50 hover:bg-pink-50/50 rounded-xl transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      txn.type === 'profit' ? 'bg-emerald-100' : 'bg-red-100'
                    }`}>
                      <ArrowUpRight className={`w-6 h-6 ${
                        txn.type === 'profit' ? 'text-emerald-600' : 'text-red-600 rotate-180'
                      }`} />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{txn.description}</p>
                      <p className="text-sm text-gray-500">{formatDateTime(txn.createdAt)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-xl font-bold ${
                      txn.type === 'profit' ? 'text-emerald-600' : 'text-red-600'
                    }`}>
                      {txn.type === 'profit' ? '+' : '-'}{formatCurrency(txn.amount)}
                    </p>
                    <Badge variant="outline" className={`font-medium ${
                      txn.type === 'profit' 
                        ? 'bg-emerald-100 text-emerald-700 border-emerald-200' 
                        : 'bg-red-100 text-red-700 border-red-200'
                    }`}>
                      {txn.type === 'profit' ? 'รับกำไร' : 'ถอนเงิน'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Summary Card */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-emerald-50 via-green-50 to-teal-50 rounded-2xl overflow-hidden">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center">
                <TrendingUp className="w-7 h-7 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg mb-1">สรุปรายได้</h3>
                <p className="text-sm text-gray-600">
                  คุณได้รับกำไรทั้งหมด <span className="font-semibold text-emerald-600">{formatCurrency(totalProfit)}</span> จาก {totalOrders} ออเดอร์
                </p>
              </div>
            </div>
            <div className="text-right bg-white/60 backdrop-blur-sm rounded-xl px-6 py-4">
              <p className="text-sm text-gray-500 mb-1">ยอดสะสมปัจจุบัน</p>
              <p className="text-4xl font-bold text-emerald-600">{formatCurrency(totalProfit)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
