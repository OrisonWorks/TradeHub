// LocalStorage-based data store to replace PostgreSQL
// This handles all CRUD operations for the application
// NOTE: This only works client-side. Do not use in API routes.

const STORAGE_KEYS = {
  BUSINESSES: 'tradehub_businesses',
  USERS: 'tradehub_users',
  PRODUCTS: 'tradehub_products',
  CUSTOMERS: 'tradehub_customers',
  SUPPLIERS: 'tradehub_suppliers',
  SALES: 'tradehub_sales',
  EXPENSES: 'tradehub_expenses',
  ORDERS: 'tradehub_orders',
  INVENTORY_TRANSACTIONS: 'tradehub_inventory_transactions',
}

// Helper functions
const generateId = () => {
  if (typeof window === 'undefined') return Date.now().toString()
  return crypto.randomUUID()
}

const getStorage = (key: string) => {
  if (typeof window === 'undefined') return []
  try {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.error(`Error parsing storage for ${key}:`, error)
    return []
  }
}

const setStorage = (key: string, data: any) => {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch (error: any) {
    console.error(`Error setting storage for ${key}:`, error)
    if (typeof DOMException !== 'undefined' && error instanceof DOMException && error.name === 'QuotaExceededError') {
      alert('Storage quota exceeded. Please clear some data.')
    }
  }
}

const safeParseNumber = (value: any, defaultValue: number = 0): number => {
  const parsed = parseFloat(value)
  return isNaN(parsed) ? defaultValue : parsed
}

// Business operations
export const storage = {
  // Business
  getBusinesses: () => getStorage(STORAGE_KEYS.BUSINESSES),
  getBusinessById: (id: string) => getStorage(STORAGE_KEYS.BUSINESSES).find((b: any) => b.id === id),
  getBusinessByEmail: (email: string) => getStorage(STORAGE_KEYS.BUSINESSES).find((b: any) => b.email === email),
  createBusiness: (data: any) => {
    const businesses = getStorage(STORAGE_KEYS.BUSINESSES)
    const newBusiness = { ...data, id: generateId(), created_at: new Date().toISOString() }
    businesses.push(newBusiness)
    setStorage(STORAGE_KEYS.BUSINESSES, businesses)
    return newBusiness
  },
  updateBusiness: (id: string, data: any) => {
    const businesses = getStorage(STORAGE_KEYS.BUSINESSES)
    const index = businesses.findIndex((b: any) => b.id === id)
    if (index !== -1) {
      businesses[index] = { ...businesses[index], ...data }
      setStorage(STORAGE_KEYS.BUSINESSES, businesses)
      return businesses[index]
    }
    return null
  },
  deleteBusiness: (id: string) => {
    // Cascade delete: delete all related entities
    const users = getStorage(STORAGE_KEYS.USERS).filter((u: any) => u.business_id !== id)
    const products = getStorage(STORAGE_KEYS.PRODUCTS).filter((p: any) => p.business_id !== id)
    const customers = getStorage(STORAGE_KEYS.CUSTOMERS).filter((c: any) => c.business_id !== id)
    const suppliers = getStorage(STORAGE_KEYS.SUPPLIERS).filter((s: any) => s.business_id !== id)
    const sales = getStorage(STORAGE_KEYS.SALES).filter((s: any) => s.business_id !== id)
    const expenses = getStorage(STORAGE_KEYS.EXPENSES).filter((e: any) => e.business_id !== id)
    const orders = getStorage(STORAGE_KEYS.ORDERS).filter((o: any) => o.business_id !== id)
    const businesses = getStorage(STORAGE_KEYS.BUSINESSES).filter((b: any) => b.id !== id)
    
    setStorage(STORAGE_KEYS.USERS, users)
    setStorage(STORAGE_KEYS.PRODUCTS, products)
    setStorage(STORAGE_KEYS.CUSTOMERS, customers)
    setStorage(STORAGE_KEYS.SUPPLIERS, suppliers)
    setStorage(STORAGE_KEYS.SALES, sales)
    setStorage(STORAGE_KEYS.EXPENSES, expenses)
    setStorage(STORAGE_KEYS.ORDERS, orders)
    setStorage(STORAGE_KEYS.BUSINESSES, businesses)
  },

  // Users
  getUsers: () => getStorage(STORAGE_KEYS.USERS),
  getUsersByBusinessId: (businessId: string) => getStorage(STORAGE_KEYS.USERS).filter((u: any) => u.business_id === businessId),
  getUserById: (id: string) => getStorage(STORAGE_KEYS.USERS).find((u: any) => u.id === id),
  getUserByEmail: (email: string) => getStorage(STORAGE_KEYS.USERS).find((u: any) => u.email === email),
  createUser: (data: any) => {
    const users = getStorage(STORAGE_KEYS.USERS)
    const newUser = { ...data, id: generateId(), created_at: new Date().toISOString() }
    users.push(newUser)
    setStorage(STORAGE_KEYS.USERS, users)
    return newUser
  },
  updateUser: (id: string, data: any) => {
    const users = getStorage(STORAGE_KEYS.USERS)
    const index = users.findIndex((u: any) => u.id === id)
    if (index !== -1) {
      users[index] = { ...users[index], ...data }
      setStorage(STORAGE_KEYS.USERS, users)
      return users[index]
    }
    return null
  },
  deleteUser: (id: string) => {
    const users = getStorage(STORAGE_KEYS.USERS).filter((u: any) => u.id !== id)
    setStorage(STORAGE_KEYS.USERS, users)
  },

  // Products
  getProducts: () => getStorage(STORAGE_KEYS.PRODUCTS),
  getProductsByBusinessId: (businessId: string) => getStorage(STORAGE_KEYS.PRODUCTS).filter((p: any) => p.business_id === businessId),
  getProductById: (id: string) => getStorage(STORAGE_KEYS.PRODUCTS).find((p: any) => p.id === id),
  createProduct: (data: any) => {
    const products = getStorage(STORAGE_KEYS.PRODUCTS)
    const newProduct = { ...data, id: generateId(), created_at: new Date().toISOString() }
    products.push(newProduct)
    setStorage(STORAGE_KEYS.PRODUCTS, products)
    return newProduct
  },
  updateProduct: (id: string, data: any) => {
    const products = getStorage(STORAGE_KEYS.PRODUCTS)
    const index = products.findIndex((p: any) => p.id === id)
    if (index !== -1) {
      products[index] = { ...products[index], ...data }
      setStorage(STORAGE_KEYS.PRODUCTS, products)
      return products[index]
    }
    return null
  },
  deleteProduct: (id: string) => {
    const products = getStorage(STORAGE_KEYS.PRODUCTS).filter((p: any) => p.id !== id)
    setStorage(STORAGE_KEYS.PRODUCTS, products)
  },

  // Customers
  getCustomers: () => getStorage(STORAGE_KEYS.CUSTOMERS),
  getCustomersByBusinessId: (businessId: string) => {
    const customers = getStorage(STORAGE_KEYS.CUSTOMERS).filter((c: any) => c.business_id === businessId)
    const sales = getStorage(STORAGE_KEYS.SALES)
    const orders = getStorage(STORAGE_KEYS.ORDERS)
    
    return customers.map((customer: any) => ({
      ...customer,
      _count: {
        sales: sales.filter((s: any) => s.customer_id === customer.id).length,
        orders: orders.filter((o: any) => o.customer_id === customer.id).length,
      }
    }))
  },
  getCustomerById: (id: string) => getStorage(STORAGE_KEYS.CUSTOMERS).find((c: any) => c.id === id),
  createCustomer: (data: any) => {
    const customers = getStorage(STORAGE_KEYS.CUSTOMERS)
    const newCustomer = { ...data, id: generateId(), created_at: new Date().toISOString() }
    customers.push(newCustomer)
    setStorage(STORAGE_KEYS.CUSTOMERS, customers)
    return newCustomer
  },
  updateCustomer: (id: string, data: any) => {
    const customers = getStorage(STORAGE_KEYS.CUSTOMERS)
    const index = customers.findIndex((c: any) => c.id === id)
    if (index !== -1) {
      customers[index] = { ...customers[index], ...data }
      setStorage(STORAGE_KEYS.CUSTOMERS, customers)
      return customers[index]
    }
    return null
  },
  deleteCustomer: (id: string) => {
    const customers = getStorage(STORAGE_KEYS.CUSTOMERS).filter((c: any) => c.id !== id)
    setStorage(STORAGE_KEYS.CUSTOMERS, customers)
  },

  // Suppliers
  getSuppliers: () => getStorage(STORAGE_KEYS.SUPPLIERS),
  getSuppliersByBusinessId: (businessId: string) => getStorage(STORAGE_KEYS.SUPPLIERS).filter((s: any) => s.business_id === businessId),
  getSupplierById: (id: string) => getStorage(STORAGE_KEYS.SUPPLIERS).find((s: any) => s.id === id),
  createSupplier: (data: any) => {
    const suppliers = getStorage(STORAGE_KEYS.SUPPLIERS)
    const newSupplier = { ...data, id: generateId(), created_at: new Date().toISOString() }
    suppliers.push(newSupplier)
    setStorage(STORAGE_KEYS.SUPPLIERS, suppliers)
    return newSupplier
  },
  updateSupplier: (id: string, data: any) => {
    const suppliers = getStorage(STORAGE_KEYS.SUPPLIERS)
    const index = suppliers.findIndex((s: any) => s.id === id)
    if (index !== -1) {
      suppliers[index] = { ...suppliers[index], ...data }
      setStorage(STORAGE_KEYS.SUPPLIERS, suppliers)
      return suppliers[index]
    }
    return null
  },
  deleteSupplier: (id: string) => {
    const suppliers = getStorage(STORAGE_KEYS.SUPPLIERS).filter((s: any) => s.id !== id)
    setStorage(STORAGE_KEYS.SUPPLIERS, suppliers)
  },

  // Sales
  getSales: () => getStorage(STORAGE_KEYS.SALES),
  getSalesByBusinessId: (businessId: string) => {
    const sales = getStorage(STORAGE_KEYS.SALES).filter((s: any) => s.business_id === businessId)
    const customers = getStorage(STORAGE_KEYS.CUSTOMERS)
    
    return sales.map((sale: any) => ({
      ...sale,
      customer: customers.find((c: any) => c.id === sale.customer_id) || null,
    }))
  },
  getSaleById: (id: string) => getStorage(STORAGE_KEYS.SALES).find((s: any) => s.id === id),
  createSale: (data: any) => {
    const sales = getStorage(STORAGE_KEYS.SALES)
    const newSale = { ...data, id: generateId(), sale_date: new Date().toISOString() }
    
    // Validate and update stock atomically before creating sale
    if (data.sale_items) {
      const products = getStorage(STORAGE_KEYS.PRODUCTS)
      const transactions = getStorage(STORAGE_KEYS.INVENTORY_TRANSACTIONS)
      const updatedProducts = [...products]
      const newTransactions = [...transactions]

      for (const item of data.sale_items) {
        const productIndex = updatedProducts.findIndex((p: any) => p.id === item.product_id)
        if (productIndex === -1) {
          throw new Error(`Product ${item.product_id} not found`)
        }
        const product = updatedProducts[productIndex]
        const itemQuantity = safeParseNumber(item.quantity, 0)
        const currentStock = safeParseNumber(product.stock_qty, 0)

        if (currentStock < itemQuantity) {
          throw new Error(`Insufficient stock for ${product.name}. Available: ${currentStock}, Required: ${itemQuantity}`)
        }

        // Update stock immediately after validation (atomic operation)
        updatedProducts[productIndex].stock_qty = currentStock - itemQuantity

        // Create inventory transaction
        newTransactions.push({
          id: generateId(),
          product_id: item.product_id,
          transaction_type: 'sale',
          quantity: itemQuantity,
          transaction_date: new Date().toISOString(),
        })
      }

      // Commit all changes together
      setStorage(STORAGE_KEYS.PRODUCTS, updatedProducts)
      setStorage(STORAGE_KEYS.INVENTORY_TRANSACTIONS, newTransactions)
    }
    
    sales.push(newSale)
    setStorage(STORAGE_KEYS.SALES, sales)
    
    return newSale
  },

  // Expenses
  getExpenses: () => getStorage(STORAGE_KEYS.EXPENSES),
  getExpensesByBusinessId: (businessId: string) => getStorage(STORAGE_KEYS.EXPENSES).filter((e: any) => e.business_id === businessId),
  getExpenseById: (id: string) => getStorage(STORAGE_KEYS.EXPENSES).find((e: any) => e.id === id),
  createExpense: (data: any) => {
    const expenses = getStorage(STORAGE_KEYS.EXPENSES)
    const newExpense = { 
      ...data, 
      id: generateId(), 
      expense_date: data.expense_date || new Date().toISOString() 
    }
    expenses.push(newExpense)
    setStorage(STORAGE_KEYS.EXPENSES, expenses)
    return newExpense
  },
  deleteExpense: (id: string) => {
    const expenses = getStorage(STORAGE_KEYS.EXPENSES).filter((e: any) => e.id !== id)
    setStorage(STORAGE_KEYS.EXPENSES, expenses)
  },

  // Orders
  getOrders: () => getStorage(STORAGE_KEYS.ORDERS),
  getOrdersByBusinessId: (businessId: string) => {
    const orders = getStorage(STORAGE_KEYS.ORDERS).filter((o: any) => o.business_id === businessId)
    const customers = getStorage(STORAGE_KEYS.CUSTOMERS)
    
    return orders.map((order: any) => ({
      ...order,
      customer: customers.find((c: any) => c.id === order.customer_id) || null,
    }))
  },
  getOrderById: (id: string) => getStorage(STORAGE_KEYS.ORDERS).find((o: any) => o.id === id),
  createOrder: (data: any) => {
    if (!data.business_id) {
      throw new Error('business_id is required to create an order')
    }
    const orders = getStorage(STORAGE_KEYS.ORDERS)
    const newOrder = { ...data, id: generateId(), created_at: new Date().toISOString(), payment_status: data.payment_status || 'pending' }
    orders.push(newOrder)
    setStorage(STORAGE_KEYS.ORDERS, orders)
    return newOrder
  },
  updateOrderStatus: (id: string, status: string) => {
    const orders = getStorage(STORAGE_KEYS.ORDERS)
    const index = orders.findIndex((o: any) => o.id === id)
    if (index !== -1) {
      orders[index].status = status
      setStorage(STORAGE_KEYS.ORDERS, orders)
      return orders[index]
    }
    return null
  },

  // Reports
  getDashboardMetrics: (businessId: string) => {
    const sales = getStorage(STORAGE_KEYS.SALES).filter((s: any) => s.business_id === businessId)
    const expenses = getStorage(STORAGE_KEYS.EXPENSES).filter((e: any) => e.business_id === businessId)
    const products = getStorage(STORAGE_KEYS.PRODUCTS).filter((p: any) => p.business_id === businessId)
    const orders = getStorage(STORAGE_KEYS.ORDERS).filter((o: any) => o.business_id === businessId)
    
    const now = new Date()
    const today = now.toISOString().split('T')[0]
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()
    const monthAgo = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
    
    const todaySales = sales.filter((s: any) => s.sale_date.startsWith(today))
    const weekSales = sales.filter((s: any) => s.sale_date >= weekAgo)
    const monthSales = sales.filter((s: any) => s.sale_date >= monthAgo)
    
    const totalSales = sales.reduce((sum: number, s: any) => sum + safeParseNumber(s.total_amount), 0)
    const monthExpenses = expenses.filter((e: any) => e.expense_date >= monthAgo)
      .reduce((sum: number, e: any) => sum + safeParseNumber(e.amount), 0)
    
    const inventoryValue = products.reduce((sum: number, p: any) => sum + safeParseNumber(p.cost_price) * safeParseNumber(p.stock_qty, 0), 0)
    const lowStock = products.filter((p: any) => p.reorder_level !== undefined && safeParseNumber(p.stock_qty, 0) <= safeParseNumber(p.reorder_level, 0)).length
    const pendingOrders = orders.filter((o: any) => o.status === 'pending').length
    
    return {
      daily_sales: todaySales.reduce((sum: number, s: any) => sum + safeParseNumber(s.total_amount), 0),
      weekly_sales: weekSales.reduce((sum: number, s: any) => sum + safeParseNumber(s.total_amount), 0),
      monthly_sales: monthSales.reduce((sum: number, s: any) => sum + safeParseNumber(s.total_amount), 0),
      monthly_expenses: monthExpenses,
      profit: totalSales - monthExpenses,
      inventory_value: inventoryValue,
      low_stock_alerts: lowStock,
      pending_orders: pendingOrders,
    }
  },

  getSalesReport: (businessId: string, period: string) => {
    const sales = getStorage(STORAGE_KEYS.SALES).filter((s: any) => s.business_id === businessId)
    const now = new Date()
    let startDate: Date
    
    switch (period) {
      case 'daily':
        startDate = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()))
        break
      case 'weekly':
        startDate = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) - 7 * 24 * 60 * 60 * 1000)
        break
      case 'monthly':
        startDate = new Date(Date.UTC(now.getFullYear(), now.getMonth(), 1))
        break
      case 'annual':
        startDate = new Date(Date.UTC(now.getFullYear(), 0, 1))
        break
      default:
        startDate = new Date(Date.UTC(now.getFullYear(), now.getMonth(), 1))
    }
    
    const filteredSales = sales.filter((s: any) => s.sale_date >= startDate.toISOString())
    
    return {
      type: 'sales',
      period,
      total_sales: filteredSales.reduce((sum: number, s: any) => sum + safeParseNumber(s.total_amount), 0),
      total_transactions: filteredSales.length,
      total_items: filteredSales.reduce((sum: number, s: any) => {
        const saleItems = s.sale_items || []
        return sum + saleItems.reduce((itemSum: number, item: any) => itemSum + item.quantity, 0)
      }, 0),
      sales: filteredSales,
    }
  },

  getInventoryReport: (businessId: string) => {
    const products = getStorage(STORAGE_KEYS.PRODUCTS).filter((p: any) => p.business_id === businessId)
    
    return {
      type: 'inventory',
      total_products: products.length,
      total_stock: products.reduce((sum: number, p: any) => sum + safeParseNumber(p.stock_qty, 0), 0),
      stock_value: products.reduce((sum: number, p: any) => sum + safeParseNumber(p.cost_price) * safeParseNumber(p.stock_qty, 0), 0),
      low_stock_count: products.filter((p: any) => p.reorder_level !== undefined && safeParseNumber(p.stock_qty, 0) <= safeParseNumber(p.reorder_level, 0)).length,
      low_stock_products: products.filter((p: any) => p.reorder_level !== undefined && safeParseNumber(p.stock_qty, 0) <= safeParseNumber(p.reorder_level, 0)),
    }
  },

  getProfitReport: (businessId: string, period: string) => {
    const sales = getStorage(STORAGE_KEYS.SALES).filter((s: any) => s.business_id === businessId)
    const expenses = getStorage(STORAGE_KEYS.EXPENSES).filter((e: any) => e.business_id === businessId)
    const now = new Date()
    let startDate: Date
    
    switch (period) {
      case 'daily':
        startDate = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()))
        break
      case 'weekly':
        startDate = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) - 7 * 24 * 60 * 60 * 1000)
        break
      case 'monthly':
        startDate = new Date(Date.UTC(now.getFullYear(), now.getMonth(), 1))
        break
      case 'annual':
        startDate = new Date(Date.UTC(now.getFullYear(), 0, 1))
        break
      default:
        startDate = new Date(Date.UTC(now.getFullYear(), now.getMonth(), 1))
    }
    
    const filteredSales = sales.filter((s: any) => s.sale_date >= startDate.toISOString())
    const filteredExpenses = expenses.filter((e: any) => e.expense_date >= startDate.toISOString())
    
    const revenue = filteredSales.reduce((sum: number, s: any) => sum + safeParseNumber(s.total_amount), 0)
    const expenseTotal = filteredExpenses.reduce((sum: number, e: any) => sum + safeParseNumber(e.amount), 0)
    
    return {
      type: 'profit',
      period,
      revenue,
      expenses: expenseTotal,
      profit: revenue - expenseTotal,
    }
  },
}
