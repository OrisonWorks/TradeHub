'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Sidebar } from '@/components/layout/sidebar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Plus, Search, Edit, Trash2, Phone, Mail, Building } from 'lucide-react'
import { storage } from '@/lib/storage'
import { getBusinessFromStorage } from '@/lib/utils'

interface Supplier {
  id: string
  supplier_name: string
  contact_person: string | null
  phone: string
  email: string | null
  created_at: string
}

export default function SuppliersPage() {
  const router = useRouter()
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    supplier_name: '',
    contact_person: '',
    phone: '',
    email: '',
  })

  const fetchSuppliers = useCallback(() => {
    try {
      const business = getBusinessFromStorage()
      if (!business.id) {
        router.push('/login')
        return
      }

      const data = storage.getSuppliersByBusinessId(business.id)
      setSuppliers(data)
    } catch (error) {
      console.error('Error fetching suppliers:', error)
    } finally {
      setLoading(false)
    }
  }, [router])

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }

    fetchSuppliers()
  }, [router, fetchSuppliers])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const business = getBusinessFromStorage()
      
      if (editingSupplier) {
        storage.updateSupplier(editingSupplier.id, formData)
      } else {
        storage.createSupplier({
          business_id: business.id,
          ...formData,
        })
      }

      setIsAddDialogOpen(false)
      setEditingSupplier(null)
      setFormData({
        supplier_name: '',
        contact_person: '',
        phone: '',
        email: '',
      })
      fetchSuppliers()
    } catch (error) {
      console.error('Error saving supplier:', error)
      alert('Failed to save supplier')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = (id: string) => {
    if (!confirm('Are you sure you want to delete this supplier?')) {
      return
    }

    try {
      storage.deleteSupplier(id)
      fetchSuppliers()
    } catch (error) {
      console.error('Error deleting supplier:', error)
      alert('Failed to delete supplier')
    }
  }

  const handleEdit = (supplier: Supplier) => {
    setEditingSupplier(supplier)
    setFormData({
      supplier_name: supplier.supplier_name,
      contact_person: supplier.contact_person || '',
      phone: supplier.phone,
      email: supplier.email || '',
    })
    setIsAddDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      supplier_name: '',
      contact_person: '',
      phone: '',
      email: '',
    })
  }

  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.supplier_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.phone?.includes(searchTerm) ||
    supplier.contact_person?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-lg">Loading suppliers...</div>
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
            <h1 className="text-2xl lg:text-3xl font-bold">Supplier Management</h1>
            <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
              setIsAddDialogOpen(open)
              if (!open) {
                setEditingSupplier(null)
                resetForm()
              }
            }}>
              <DialogTrigger>
                <Button onClick={() => setEditingSupplier(null)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Supplier
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingSupplier ? 'Edit Supplier' : 'Add New Supplier'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="supplier_name">Company Name *</Label>
                    <Input
                      id="supplier_name"
                      value={formData.supplier_name}
                      onChange={(e) => setFormData({ ...formData, supplier_name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact_person">Contact Person</Label>
                    <Input
                      id="contact_person"
                      value={formData.contact_person}
                      onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone *</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsAddDialogOpen(false)
                        setEditingSupplier(null)
                        resetForm()
                      }}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? 'Saving...' : (editingSupplier ? 'Update' : 'Add') + ' Supplier'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Total Suppliers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{suppliers.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <CardTitle>All Suppliers</CardTitle>
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search suppliers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Company</TableHead>
                    <TableHead>Contact Person</TableHead>
                    <TableHead>Contact Info</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSuppliers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8">
                        No suppliers found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredSuppliers.map((supplier) => (
                      <TableRow key={supplier.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            <Building className="h-4 w-4 mr-2 text-muted-foreground" />
                            {supplier.supplier_name}
                          </div>
                        </TableCell>
                        <TableCell>{supplier.contact_person || '-'}</TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center text-sm">
                              <Phone className="h-3 w-3 mr-1" />
                              {supplier.phone}
                            </div>
                            {supplier.email && (
                              <div className="flex items-center text-sm text-muted-foreground">
                                <Mail className="h-3 w-3 mr-1" />
                                {supplier.email}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEdit(supplier)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDelete(supplier.id)}
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          </div>
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
