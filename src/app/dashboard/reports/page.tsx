'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Sidebar } from '@/components/layout/sidebar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { BarChart3, TrendingUp, Package, Coins } from 'lucide-react'
import { storage } from '@/lib/storage'
import { getBusinessFromStorage, formatCurrency, formatDate } from '@/lib/utils'

interface SalesReport {
  type: string
  period: string
  total_sales: number
  total_transactions: number
  total_items: number
  sales: any[]
}

interface InventoryReport {
  type: string
  total_products: number
  total_stock: number
  stock_value: number
  low_stock_count: number
  low_stock_products: any[]
}

interface ProfitReport {
  type: string
  period: string
  revenue: number
  expenses: number
  profit: number
}

export default function ReportsPage() {
  const router = useRouter()
  const [salesReport, setSalesReport] = useState<SalesReport | null>(null)
  const [inventoryReport, setInventoryReport] = useState<InventoryReport | null>(null)
  const [profitReport, setProfitReport] = useState<ProfitReport | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [period, setPeriod] = useState('monthly')

  const fetchReports = useCallback(() => {
    setError(null)
    try {
      const business = getBusinessFromStorage()
      if (!business.id) {
        router.push('/login')
        return
      }

      const salesData = storage.getSalesReport(business.id, period)
      const inventoryData = storage.getInventoryReport(business.id)
      const profitData = storage.getProfitReport(business.id, period)

      setSalesReport(salesData)
      setInventoryReport(inventoryData)
      setProfitReport(profitData)
    } catch (error) {
      console.error('Error fetching reports:', error)
      setError('Failed to load reports. Please try again.')
      setSalesReport(null)
      setInventoryReport(null)
      setProfitReport(null)
    } finally {
      setLoading(false)
    }
  }, [router, period])

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }

    fetchReports()
  }, [router, fetchReports])

  if (loading) {
    return (
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-lg">Loading reports...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-lg text-red-600">{error}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="p-4 lg:p-8 pt-16 lg:pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 lg:mb-8 gap-4">
            <h1 className="text-2xl lg:text-3xl font-bold">Reports & Analytics</h1>
            <Select value={period} onValueChange={(value) => setPeriod(value || 'monthly')}>
              <SelectTrigger className="w-32 sm:w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="annual">Annual</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Tabs defaultValue="sales" className="space-y-6">
            <TabsList>
              <TabsTrigger value="sales">Sales</TabsTrigger>
              <TabsTrigger value="inventory">Inventory</TabsTrigger>
              <TabsTrigger value="profit">Profit & Loss</TabsTrigger>
            </TabsList>

            <TabsContent value="sales" className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
                    <Coins className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {formatCurrency(salesReport?.total_sales || 0)}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Transactions</CardTitle>
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {salesReport?.total_transactions || 0}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Items Sold</CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {salesReport?.total_items || 0}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Sales</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Items</TableHead>
                        <TableHead>Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {salesReport?.sales?.slice(0, 10).map((sale: any, index: number) => (
                        <TableRow key={sale.id || index}>
                          <TableCell>
                            {formatDate(sale.sale_date)}
                          </TableCell>
                          <TableCell>
                            {sale.sale_items?.reduce((sum: number, item: any) => sum + item.quantity, 0) || 0}
                          </TableCell>
                          <TableCell className="font-medium">
                            {formatCurrency(sale.total_amount)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="inventory" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {inventoryReport?.total_products || 0}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Stock</CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {inventoryReport?.total_stock || 0}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Stock Value</CardTitle>
                    <Coins className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {formatCurrency(inventoryReport?.stock_value || 0)}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-red-600">
                      {inventoryReport?.low_stock_count || 0}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {inventoryReport?.low_stock_products && inventoryReport.low_stock_products.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Low Stock Alerts</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Product</TableHead>
                          <TableHead>Current Stock</TableHead>
                          <TableHead>Reorder Level</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {inventoryReport.low_stock_products.map((product: any, index: number) => (
                          <TableRow key={product.id || index}>
                            <TableCell className="font-medium">{product.name}</TableCell>
                            <TableCell className="text-red-600">{product.stock_qty}</TableCell>
                            <TableCell>{product.reorder_level}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="profit" className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                      {formatCurrency(profitReport?.revenue || 0)}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Expenses</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-red-600">
                      {formatCurrency(profitReport?.expenses || 0)}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Profit</CardTitle>
                    <Coins className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className={`text-2xl font-bold ${profitReport?.profit && profitReport.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(profitReport?.profit || 0)}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Profit Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                      <span className="font-medium">Total Revenue</span>
                      <span className="text-xl font-bold text-green-600">
                        {formatCurrency(profitReport?.revenue || 0)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-red-50 rounded-lg">
                      <span className="font-medium">Total Expenses</span>
                      <span className="text-xl font-bold text-red-600">
                        {formatCurrency(profitReport?.expenses || 0)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                      <span className="font-medium">Net Profit</span>
                      <span className={`text-xl font-bold ${profitReport?.profit && profitReport.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(profitReport?.profit || 0)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
