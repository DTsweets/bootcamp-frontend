// Types
export interface User {
  id: string
  email: string
  password: string
  name: string
  role: 'admin' | 'reseller'
  shopName?: string
  shopSlug?: string
  status: 'pending' | 'approved' | 'rejected'
  createdAt: string
  avatar?: string
}

export interface Product {
  id: string
  name: string
  description: string
  costPrice: number
  suggestedPrice: number
  stock: number
  image: string
  category: string
  sku: string
  createdAt: string
}

export interface ResellerProduct {
  id: string
  resellerId: string
  productId: string
  sellingPrice: number
  isActive: boolean
}

export interface Order {
  id: string
  orderNumber: string
  resellerId: string
  customerName: string
  customerPhone: string
  customerAddress: string
  items: OrderItem[]
  totalAmount: number
  resellerProfit: number
  adminRevenue: number
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
  paymentStatus: 'pending' | 'paid' | 'refunded'
  createdAt: string
  updatedAt: string
}

export interface OrderItem {
  productId: string
  productName: string
  quantity: number
  unitPrice: number
  costPrice: number
}

export interface WalletTransaction {
  id: string
  resellerId: string
  orderId: string
  amount: number
  type: 'profit' | 'withdrawal'
  description: string
  createdAt: string
}

// Mock Users
export const mockUsers: User[] = [
  {
    id: 'admin-1',
    email: 'admin@resellerhub.com',
    password: 'admin123',
    name: 'Admin',
    role: 'admin',
    status: 'approved',
    createdAt: '2024-01-01',
  },
  {
    id: 'reseller-1',
    email: 'minnie@shop.com',
    password: 'minnie123',
    name: 'มินนี่',
    role: 'reseller',
    shopName: 'Minnie Shop',
    shopSlug: 'minnie-shop',
    status: 'approved',
    createdAt: '2024-02-15',
  },
  {
    id: 'reseller-2',
    email: 'nan@shop.com',
    password: 'nan123',
    name: 'แนน',
    role: 'reseller',
    shopName: 'Nan Beauty',
    shopSlug: 'nan-beauty',
    status: 'approved',
    createdAt: '2024-03-01',
  },
  {
    id: 'reseller-3',
    email: 'somchai@shop.com',
    password: 'somchai123',
    name: 'สมชาย',
    role: 'reseller',
    shopName: 'Somchai Store',
    shopSlug: 'somchai-store',
    status: 'pending',
    createdAt: '2024-03-15',
  },
]

// Mock Products
export const mockProducts: Product[] = [
  {
    id: 'prod-1',
    name: 'เสื้อยืด Basic Cotton',
    description: 'เสื้อยืดคอตตอน 100% นุ่มสบาย',
    costPrice: 150,
    suggestedPrice: 299,
    stock: 100,
    image: '/placeholder.svg?height=200&width=200',
    category: 'เสื้อผ้า',
    sku: 'TSH-001',
    createdAt: '2024-01-10',
  },
  {
    id: 'prod-2',
    name: 'กางเกงขาสั้น Sport',
    description: 'กางเกงออกกำลังกาย ระบายอากาศดี',
    costPrice: 120,
    suggestedPrice: 249,
    stock: 80,
    image: '/placeholder.svg?height=200&width=200',
    category: 'เสื้อผ้า',
    sku: 'SHT-001',
    createdAt: '2024-01-12',
  },
  {
    id: 'prod-3',
    name: 'หมวกแก๊ป Premium',
    description: 'หมวกแก๊ปคุณภาพสูง ปักโลโก้',
    costPrice: 80,
    suggestedPrice: 199,
    stock: 50,
    image: '/placeholder.svg?height=200&width=200',
    category: 'เครื่องประดับ',
    sku: 'CAP-001',
    createdAt: '2024-01-15',
  },
  {
    id: 'prod-4',
    name: 'กระเป๋าผ้า Canvas',
    description: 'กระเป๋าผ้าแคนวาส ทนทาน',
    costPrice: 100,
    suggestedPrice: 220,
    stock: 5,
    image: '/placeholder.svg?height=200&width=200',
    category: 'กระเป๋า',
    sku: 'BAG-001',
    createdAt: '2024-01-20',
  },
  {
    id: 'prod-5',
    name: 'รองเท้าผ้าใบ Classic',
    description: 'รองเท้าผ้าใบสไตล์คลาสสิค',
    costPrice: 350,
    suggestedPrice: 699,
    stock: 30,
    image: '/placeholder.svg?height=200&width=200',
    category: 'รองเท้า',
    sku: 'SHO-001',
    createdAt: '2024-02-01',
  },
  {
    id: 'prod-6',
    name: 'แว่นกันแดด UV400',
    description: 'แว่นกันแดด ป้องกัน UV400',
    costPrice: 90,
    suggestedPrice: 199,
    stock: 3,
    image: '/placeholder.svg?height=200&width=200',
    category: 'เครื่องประดับ',
    sku: 'SUN-001',
    createdAt: '2024-02-05',
  },
]

// Mock Reseller Products
export const mockResellerProducts: ResellerProduct[] = [
  { id: 'rp-1', resellerId: 'reseller-1', productId: 'prod-1', sellingPrice: 350, isActive: true },
  { id: 'rp-2', resellerId: 'reseller-1', productId: 'prod-2', sellingPrice: 299, isActive: true },
  { id: 'rp-3', resellerId: 'reseller-1', productId: 'prod-3', sellingPrice: 250, isActive: true },
  { id: 'rp-4', resellerId: 'reseller-2', productId: 'prod-1', sellingPrice: 320, isActive: true },
  { id: 'rp-5', resellerId: 'reseller-2', productId: 'prod-4', sellingPrice: 280, isActive: true },
  { id: 'rp-6', resellerId: 'reseller-2', productId: 'prod-5', sellingPrice: 799, isActive: true },
]

// Mock Orders
export const mockOrders: Order[] = [
  {
    id: 'order-1',
    orderNumber: 'ORD-2024-001',
    resellerId: 'reseller-1',
    customerName: 'คุณวิชัย',
    customerPhone: '081-234-5678',
    customerAddress: '123 ถ.สุขุมวิท กทม. 10110',
    items: [
      { productId: 'prod-1', productName: 'เสื้อยืด Basic Cotton', quantity: 2, unitPrice: 350, costPrice: 150 },
    ],
    totalAmount: 700,
    resellerProfit: 400,
    adminRevenue: 300,
    status: 'delivered',
    paymentStatus: 'paid',
    createdAt: '2024-03-01T10:00:00',
    updatedAt: '2024-03-03T14:00:00',
  },
  {
    id: 'order-2',
    orderNumber: 'ORD-2024-002',
    resellerId: 'reseller-1',
    customerName: 'คุณสมหญิง',
    customerPhone: '089-876-5432',
    customerAddress: '456 ถ.รัชดา กทม. 10400',
    items: [
      { productId: 'prod-2', productName: 'กางเกงขาสั้น Sport', quantity: 1, unitPrice: 299, costPrice: 120 },
      { productId: 'prod-3', productName: 'หมวกแก๊ป Premium', quantity: 1, unitPrice: 250, costPrice: 80 },
    ],
    totalAmount: 549,
    resellerProfit: 349,
    adminRevenue: 200,
    status: 'shipped',
    paymentStatus: 'paid',
    createdAt: '2024-03-10T14:30:00',
    updatedAt: '2024-03-11T09:00:00',
  },
  {
    id: 'order-3',
    orderNumber: 'ORD-2024-003',
    resellerId: 'reseller-2',
    customerName: 'คุณประภา',
    customerPhone: '082-345-6789',
    customerAddress: '789 ถ.พหลโยธิน กทม. 10900',
    items: [
      { productId: 'prod-5', productName: 'รองเท้าผ้าใบ Classic', quantity: 1, unitPrice: 799, costPrice: 350 },
    ],
    totalAmount: 799,
    resellerProfit: 449,
    adminRevenue: 350,
    status: 'delivered',
    paymentStatus: 'paid',
    createdAt: '2024-03-12T09:15:00',
    updatedAt: '2024-03-14T16:00:00',
  },
  {
    id: 'order-4',
    orderNumber: 'ORD-2024-004',
    resellerId: 'reseller-2',
    customerName: 'คุณธนา',
    customerPhone: '084-567-8901',
    customerAddress: '321 ถ.ลาดพร้าว กทม. 10230',
    items: [
      { productId: 'prod-1', productName: 'เสื้อยืด Basic Cotton', quantity: 3, unitPrice: 320, costPrice: 150 },
    ],
    totalAmount: 960,
    resellerProfit: 510,
    adminRevenue: 450,
    status: 'confirmed',
    paymentStatus: 'paid',
    createdAt: '2024-03-15T11:45:00',
    updatedAt: '2024-03-15T12:00:00',
  },
  {
    id: 'order-5',
    orderNumber: 'ORD-2024-005',
    resellerId: 'reseller-1',
    customerName: 'คุณมานะ',
    customerPhone: '086-789-0123',
    customerAddress: '654 ถ.สาทร กทม. 10120',
    items: [
      { productId: 'prod-1', productName: 'เสื้อยืด Basic Cotton', quantity: 2, unitPrice: 350, costPrice: 150 },
    ],
    totalAmount: 700,
    resellerProfit: 400,
    adminRevenue: 300,
    status: 'pending',
    paymentStatus: 'pending',
    createdAt: '2024-03-17T16:20:00',
    updatedAt: '2024-03-17T16:20:00',
  },
]

// Mock Wallet Transactions
export const mockWalletTransactions: WalletTransaction[] = [
  {
    id: 'txn-1',
    resellerId: 'reseller-1',
    orderId: 'order-1',
    amount: 400,
    type: 'profit',
    description: 'กำไรจากออเดอร์ ORD-2024-001',
    createdAt: '2024-03-03T14:00:00',
  },
  {
    id: 'txn-2',
    resellerId: 'reseller-1',
    orderId: 'order-2',
    amount: 349,
    type: 'profit',
    description: 'กำไรจากออเดอร์ ORD-2024-002',
    createdAt: '2024-03-11T09:00:00',
  },
  {
    id: 'txn-3',
    resellerId: 'reseller-2',
    orderId: 'order-3',
    amount: 449,
    type: 'profit',
    description: 'กำไรจากออเดอร์ ORD-2024-003',
    createdAt: '2024-03-14T16:00:00',
  },
  {
    id: 'txn-4',
    resellerId: 'reseller-2',
    orderId: 'order-4',
    amount: 510,
    type: 'profit',
    description: 'กำไรจากออเดอร์ ORD-2024-004',
    createdAt: '2024-03-15T12:00:00',
  },
]

// Helper functions
export function getResellerById(id: string): User | undefined {
  return mockUsers.find(u => u.id === id && u.role === 'reseller')
}

export function getProductById(id: string): Product | undefined {
  return mockProducts.find(p => p.id === id)
}

export function getOrdersByReseller(resellerId: string): Order[] {
  return mockOrders.filter(o => o.resellerId === resellerId)
}

export function getResellerProductsByReseller(resellerId: string): ResellerProduct[] {
  return mockResellerProducts.filter(rp => rp.resellerId === resellerId)
}

export function getWalletBalance(resellerId: string): number {
  return mockWalletTransactions
    .filter(t => t.resellerId === resellerId && t.type === 'profit')
    .reduce((sum, t) => sum + t.amount, 0)
}

export function getTransactionsByReseller(resellerId: string): WalletTransaction[] {
  return mockWalletTransactions.filter(t => t.resellerId === resellerId)
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
    minimumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleString('th-TH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
