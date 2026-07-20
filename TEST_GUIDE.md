# TradeHub Testing Guide

This guide provides test scenarios for users to test the TradeHub inventory management system.

## Prerequisites

- Node.js installed
- Clone the repository
- Run `npm install` to install dependencies
- Run `npm run dev` to start the development server
- Open http://localhost:3000 in your browser

## Test Scenarios

### 1. User Registration
**Steps:**
1. Navigate to `/register`
2. Fill in the registration form:
   - Business Name: Test Business
   - Email: test@example.com
   - Password: Test123!
   - Confirm Password: Test123!
3. Click "Register"

**Expected Result:**
- User is redirected to the dashboard
- Business information is stored in localStorage

### 2. User Login
**Steps:**
1. Navigate to `/login`
2. Enter registered credentials:
   - Email: test@example.com
   - Password: Test123!
3. Click "Login"

**Expected Result:**
- User is redirected to the dashboard
- Authentication token is stored in localStorage

### 3. Dashboard Overview
**Steps:**
1. After login, view the dashboard
2. Check the summary cards (Total Sales, Total Orders, Total Revenue)

**Expected Result:**
- Dashboard displays summary statistics
- All metrics show ZMW currency format
- Navigation sidebar is visible

### 4. Inventory Management
**Steps:**
1. Navigate to "Inventory" from sidebar
2. Click "Add Product"
3. Fill in product details:
   - Product Name: Test Product
   - Barcode: 123456789
   - Category: Electronics
   - Cost Price: 150.00
   - Selling Price: 250.00
   - Stock Quantity: 50
   - Reorder Level: 10
4. Click "Add Product"
5. Verify product appears in the table
6. Test editing the product
7. Test deleting the product

**Expected Result:**
- Product is added successfully
- Currency displays as ZMW (e.g., ZMW 150.00)
- Product appears in the inventory table
- Edit and delete functions work correctly
- Low stock badge appears when stock <= reorder level

### 5. Customer Management
**Steps:**
1. Navigate to "Customers" from sidebar
2. Click "Add Customer"
3. Fill in customer details:
   - Name: John Doe
   - Phone: +260971234567
   - Email: john@example.com
   - Address: Lusaka, Zambia
4. Click "Add Customer"
5. Verify customer appears in the table
6. Test search functionality
7. Test editing and deleting customers

**Expected Result:**
- Customer is added successfully
- Customer appears in the table with contact details
- Search filters customers by name, phone, or email
- Edit and delete functions work correctly

### 6. Order Management
**Steps:**
1. Navigate to "Orders" from sidebar
2. Click "New Order"
3. Fill in order details:
   - Select a customer from dropdown
   - Total Amount: 500.00
   - Delivery Address: Test Address, Lusaka
   - Delivery Fee: 50.00
4. Click "Create Order"
5. Verify order appears in the table
6. Test changing order status (pending → confirmed → delivered)
7. Verify payment status badge

**Expected Result:**
- Order is created successfully
- Currency displays as ZMW
- Order appears in the table with customer details
- Status dropdown updates order status
- Payment status badge is visible

### 7. Expense Management
**Steps:**
1. Navigate to "Expenses" from sidebar
2. Click "Add Expense"
3. Fill in expense details:
   - Category: rent
   - Amount: 5000.00
   - Description: Monthly rent
   - Date: Today's date
4. Click "Add Expense"
5. Verify expense appears in the table
6. Check total expenses calculation
7. Test deleting expenses

**Expected Result:**
- Expense is added successfully
- Currency displays as ZMW
- Total expenses card updates correctly
- This month's expenses card shows filtered data
- Delete function works correctly

### 8. Sales Management
**Steps:**
1. Navigate to "Sales" from sidebar
2. Create a new sale
3. Select products and customer
4. Verify sale is recorded
5. Check sales history

**Expected Result:**
- Sale is created successfully
- Products are deducted from inventory
- Customer sales count increases
- Currency displays as ZMW

### 9. Reports
**Steps:**
1. Navigate to "Reports" from sidebar
2. View sales trends
3. View inventory reports
4. Check expense summaries

**Expected Result:**
- Reports display data in ZMW
- Charts and tables render correctly
- Data is accurate based on transactions

### 10. Logout
**Steps:**
1. Click "Logout" in the sidebar
2. Verify redirection to login page

**Expected Result:**
- User is logged out
- Token is cleared from localStorage
- Redirected to login page

## Currency Format Verification

All monetary values should display in Zambian Kwacha (ZMW) format:
- Example: ZMW 1,500.00
- Uses locale: en-ZM
- Decimal separator: .
- Thousands separator: ,

## Known Limitations

- Data is stored in localStorage (client-side only)
- No backend/database integration
- Data persists only in the browser
- No multi-user support
- No real-time updates

## Browser Compatibility

Tested on:
- Chrome (latest)
- Firefox (latest)
- Edge (latest)
- Safari (latest)

## Reporting Issues

If you encounter any issues:
1. Note the browser and version
2. Describe the steps to reproduce
3. Include any error messages from the browser console
4. Report the expected vs actual behavior
