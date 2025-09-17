# MERN Inventory Management System

Image:
<img width="1068" height="595" alt="Image" src="https://github.com/user-attachments/assets/a7163c48-bf6c-49f2-9cfc-63277eefcd86" />

Recording of the Project:
https://www.loom.com/share/ae5255fe2457430f8505a2db209623b5?sid=e19c18dc-575d-4d59-9fc8-9ab118a13f04

## Overview
A full-stack inventory management system for an online store with real-time stock tracking, built using the MERN stack (MongoDB, Express, React, Node.js).

## Features
- Product catalog with stock levels, search, and low stock alerts
- Shopping cart simulation and checkout
- Order history for users
- Prevents overselling and handles concurrent orders
- Real-time stock updates and order fulfillment

## Project Structure
- `/client` - React frontend
- `/server` - Express backend with MongoDB

## Setup Instructions

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB (local or Atlas)

### Backend Setup
1. Go to the `server` directory:
   ```
   cd server
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file with:
   ```
   MONGO_URI=mongodb://localhost:27017/inventory
   PORT=5000
   ```
4. Start the backend:
   ```
   npm start
   ```

### Frontend Setup
1. Go to the `client` directory:
   ```
   cd client
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Start the frontend:
   ```
   npm start
   ```

The React app runs on [http://localhost:3000](http://localhost:3000) and connects to the backend API at [http://localhost:5000](http://localhost:5000).

## API Documentation

### Product Management
- `GET /api/products` - List products with stock levels
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product details
- `GET /api/products/low-stock` - Get products with < 10 items
- `PUT /api/products/:id/stock` - Update stock quantity

### Order Management
- `POST /api/orders` - Create new order
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id/status` - Update order status
- `POST /api/orders/:id/fulfill` - Process order fulfillment
- `GET /api/users/:id/orders` - Get user's order history

### Category Management
- `GET /api/categories` - List categories
- `POST /api/categories` - Create category

## Architecture Notes
- **Data Consistency:** All stock updates and order fulfillment are handled atomically to prevent overselling.
- **Business Logic:** Orders cannot be placed for more than available stock. Stock is decremented only on fulfillment.
- **Scaling:** The backend is stateless and can be scaled horizontally. For high concurrency, MongoDB transactions or distributed locks can be used.
- **Error Handling:** All endpoints return clear error messages for invalid input or business rule violations.

## Demo User
- The frontend uses a demo user ID for order history and checkout simulation.

---

**Developed with the MERN stack for robust, real-time inventory management.**
