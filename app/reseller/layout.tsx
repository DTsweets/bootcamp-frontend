'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { ResellerSidebar } from '@/components/reseller-sidebar'

export default function ResellerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'reseller')) {
      router.push('/')
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user || user.role !== 'reseller') {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-pink-50/30">
      <ResellerSidebar />
      <main className="lg:ml-72 min-h-screen">
        <div className="p-6 lg:p-10 pt-20 lg:pt-10 max-w-7xl">
          {children}
        </div>
      </main>
    </div>
  )
}
