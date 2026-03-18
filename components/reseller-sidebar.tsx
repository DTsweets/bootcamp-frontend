'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  LayoutDashboard,
  Package,
  Store,
  ShoppingCart,
  Wallet,
  LogOut,
  ChevronLeft,
  Menu,
  X,
} from 'lucide-react'
import { useState } from 'react'

const menuItems = [
  { href: '/reseller/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/reseller/products', label: 'Products', icon: Package },
  { href: '/reseller/myshop', label: 'My Shop', icon: Store },
  { href: '/reseller/orders', label: 'Orders', icon: ShoppingCart },
  { href: '/reseller/wallet', label: 'Wallet', icon: Wallet },
]

export function ResellerSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2.5 bg-white rounded-xl shadow-lg border border-gray-100"
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5 text-gray-700" />
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 h-screen bg-white border-r border-gray-100 flex flex-col z-50 transition-all duration-300 shadow-xl lg:shadow-none',
          collapsed ? 'w-20' : 'w-72',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Header */}
        <div className="p-5 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <Link href="/reseller/dashboard" className="flex items-center gap-3">
              <div className="w-11 h-11 bg-gradient-to-br from-pink-400 to-purple-500 rounded-xl flex items-center justify-center shadow-lg shadow-pink-200/50 shrink-0">
                <Store className="w-6 h-6 text-white" />
              </div>
              {!collapsed && (
                <div>
                  <h1 className="font-bold text-gray-900 text-lg">ResellerHub</h1>
                  <p className="text-xs text-pink-600 font-medium">Reseller Panel</p>
                </div>
              )}
            </Link>
            
            {/* Mobile Close */}
            <button
              onClick={() => setMobileOpen(false)}
              className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
            
            {/* Desktop Collapse */}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="hidden lg:flex w-8 h-8 items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <ChevronLeft className={cn('w-4 h-4 transition-transform duration-300', collapsed && 'rotate-180')} />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200',
                  isActive
                    ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg shadow-pink-200/50'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                )}
              >
                <item.icon className={cn('w-5 h-5 shrink-0', isActive ? 'text-white' : 'text-gray-400')} />
                {!collapsed && <span className="font-medium">{item.label}</span>}
              </Link>
            )
          })}
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/50">
          {!collapsed && (
            <div className="flex items-center gap-3 mb-4 px-2">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-purple-500 rounded-xl flex items-center justify-center shadow-md">
                <span className="text-sm font-bold text-white">
                  {user?.name?.charAt(0) || 'R'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{user?.name}</p>
                <p className="text-xs text-gray-500 truncate">{user?.shopName}</p>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            onClick={handleLogout}
            className={cn(
              'w-full text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors',
              collapsed ? 'px-2' : 'justify-start px-4'
            )}
          >
            <LogOut className="w-5 h-5" />
            {!collapsed && <span className="ml-2 font-medium">ออกจากระบบ</span>}
          </Button>
        </div>
      </aside>
    </>
  )
}
