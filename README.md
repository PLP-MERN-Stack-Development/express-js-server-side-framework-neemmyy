# My Express App (PLP Bookstore API)

A small Express.js REST API that manages an in-memory list of products. This repository is intended as a learning / starter project and demonstrates routing, middleware, validation, and error handling.

## Table of contents
- Project overview
- Requirements
- Install
- Running the app (development / production)
- API endpoints
- Request / response examples
- Project structure
- Notes & troubleshooting
- Recommended improvements
- License

## Project overview

This API exposes CRUD endpoints for `products` and includes simple features such as filtering, searching, pagination and basic stats. Data is stored in memory (an array) so it resets on server restart.

This project is intentionally minimal and suitable for local development, demos, or as a foundation for adding persistence (database), authentication and tests.

## Requirements

- Node.js 16+ (or later)
- npm

## Install

Clone or copy the repository, then install dependencies:

```powershell
cd "c:\Users\USER\OneDrive\Desktop\My express app\my-express-app"
npm install
```

## Running the app

Start in production mode:

```powershell
npm start
```

Start in development mode (auto-restart on file changes):

```powershell
npm run dev
# or
npx nodemon server.js
```

By default the server listens on port `3000`. You can override with the `PORT` environment variable. Example using PowerShell to set the variable for the current session:

```powershell
$env:PORT = 4000; npm start
```

If you plan to use environment variables from a `.env` file, add `require('dotenv').config()` to the top of `server.js` or start the app via a small bootstrap file that loads dotenv first.

## API Endpoints

Base URL: `http://localhost:3000`

Products endpoints (mounted at `/api/products`):

- GET `/api/products` — list products. Supports query params: `category`, `search`, `page`, `limit`.
- GET `/api/products/:id` — get a single product by id.
- POST `/api/products` — create a new product. Required: at least `name` and `price` (validation may be present in middleware).
- PUT `/api/products/:id` — update a product (full or partial depending on middleware behavior).
- DELETE `/api/products/:id` — delete a product.
- GET `/api/products/stats/category` — product counts grouped by category.

All endpoints return JSON. Error responses use standard HTTP status codes (400, 404, 500) and return JSON describing the error.
# PLP Bookstore API — Detailed README

This repository contains a small Express.js REST API that manages an in-memory catalog of products. It demonstrates a realistic project layout, middleware wiring, request validation, error handling, and query features such as filtering, searching and pagination.

This README is organized to help you get started quickly, understand the API surface, troubleshoot common issues, and plan production improvements.

## Table of contents
- Requirements
- Quick start
- Configuration
- Running (development & production)
- API reference (endpoints, parameters, examples)
- Data model & validation
- Project layout
- Troubleshooting & common errors
- Recommended improvements
- Contributing & license

## Requirements

- Node.js 16+ (LTS recommended)
- npm (or yarn)

## Quick start

1. Install dependencies:

```powershell
cd "c:\Users\USER\OneDrive\Desktop\My express app\my-express-app"
npm install
```

2. Start the server (production-like):

```powershell
npm start
```

3. Start in development mode (auto-reload changes):

```powershell
npm run dev
# or
npx nodemon server.js
```

Default port is `3000`. To override for the current PowerShell session:

```powershell
$env:PORT=4000; npm start
```

## Configuration

- Use `.env` for environment variables (copy `.env.example` → `.env`). Add `require('dotenv').config()` at the top of `server.js` if you want automatic env loading.

## API reference

Base URL: `http://localhost:3000`

All endpoints return JSON. Errors use standard HTTP status codes and a JSON message.

### GET /api/products

- Purpose: list products
- Query params (optional):
	- `category` — string (case-insensitive exact match)
	- `search` — string (case-insensitive substring match on product name)
	- `page` — number (default 1)
	- `limit` — number (default 5)

Example response:

```json
{
	"page": 1,
	"limit": 5,
	"totalProducts": 10,
	"totalPages": 2,
	"data": [ /* products */ ]
}
```

### GET /api/products/:id

- Purpose: get product by ID
- Success: 200 with product JSON
- Error: 404 if not found

### POST /api/products

- Purpose: create a new product
- Required (basic): `name`, `price`
- Body (application/json):

```json
{
	"name": "Example",
	"description": "optional",
	"price": 19.99,
	"category": "Electronics",
	"inStock": true
}
```

- Success: 201 Created with created product object (includes generated `id`)
- Error: 400 Bad Request for validation failures

### PUT /api/products/:id

- Purpose: update a product (partial or full depending on validation)
- Success: 200 with updated product
- Errors: 400 validation, 404 not found

### DELETE /api/products/:id

- Purpose: delete a product
- Success: 200 with deletion info

### GET /api/products/stats/category

- Purpose: return counts grouped by category, e.g. `{ "Electronics": 4, "Home": 3 }`.

## Data model & validation

Product shape used in-memory:

```json
{
	"id": "uuid",
	"name": "string",
	"description": "string",
	"price": number,
	"category": "string",
	"inStock": boolean
}
```

- Validation: the project uses a `validateProduct` middleware (check `Middleware/validateProduct.js`) that enforces required fields and basic type checks. Adjust or replace with Joi/Zod for more rigid schemas.

## Project layout

```
my-express-app/
├─ server.js               # Entrypoint — mounts middleware & routes
├─ Routes/                 # Route handlers (consider renaming to 'routes')
│  └─ products.js          # Products router (CRUD, search, pagination, stats)
├─ Middleware/             # logger, auth, validation, error handler
├─ Errors/                 # custom Error classes
├─ package.json
└─ README.md
```

Note: For portability, prefer lowercase folder names: `routes`, `middleware`, `errors`.

## Troubleshooting & common errors

- Cannot find module './routes/products'
	- Cause: incorrect path/casing (folder named `Routes` but require uses `./routes/products` or vice versa)
	- Fix: make the require path match the folder name exactly, or rename folders to lowercase for portability.

- GET /api/products/stats/category being routed to `/:id`
	- Cause: Express matches routes in order. If `/:id` is defined before `/stats/category`, the request will be treated as an id.
	- Fix: move the specific route (`/stats/category`) above `/:id` in `routes/products.js`.

- POST/PUT requests return `undefined` body or validation errors
	- Cause: missing JSON body parser
	- Fix: ensure `server.js` contains `app.use(express.json())` before routes are mounted.

- EADDRINUSE: port already in use
	- Fix: find and stop the process listening on the port (see "Port / process troubleshooting" below) or change PORT.

Port / process troubleshooting (PowerShell)

```powershell
netstat -ano | findstr :3000
tasklist /FI "PID eq <PID_FROM_PREVIOUS>"
taskkill /PID <PID_FROM_PREVIOUS> /F
```

## Recommended improvements

1. Rename folders to lowercase (`Routes` → `routes`, etc.) for cross-platform compatibility.
2. Replace in-memory storage with a persistent DB (SQLite/Postgres/Mongo).
3. Adopt a validation library (Joi/Zod) and centralize error responses.
4. Add automated tests (Jest + Supertest) and a CI workflow.
5. Add structured logging (winston/pino) and observability.

## Contributing & license

- Contributions welcome. Please add tests for new features and keep the API contract stable.
- Add a `LICENSE` file if you want to publish with a license.

## Actions I can take for you (pick one or more)

1. Rename `Routes` → `routes` and update all imports (recommended)
2. Move `/stats/category` above the `/:id` route in `Routes/products.js` (fixes a real bug)
3. Remove unused dependencies from `package.json` and optionally add `dotenv` usage

Tell me which you'd like and I'll apply the changes and verify the server runs.

