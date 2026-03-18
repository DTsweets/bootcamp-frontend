'use client'

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { mockUsers, type User } from './mock-data'

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for saved session
    const savedUser = localStorage.getItem('currentUser')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const foundUser = mockUsers.find(u => u.email === email && u.password === password)
    
    if (!foundUser) {
      return { success: false, error: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' }
    }
    
    if (foundUser.role === 'reseller' && foundUser.status !== 'approved') {
      return { success: false, error: 'บัญชีของคุณยังไม่ได้รับการอนุมัติ' }
    }
    
    setUser(foundUser)
    localStorage.setItem('currentUser', JSON.stringify(foundUser))
    return { success: true }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('currentUser')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
