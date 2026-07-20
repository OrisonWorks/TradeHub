# TradeHub Business Management System

A comprehensive cloud-based business management application designed to help businesses manage sales, inventory, orders, expenses, customers, suppliers, employees, and reports. Built for the Zambian and African market.

## Features

- **Authentication & Security**
  - User registration and login
  - Password reset with OTP
  - JWT-based authentication
  - Role-based access control (Admin, Business Owner, Cashier, Store Manager, Accountant)

- **Business Management**
  - Business registration with TPIN support
  - Multi-user support per business
  - Subscription-based access (Starter, Business, Enterprise)

- **Inventory Management**
  - Product registration with barcode support
  - Stock tracking and low stock alerts
  - Stock adjustments and transfers
  - Reorder level management

- **Sales & POS**
  - Point of Sale interface
  - Multiple payment methods (Cash, Airtel Money, MTN Money, Zamtel Money, Bank Transfer, Card)
  - Receipt generation
  - Sales history tracking

- **Order Processing**
  - Order status workflow (Pending → Confirmed → Processing → Packed → Dispatched → Delivered)
  - Delivery tracking
  - Payment status management

- **Expense Management**
  - Categorized expense tracking
  - Monthly expense reports
  - Budget management

- **Customer Management**
  - Customer profiles
  - Purchase history
  - Contact management

- **Supplier Management**
  - Supplier profiles
  - Contact information
  - Product supply tracking

- **Reports & Analytics**
  - Sales reports (Daily, Weekly, Monthly, Annual)
  - Inventory reports
  - Profit & Loss statements
  - Financial summaries

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **UI Components**: shadcn/ui, TailwindCSS
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT, bcryptjs
- **Validation**: Zod

## Prerequisites

- Node.js 18+ 
- PostgreSQL database
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd TradeHub
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/tradehub"
   JWT_SECRET="your-secret-key-change-in-production"
   ```

4. **Set up the database**
   
   Run Prisma migrations to create the database schema:
   ```bash
   npx prisma migrate dev --name init
   ```

   Generate the Prisma client:
   ```bash
   npx prisma generate
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open the application**
   
   Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

## Database Schema

The application uses the following main tables:

- `businesses` - Business information
- `users` - User accounts with roles
- `products` - Product inventory
- `customers` - Customer profiles
- `suppliers` - Supplier information
- `sales` - Sales transactions
- `sale_items` - Individual sale line items
- `expenses` - Expense records
- `orders` - Customer orders
- `inventory_transactions` - Stock movement history

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new business
- `POST /api/auth/login` - User login
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password
- `POST /api/auth/change-password` - Change password

### Products
- `GET /api/products` - List all products
- `POST /api/products` - Create new product
- `GET /api/products/:id` - Get single product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Sales
- `GET /api/sales` - List all sales
- `POST /api/sales` - Create new sale

### Orders
- `GET /api/orders` - List all orders
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id/status` - Update order status

### Expenses
- `GET /api/expenses` - List all expenses
- `POST /api/expenses` - Create new expense

### Customers
- `GET /api/customers` - List all customers
- `POST /api/customers` - Create new customer

### Suppliers
- `GET /api/suppliers` - List all suppliers
- `POST /api/suppliers` - Create new supplier

### Reports
- `GET /api/reports?type=sales&period=monthly` - Sales report
- `GET /api/reports?type=inventory` - Inventory report
- `GET /api/reports?type=profit&period=monthly` - Profit & Loss report

### Dashboard
- `GET /api/dashboard` - Dashboard metrics

## User Roles

### System Administrator
- Manage businesses
- Manage subscriptions
- Manage users
- View all data

### Business Owner
- Full business access
- Reports
- Inventory
- Orders
- Employees

### Cashier
- Sales
- Customer orders
- Receipt printing

### Store Manager
- Inventory
- Suppliers
- Stock transfers

### Accountant
- Expenses
- Financial reports

## Payment Methods Supported

- Cash
- Airtel Money
- MTN Money
- Zamtel Money
- Bank Transfer
- Card

## Subscription Packages

### Starter
- 1 User
- 500 Products
- Basic Reports

### Business
- 10 Users
- Unlimited Products
- Advanced Reports

### Enterprise
- Unlimited Users
- Multi-Branch
- API Access

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Database Commands

- `npx prisma migrate dev` - Create and run migrations
- `npx prisma migrate deploy` - Deploy migrations to production
- `npx prisma studio` - Open Prisma Studio (database GUI)
- `npx prisma generate` - Generate Prisma client

## Security Considerations

- Change `JWT_SECRET` in production
- Use environment variables for sensitive data
- Enable HTTPS in production
- Implement rate limiting for API endpoints
- Add input validation and sanitization
- Regular security audits

## Future Enhancements

- Employee management module
- Push notification system
- SMS/WhatsApp receipt integration
- Barcode scanning integration
- Multi-currency support
- Mobile app (React Native)
- Advanced analytics dashboard
- API documentation (Swagger)
- Multi-language support

## License

This project is proprietary software. All rights reserved.

## Support

For support, contact Chef Steve Inambao Godwin Njekwa.

## Acknowledgments

- Built with Next.js and shadcn/ui
- Database powered by PostgreSQL and Prisma
- Icons by Lucide React
