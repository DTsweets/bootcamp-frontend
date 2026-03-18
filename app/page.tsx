'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Store, 
  Mail, 
  Lock, 
  ArrowRight, 
  Shield, 
  Users,
  Sparkles,
  Wallet,
  ShoppingBag,
  Zap,
} from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showNotification, setShowNotification] = useState(false)
  const { login } = useAuth()
  const router = useRouter()

  // Animate notification popup
  useEffect(() => {
    const timer = setTimeout(() => setShowNotification(true), 1000)
    return () => clearTimeout(timer)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    const result = await login(email, password)
    
    if (result.success) {
      const savedUser = localStorage.getItem('currentUser')
      if (savedUser) {
        const user = JSON.parse(savedUser)
        if (user.role === 'admin') {
          router.push('/admin/dashboard')
        } else {
          router.push('/reseller/dashboard')
        }
      }
    } else {
      setError(result.error || 'เกิดข้อผิดพลาด')
    }
    
    setIsLoading(false)
  }

  const fillTestAccount = (type: 'admin' | 'reseller1' | 'reseller2') => {
    if (type === 'admin') {
      setEmail('admin@resellerhub.com')
      setPassword('admin123')
    } else if (type === 'reseller1') {
      setEmail('minnie@shop.com')
      setPassword('minnie123')
    } else {
      setEmail('nan@shop.com')
      setPassword('nan123')
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding & Animation */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-sky-100 via-pink-50 to-sky-50 p-12 flex-col justify-between relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-sky-200/40 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-32 right-16 w-96 h-96 bg-pink-200/40 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-purple-200/30 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }} />
        
        {/* Logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-14 h-14 bg-gradient-to-br from-sky-400 via-pink-400 to-purple-400 rounded-2xl flex items-center justify-center shadow-lg shadow-pink-200/50">
              <Store className="w-8 h-8 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-sky-600 via-pink-500 to-purple-500 bg-clip-text text-transparent">
              ResellerHub
            </span>
          </div>
          <p className="text-sky-600/80 text-sm font-medium flex items-center gap-1">
            <Sparkles className="w-4 h-4" />
            ระบบตัวแทนจำหน่ายออนไลน์
          </p>
        </div>

        {/* Main Content */}
        <div className="relative z-10 space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl font-bold text-gray-800 leading-tight text-balance">
              ขายได้ทุกที่
              <br />
              <span className="bg-gradient-to-r from-sky-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">
                กำไรทุกออเดอร์
              </span>
            </h1>
            <p className="text-gray-600 text-lg max-w-md leading-relaxed">
              เปิดร้านออนไลน์ส่วนตัวฟรี · เลือกสินค้า · ตั้งราคาเอง
              <br />
              รับกำไรทันทีทุกครั้งที่มีการสั่งซื้อ
            </p>
          </div>

          {/* Animated Cards */}
          <div className="space-y-4 max-w-sm">
            {/* Order Notification */}
            <div 
              className={`transform transition-all duration-500 ${
                showNotification 
                  ? 'translate-x-0 opacity-100' 
                  : '-translate-x-10 opacity-0'
              }`}
            >
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-xl shadow-pink-100/50 border border-white/50">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center shrink-0">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-800">ออเดอร์ใหม่!</span>
                      <span className="text-xs text-gray-400">เมื่อกี้</span>
                    </div>
                    <p className="text-sm text-gray-600">เสื้อยืด Basic × 2 <span className="font-semibold text-gray-800">฿400</span></p>
                    <p className="text-sm text-green-600 font-medium mt-1">กำไร +฿200 เข้า Wallet แล้ว</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Wallet Card */}
            <div 
              className={`transform transition-all duration-500 delay-300 ${
                showNotification 
                  ? 'translate-x-0 opacity-100' 
                  : '-translate-x-10 opacity-0'
              }`}
            >
              <div className="bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl p-4 shadow-xl shadow-pink-200/50">
                <div className="flex items-center gap-2 text-white/80 mb-2">
                  <Wallet className="w-4 h-4" />
                  <span className="text-sm">Wallet ของฉัน</span>
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-white/70 text-xs">ยอดสะสม</p>
                    <p className="text-3xl font-bold text-white">฿3,200</p>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center gap-1 text-emerald-300 text-sm font-medium">
                      <ArrowRight className="w-3 h-3 rotate-[-45deg]" />
                      +฿420 วันนี้
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Shop Status */}
            <div 
              className={`transform transition-all duration-500 delay-500 ${
                showNotification 
                  ? 'translate-x-0 opacity-100' 
                  : '-translate-x-10 opacity-0'
              }`}
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-sky-100 rounded-xl flex items-center justify-center">
                    <ShoppingBag className="w-5 h-5 text-sky-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">ร้านของฉัน</p>
                    <div className="flex items-center gap-1">
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-xs text-green-600">Live</span>
                    </div>
                  </div>
                </div>
                <span className="text-sm text-sky-600 font-medium">+2 สินค้า</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="relative z-10 flex gap-8">
          <div className="text-center">
            <p className="text-3xl font-bold text-sky-600">500+</p>
            <p className="text-gray-500 text-sm">ตัวแทน</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-pink-500">10K+</p>
            <p className="text-gray-500 text-sm">ออเดอร์</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold bg-gradient-to-r from-sky-500 to-pink-500 bg-clip-text text-transparent">฿2M+</p>
            <p className="text-gray-500 text-sm">ยอดขาย</p>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gradient-to-br from-sky-50 via-white to-pink-50">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-sky-400 to-pink-400 rounded-2xl flex items-center justify-center shadow-lg">
              <Store className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-sky-600 to-pink-500 bg-clip-text text-transparent">
              ResellerHub
            </span>
          </div>

          {/* Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl shadow-pink-100/30 border border-white/50 p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-14 h-14 bg-gradient-to-br from-sky-100 to-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Store className="w-7 h-7 text-pink-500" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">ยินดีต้อนรับกลับ</h1>
              <p className="text-gray-500">เข้าสู่ระบบเพื่อจัดการร้านของคุณ</p>
            </div>

            {/* Test Accounts */}
            <div className="bg-gradient-to-r from-sky-50 to-pink-50 rounded-2xl p-4 mb-6 border border-sky-100/50">
              <p className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" />
                บัญชีทดสอบ — คลิกเพื่อกรอก
              </p>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fillTestAccount('admin')}
                  className="bg-white hover:bg-sky-50 border-sky-200 text-sky-700 rounded-xl"
                >
                  <Shield className="w-3.5 h-3.5 mr-1.5" />
                  Admin
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fillTestAccount('reseller1')}
                  className="bg-white hover:bg-pink-50 border-pink-200 text-pink-700 rounded-xl"
                >
                  <Users className="w-3.5 h-3.5 mr-1.5" />
                  มินนี่
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fillTestAccount('reseller2')}
                  className="bg-white hover:bg-pink-50 border-pink-200 text-pink-700 rounded-xl"
                >
                  <Users className="w-3.5 h-3.5 mr-1.5" />
                  แนน
                </Button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">อีเมล</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-12 h-12 bg-white border-gray-200 rounded-xl focus:border-pink-400 focus:ring-pink-400"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">รหัสผ่าน</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="password"
                    placeholder="รหัสผ่านของคุณ"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-12 h-12 bg-white border-gray-200 rounded-xl focus:border-pink-400 focus:ring-pink-400"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl border border-red-100">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-gradient-to-r from-sky-500 via-pink-500 to-purple-500 hover:from-sky-600 hover:via-pink-600 hover:to-purple-600 text-white font-medium text-base rounded-xl shadow-lg shadow-pink-200/50"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    กำลังเข้าสู่ระบบ...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    เข้าสู่ระบบ
                    <ArrowRight className="w-5 h-5" />
                  </span>
                )}
              </Button>
            </form>

            {/* Security Note */}
            <div className="text-center mt-6">
              <p className="text-xs text-gray-400 flex items-center justify-center gap-1.5">
                <Lock className="w-3.5 h-3.5" />
                ปลอดภัย · เข้ารหัสข้อมูลทุกครั้ง
              </p>
            </div>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-400">หรือ</span>
              </div>
            </div>

            {/* Sign Up Link */}
            <p className="text-center text-sm text-gray-500">
              ยังไม่มีบัญชี?{' '}
              <button className="text-pink-500 hover:text-pink-600 font-medium transition-colors">
                สมัครเป็นตัวแทนฟรี
                <ArrowRight className="w-4 h-4 inline ml-1" />
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
