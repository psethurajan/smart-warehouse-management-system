# Smart Warehouse Management System (SWMS)

A full-stack **Warehouse and Inventory Management System** built using the **MERN stack**. The system helps manage products, stock, suppliers, warehouses, purchase orders, employees, and stock transactions through a simple role-based dashboard.

The application supports **Admin, Manager, and Staff** roles, with different permissions and access for each user.

---

## 🚀 Tech Stack

### Frontend

* React.js (Vite)
* JavaScript
* React Router DOM
* Context API
* Axios
* Recharts
* React Icons
* CSS

### Backend

* Node.js
* Express.js
* JWT Authentication
* bcryptjs

### Database

* MongoDB
* Mongoose
* MongoDB Atlas

---

## 📁 Project Structure

```text
swms/
│
├── backend/
│   ├── config/          # Database connection
│   ├── models/          # MongoDB/Mongoose models
│   ├── controllers/     # Application business logic
│   ├── routes/          # API routes
│   ├── middleware/      # Authentication & role authorization
│   ├── seed/            # Sample database data
│   ├── server.js
│   └── .env
│
└── frontend/
    └── src/
        ├── api/         # Axios configuration
        ├── context/     # Authentication context
        ├── components/  # Reusable UI components
        ├── pages/       # Application pages
        └── styles/      # Global styles
```

The backend follows a simple **Model → Controller → Route** structure, while the frontend is divided into reusable components and separate pages.

---

## ✨ Main Features

### 🔐 Authentication & Roles

* JWT-based user authentication
* Three user roles:

  * Admin
  * Manager
  * Staff
* Role-based access control
* Protected routes
* Different sidebar options and actions based on user role

### 📦 Product Management

* Add, edit and delete products
* Product search
* Category filtering
* Stock-level filtering
* Pagination
* Track current stock quantity

### 🏷️ Category Management

* Create, update and delete categories
* Assign categories to products

### 🚚 Supplier Management

* Add and manage suppliers
* Store supplier information
* Connect suppliers with products and purchase orders

### 🏢 Warehouse Management

* Create and manage warehouses
* Track products across different warehouses

### 🛒 Purchase Orders

Purchase orders follow a simple workflow:

```text
Pending → Approved / Rejected → Received
```

When a purchase order is received:

* Product stock is automatically updated
* Stock transaction is created
* The stock movement is recorded for future tracking

### 📊 Stock Transactions

Supports different types of stock movements:

* Stock In
* Stock Out
* Stock Adjustment

Every stock change updates the product's current stock and creates a transaction record.

### 📈 Dashboard

The dashboard provides a quick overview of the warehouse:

* Total Products
* Total Stock
* Stock Movement
* Low Stock Products
* Products by Category
* Purchase Order information

Charts are created using **Recharts**.

### 👥 Employee Management

* Admin can create employees
* Create Manager and Staff accounts
* Manage employee information
* Role-based permissions

### 📱 Responsive Design

* Desktop and mobile responsive layout
* Collapsible sidebar
* Mobile hamburger menu
* Clean dashboard interface

### 🎨 UI Features

* Branded splash screen
* Professional login page
* Teal-based theme
* Dark sidebar
* Reusable cards, tables and modals
* CSS variables for easy theme customization

---

## ⚙️ Installation & Setup

### 1. Clone the project

```bash
git clone <your-repository-url>
cd swms
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file:

```env
PORT=5000
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
```

Make sure your MongoDB Atlas IP address is allowed in **Network Access**.

### 3. Seed Sample Data

The project includes sample data for testing.

```bash
npm run seed
```

This creates sample:

* Users
* Categories
* Suppliers
* Warehouses
* Products
* Purchase Orders
* Stock Transactions

### 4. Start Backend

```bash
npm run dev
```

Backend will run on:

```text
http://localhost:5000
```

### 5. Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend will run on:

```text
http://localhost:3000
```

---

## 🔑 Demo Login

| Role    | Email                                       | Password   |
| ------- | ------------------------------------------- | ---------- |
| Admin   | [admin@swms.com](mailto:admin@swms.com)     | admin123   |
| Manager | [manager@swms.com](mailto:manager@swms.com) | manager123 |
| Staff   | [staff@swms.com](mailto:staff@swms.com)     | staff123   |

---

## 🧠 Key Concepts Used

### JWT Authentication

JWT is used to authenticate users. After login, the token is stored on the frontend and sent with API requests using Axios.

### Role-Based Access Control

Users have different permissions depending on their role. Backend middleware protects APIs while frontend protected routes control page access.

### Context API

React Context API is used to manage authentication and logged-in user information across the application.

### Mongoose Relationships

MongoDB ObjectId references are used to connect products with categories, suppliers and warehouses.

### Stock Audit Trail

Stock is not directly changed from the UI. Stock movements are handled through transactions so every stock change has a record.

### Search, Filter & Pagination

Product data can be searched and filtered using query parameters, with pagination used to handle larger product lists.

### Dashboard Data

Dashboard statistics and chart data are generated from product and transaction data.

---

## 🎯 Project Goal

The main goal of this project is to build a practical warehouse management application that demonstrates how a real-world MERN application can handle:

* Authentication
* Role-based permissions
* CRUD operations
* REST APIs
* MongoDB relationships
* Inventory management
* Stock tracking
* Purchase workflows
* Dashboard analytics
* Responsive UI
