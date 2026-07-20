import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getBusinessFromStorage() {
  if (typeof window === 'undefined') return { id: '' }
  try {
    const business = JSON.parse(localStorage.getItem('business') || '{}')
    return business
  } catch (error) {
    console.error('Error parsing business from storage:', error)
    return { id: '' }
  }
}

export function getUserFromStorage() {
  if (typeof window === 'undefined') return { role: null }
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    return user
  } catch (error) {
    console.error('Error parsing user from storage:', error)
    return { role: null }
  }
}

export function formatDate(dateString: string) {
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return 'Invalid Date'
    return date.toLocaleDateString()
  } catch {
    return 'Invalid Date'
  }
}

export function formatCurrency(amount: string | number) {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount
  if (isNaN(num)) return new Intl.NumberFormat('en-ZM', {
    style: 'currency',
    currency: 'ZMW',
  }).format(0)
  return new Intl.NumberFormat('en-ZM', {
    style: 'currency',
    currency: 'ZMW',
  }).format(num)
}
