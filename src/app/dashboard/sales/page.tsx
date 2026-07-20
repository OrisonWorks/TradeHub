'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Sidebar } from '@/components/layout/sidebar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Plus, Trash2, Search, ShoppingCart } from 'lucide-react'
import { storage } from '@/lib/storage'
import { getBusinessFromStorage, formatCurrency } from '@/lib/utils'

interface Product {
  id: string
  name: string
  category: string
  selling_price: string
  stock_qty: number
}

interface CartItem {
  product_id: string
  product_name: string
  quantity: number
  price: number
  total: number
}

interface Customer {
  id: string
  name: string
  phone: string
}

export default function SalesPage() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [selectedCustomer, setSelectedCustomer] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('cash')
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const fetchProducts = useCallback(() => {
    try {
      const business = getBusinessFromStorage()
      if (!business.id) {
        router.push('/login')
        return
      }

      const data = storage.getProductsByBusinessId(business.id)
      setProducts(data)
    } catch (error) {
      console.error('Error fetching products:', error)
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

    fetchProducts()
    fetchCustomers()
  }, [router, fetchProducts, fetchCustomers])

  const addToCart = (product: Product) => {
    const existingItem = cart.find(item => item.product_id === product.id)
    const price = parseFloat(product.selling_price) || 0
    
    if (existingItem) {
      if (existingItem.quantity >= product.stock_qty) {
        alert('Not enough stock available')
        return
      }
      setCart(cart.map(item =>
        item.product_id === product.id
          ? { ...item, quantity: item.quantity + 1, total: (item.quantity + 1) * price }
          : item
      ))
    } else {
      setCart([
        ...cart,
        {
          product_id: product.id,
          product_name: product.name,
          quantity: 1,
          price: price,
          total: price,
        }
      ])
    }
  }

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.product_id !== productId))
  }

  const updateQuantity = (productId: string, quantity: number) => {
    const product = products.find(p => p.id === productId)
    if (product && quantity > product.stock_qty) {
      alert('Not enough stock available')
      return
    }
    if (quantity < 1) {
      return
    }

    setCart(cart.map(item =>
      item.product_id === productId
        ? { ...item, quantity: quantity, total: quantity * item.price }
        : item
    ))
  }

  const cartTotal = cart.reduce((sum, item) => sum + item.total, 0)

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('Cart is empty')
      return
    }

    setIsSubmitting(true)
    try {
      const business = getBusinessFromStorage()
      
      storage.createSale({
        business_id: business.id,
        customer_id: selectedCustomer || null,
        total_amount: cartTotal.toString(),
        payment_method: paymentMethod,
        sale_items: cart.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.price,
        })),
      })

      setCart([])
      setSelectedCustomer('')
      setPaymentMethod('cash')
      fetchProducts()
      alert('Sale completed successfully!')
    } catch (error: any) {
      console.error('Error creating sale:', error)
      alert(error.message || 'Failed to complete sale')
    } finally {
      setIsSubmitting(false)
    }
  }

  const filteredProducts = products.filter(product =>
    product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-lg">Loading sales...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="p-4 lg:p-8 pt-16 lg:pt-8">
          <h1 className="text-2xl lg:text-3xl font-bold mb-6 lg:mb-8">Point of Sale</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Products</CardTitle>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search products..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-2 gap-4">
                    {filteredProducts.map((product) => (
                      <Card
                        key={product.id}
                        className="cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => addToCart(product)}
                      >
                        <CardContent className="p-4">
                          <div className="font-medium mb-2">{product.name}</div>
                          <div className="text-lg font-bold text-blue-600">
                            {formatCurrency(product.selling_price)}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Stock: {product.stock_qty}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  {filteredProducts.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No products available
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div>
              <Card className="sticky top-8">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Cart ({cart.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Customer (Optional)</Label>
                    <Select value={selectedCustomer} onValueChange={(value) => setSelectedCustomer(value || '')}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select customer" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Walk-in Customer</SelectItem>
                        {customers.map((customer) => (
                          <SelectItem key={customer.id} value={customer.id}>
                            {customer.name} - {customer.phone}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Payment Method</Label>
                    <Select value={paymentMethod} onValueChange={(value) => setPaymentMethod(value || 'cash')}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cash">Cash</SelectItem>
                        <SelectItem value="airtel_money">Airtel Money</SelectItem>
                        <SelectItem value="mtn_money">MTN Money</SelectItem>
                        <SelectItem value="zamtel_money">Zamtel Money</SelectItem>
                        <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                        <SelectItem value="card">Card</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="border-t pt-4">
                    <div className="overflow-x-auto">
                      <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Item</TableHead>
                          <TableHead>Qty</TableHead>
                          <TableHead>Total</TableHead>
                          <TableHead></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {cart.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={4} className="text-center py-4">
                              Cart is empty
                            </TableCell>
                          </TableRow>
                        ) : (
                          cart.map((item) => (
                            <TableRow key={item.product_id}>
                              <TableCell className="font-medium">{item.product_name}</TableCell>
                              <TableCell>
                                <Input
                                  type="number"
                                  min="1"
                                  value={item.quantity}
                                  onChange={(e) => updateQuantity(item.product_id, Math.max(1, parseInt(e.target.value, 10) || 1))}
                                  className="w-16 h-8"
                                />
                              </TableCell>
                              <TableCell>{formatCurrency(item.total)}</TableCell>
                              <TableCell>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => removeFromCart(item.product_id)}
                                >
                                  <Trash2 className="h-4 w-4 text-red-600" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                    </div>
                  </div>

                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total:</span>
                      <span>{formatCurrency(cartTotal)}</span>
                    </div>
                    <Button
                      className="w-full"
                      size="lg"
                      onClick={handleCheckout}
                      disabled={cart.length === 0 || isSubmitting}
                    >
                      {isSubmitting ? 'Processing...' : 'Complete Sale'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
