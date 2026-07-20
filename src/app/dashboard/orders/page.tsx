'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Sidebar } from '@/components/layout/sidebar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Plus, Search } from 'lucide-react'
import { storage } from '@/lib/storage'
import { getBusinessFromStorage, formatDate, formatCurrency } from '@/lib/utils'

interface Order {
  id: string
  customer_id: string
  status: string
  total_amount: string
  delivery_address: string
  delivery_fee: string
  payment_status: string
  created_at: string
  customer: {
    name: string
    phone: string
  } | null
}

interface Customer {
  id: string
  name: string
  phone: string
}

export default function OrdersPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [formData, setFormData] = useState<{
    customer_id: string
    total_amount: string
    delivery_address: string
    delivery_fee: string
  }>({
    customer_id: '',
    total_amount: '',
    delivery_address: '',
    delivery_fee: '',
  })

  const fetchOrders = useCallback(() => {
    try {
      const business = getBusinessFromStorage()
      if (!business.id) {
        router.push('/login')
        return
      }

      const data = storage.getOrdersByBusinessId(business.id)
      setOrders(data)
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }, [router])

  const fetchCustomers = useCallback(() => {
    try {
      const business = getBusinessFromStorage()
      if (!business.id) {
        router.push('/login')
        return
      }

      const data = storage.getCustomersByBusinessId(business.id)
      setCustomers(data)
    } catch (error) {
      console.error('Error fetching customers:', error)
    }
  }, [router])

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }

    fetchOrders()
    fetchCustomers()
  }, [router, fetchOrders, fetchCustomers])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    setIsSubmitting(true)
    try {
      const business = getBusinessFromStorage()
      
      storage.createOrder({
        business_id: business.id,
        customer_id: formData.customer_id,
        total_amount: formData.total_amount,
        delivery_address: formData.delivery_address,
        delivery_fee: formData.delivery_fee,
        status: 'pending',
      })

      setIsAddDialogOpen(false)
      setFormData({
        customer_id: '',
        total_amount: '',
        delivery_address: '',
        delivery_fee: '',
      })
      fetchOrders()
    } catch (error) {
      console.error('Error creating order:', error)
      alert('Failed to create order')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleStatusUpdate = (orderId: string, newStatus: string) => {
    try {
      storage.updateOrderStatus(orderId, newStatus)
      fetchOrders()
    } catch (error) {
      console.error('Error updating order status:', error)
      alert('Failed to update order status')
    }
  }

  const resetForm = () => {
    setFormData({
      customer_id: '',
      total_amount: '',
      delivery_address: '',
      delivery_fee: '',
    })
  }


  if (loading) {
    return (
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-lg">Loading orders...</div>
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
            <h1 className="text-2xl lg:text-3xl font-bold">Order Management</h1>
            <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
              setIsAddDialogOpen(open)
              if (!open) resetForm()
            }}>
              <DialogTrigger>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Order
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create New Order</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="customer">Customer *</Label>
                    <Select value={formData.customer_id} onValueChange={(value) => setFormData({ ...formData, customer_id: value || '' })} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select customer" />
                      </SelectTrigger>
                      <SelectContent>
                        {customers.map((customer) => (
                          <SelectItem key={customer.id} value={customer.id}>
                            {customer.name} - {customer.phone}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="total_amount">Total Amount *</Label>
                    <Input
                      id="total_amount"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.total_amount}
                      onChange={(e) => setFormData({ ...formData, total_amount: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="delivery_address">Delivery Address *</Label>
                    <Input
                      id="delivery_address"
                      value={formData.delivery_address}
                      onChange={(e) => setFormData({ ...formData, delivery_address: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="delivery_fee">Delivery Fee *</Label>
                    <Input
                      id="delivery_fee"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.delivery_fee}
                      onChange={(e) => setFormData({ ...formData, delivery_fee: e.target.value })}
                      required
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsAddDialogOpen(false)
                        resetForm()
                      }}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? 'Creating...' : 'Create Order'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>All Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Delivery Address</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        No orders found
                      </TableCell>
                    </TableRow>
                  ) : (
                    orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">
                          {order.id.slice(0, 8)}...
                        </TableCell>
                        <TableCell>
                          {order.customer ? (
                            <div>
                              <div className="font-medium">{order.customer.name}</div>
                              <div className="text-sm text-muted-foreground">{order.customer.phone}</div>
                            </div>
                          ) : (
                            <div className="text-muted-foreground">Unknown Customer</div>
                          )}
                        </TableCell>
                        <TableCell>{formatCurrency(order.total_amount)}</TableCell>
                        <TableCell className="max-w-xs truncate">{order.delivery_address}</TableCell>
                        <TableCell>
                          <Select
                            value={order.status || 'pending'}
                            onValueChange={(value) => value && handleStatusUpdate(order.id, value)}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="confirmed">Confirmed</SelectItem>
                              <SelectItem value="processing">Processing</SelectItem>
                              <SelectItem value="packed">Packed</SelectItem>
                              <SelectItem value="dispatched">Dispatched</SelectItem>
                              <SelectItem value="delivered">Delivered</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Badge variant={order.payment_status === 'paid' ? 'default' : 'secondary'}>
                            {order.payment_status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {formatDate(order.created_at)}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
