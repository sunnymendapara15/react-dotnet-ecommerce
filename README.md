# React + .NET Ecommerce Demo

This repository contains a light-weight ecommerce prototype backed by a minimal .NET cart API and a React/Vite frontend.

## Pages

- **Product Listing** – browse curated products and select or unselect them to build a cart.
- **Cart / Checkout** – review the selection, remove unwanted items, and see the subtotal/total calculations.

## Architecture

- **Backend**: `backend/CartApi` is a minimal .NET 8 Web API that exposes product data plus cart `select`/`unselect` endpoints.
- **Frontend**: `frontend` hosts a React app powered by Vite. React Router switches between the two key views and syncs selections with the API.

## Requirements

- [.NET 8 SDK](https://dotnet.microsoft.com/en-us/download/dotnet/8.0)
- [Node.js 20+](https://nodejs.org/) (for Vite)

## Running locally

1. **Backend**
   ```bash
   cd backend/CartApi
   dotnet restore
   dotnet run
   ```
   The API listens on `http://localhost:5000` and exposes:
   - `GET /api/products` – product catalog with selection hints.
   - `POST /api/cart/select` – add a product to the cart.
   - `POST /api/cart/unselect` – remove a product from the cart.
   - `GET /api/cart` – current cart contents with summary.

2. **Frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   Vite serves the React app at `http://localhost:5173`. The listing page lets shoppers toggle product selection, and the cart page shows the selected items along with removal controls.

## Highlights

- Cart selection/unselection is driven by the backend so the two React pages stay in sync through shared API state.
- Simple styling and layout showcase the two primary flows — discovery and checkout.
- Ready for expansion by wiring up persistence, user sessions, or payment simulation.
