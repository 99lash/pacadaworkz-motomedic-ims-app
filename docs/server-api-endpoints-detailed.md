## API ENDPOINT STRUCTURE

**Annotations:**

-   `(AP)` - Admin/Superadmin only
-   `(WP)` - With permission (role-based access)
-   `(Auth)` - Requires authentication token
-   `(Paginated)` - Supports pagination
-   `(Filterable)` - Supports filtering
-   `(Searchable)` - Supports search
-   `(File)` - File upload/download

**Standard Query Parameters (paginated endpoints):**

-   `page` (default: 1)
-   `limit` (default: 20)
-   `sort` (varies per endpoint)
-   `order` (asc|desc, default: desc)

**Standard Response Format:**

```json
{
  "success": true,
  "data": [...],
  "meta": {
    "current_page": 1,
    "per_page": 20,
    "total": 100,
    "total_pages": 5
  }
}
```

---

### Authentication

| Method | Endpoint                    | Description                          | Access |
| ------ | --------------------------- | ------------------------------------ | ------ |
| `GET`  | `/api/v1/auth/me`           | Get current authenticated user info  | Auth   |
| `POST` | `/api/v1/auth/login`        | Login with email/username & password | Public |
| `POST` | `/api/v1/auth/login/google` | Login with Google OAuth              | Public |
| `POST` | `/api/v1/auth/logout`       | Logout current session               | Auth   |
| `POST` | `/api/v1/auth/refresh`      | Refresh access token                 | Auth   |

---

### Users

| Method   | Endpoint                           | Description               | Access | Features                          |
| -------- | ---------------------------------- | ------------------------- | ------ | --------------------------------- |
| `GET`    | `/api/v1/users`                    | List all users            | AP     | Paginated, Searchable, Filterable |
| `GET`    | `/api/v1/users/:id`                | Get specific user details | AP, WP | -                                 |
| `POST`   | `/api/v1/users`                    | Create new user           | AP, WP | -                                 |
| `POST`   | `/api/v1/users/:id/reset-password` | Reset user password       | AP, WP | -                                 |
| `PATCH`  | `/api/v1/users/:id`                | Update user details       | AP, WP | -                                 |
| `DELETE` | `/api/v1/users/:id`                | Delete user (soft delete) | AP     | -                                 |

---

### Roles & Permissions

| Method   | Endpoint                        | Description                    | Access | Features |
| -------- | ------------------------------- | ------------------------------ | ------ | -------- |
| `GET`    | `/api/v1/roles`                 | List all roles                 | AP     | -        |
| `GET`    | `/api/v1/roles/:id`             | Get specific role details      | AP     | -        |
| `POST`   | `/api/v1/roles`                 | Create new role                | AP     | -        |
| `PUT`    | `/api/v1/roles/:id`             | Update role details            | AP     | -        |
| `DELETE` | `/api/v1/roles/:id`             | Delete role (soft delete)      | AP     | -        |
| `GET`    | `/api/v1/permissions`           | List all available permissions | AP     | -        |
| `POST`   | `/api/v1/roles/:id/permissions` | Assign permissions to role     | AP     | -        |

---

### Products

| Method   | Endpoint                                       | Description                   | Access | Features                          |
| -------- | ---------------------------------------------- | ----------------------------- | ------ | --------------------------------- |
| `GET`    | `/api/v1/products`                             | List all products             | AP     | Paginated, Searchable, Filterable |
| `GET`    | `/api/v1/products/:id`                         | Get specific product details  | AP     | -                                 |
| `POST`   | `/api/v1/products`                             | Create new product            | AP     | -                                 |
| `PUT`    | `/api/v1/products/:id`                         | Update product details        | AP     | -                                 |
| `DELETE` | `/api/v1/products/:id`                         | Delete product (soft delete)  | AP     | -                                 |
| `POST`   | `/api/v1/products/:id/attributes/:attributeId` | Assign attribute to product   | AP     | -                                 |
| `DELETE` | `/api/v1/products/:id/attributes/:attributeId` | Remove attribute from product | AP     | -                                 |
| `GET`    | `/api/v1/products/export`                      | Export products to CSV/Excel  | AP     | File Download                     |

---

### Categories

| Method   | Endpoint                 | Description                   | Access | Features              |
| -------- | ------------------------ | ----------------------------- | ------ | --------------------- |
| `GET`    | `/api/v1/categories`     | List all categories           | AP     | Paginated, Searchable |
| `GET`    | `/api/v1/categories/:id` | Get specific category details | AP     | -                     |
| `POST`   | `/api/v1/categories`     | Create new category           | AP     | -                     |
| `PUT`    | `/api/v1/categories/:id` | Update category details       | AP     | -                     |
| `DELETE` | `/api/v1/categories/:id` | Delete category (soft delete) | AP     | -                     |

---

### Brands

| Method   | Endpoint             | Description                | Access | Features              |
| -------- | -------------------- | -------------------------- | ------ | --------------------- |
| `GET`    | `/api/v1/brands`     | List all brands            | AP     | Paginated, Searchable |
| `GET`    | `/api/v1/brands/:id` | Get specific brand details | AP     | -                     |
| `POST`   | `/api/v1/brands`     | Create new brand           | AP     | -                     |
| `PUT`    | `/api/v1/brands/:id` | Update brand details       | AP     | -                     |
| `DELETE` | `/api/v1/brands/:id` | Delete brand (soft delete) | AP     | -                     |

---

### Attributes

| Method   | Endpoint                        | Description                    | Access | Features              |
| -------- | ------------------------------- | ------------------------------ | ------ | --------------------- |
| `GET`    | `/api/v1/attributes`            | List all attributes            | AP     | Paginated, Searchable |
| `GET`    | `/api/v1/attributes/:id`        | Get specific attribute details | AP     | -                     |
| `POST`   | `/api/v1/attributes`            | Create new attribute           | AP     | -                     |
| `PUT`    | `/api/v1/attributes/:id`        | Update attribute details       | AP     | -                     |
| `DELETE` | `/api/v1/attributes/:id`        | Delete attribute (soft delete) | AP     | -                     |
| `POST`   | `/api/v1/attributes/:id/values` | Add values to attribute        | AP     | -                     |

---

### Suppliers

| Method   | Endpoint                | Description                   | Access | Features              |
| -------- | ----------------------- | ----------------------------- | ------ | --------------------- |
| `GET`    | `/api/v1/suppliers`     | List all suppliers            | AP     | Paginated, Searchable |
| `GET`    | `/api/v1/suppliers/:id` | Get specific supplier details | AP     | -                     |
| `POST`   | `/api/v1/suppliers`     | Create new supplier           | AP     | -                     |
| `PUT`    | `/api/v1/suppliers/:id` | Update supplier details       | AP     | -                     |
| `DELETE` | `/api/v1/suppliers/:id` | Delete supplier (soft delete) | AP     | -                     |

---

### Inventory

| Method | Endpoint                                 | Description                            | Access | Features                          |
| ------ | ---------------------------------------- | -------------------------------------- | ------ | --------------------------------- |
| `GET`  | `/api/v1/inventory`                      | List all products with stock levels    | Auth   | Paginated, Searchable, Filterable |
| `GET`  | `/api/v1/inventory/:productId`           | Get specific product inventory details | Auth   | -                                 |
| `GET`  | `/api/v1/inventory/low-stock`            | List products below reorder point      | Auth   | Filterable                        |
| `GET`  | `/api/v1/inventory/out-of-stock`         | List products with zero stock          | Auth   | Filterable                        |
| `POST` | `/api/v1/inventory/:productId/adjust`    | Adjust stock quantity with reason      | Auth   | -                                 |
| `GET`  | `/api/v1/inventory/:productId/movements` | Get stock movement history for product | AP, WP | Filterable                        |

---

### Stock Adjustments

| Method | Endpoint                        | Description                     | Access | Features              |
| ------ | ------------------------------- | ------------------------------- | ------ | --------------------- |
| `GET`  | `/api/v1/stock-adjustments`     | List all stock adjustments      | AP, WP | Paginated, Filterable |
| `POST` | `/api/v1/stock-adjustments`     | Create new stock adjustment     | AP, WP | Updates inventory     |
| `GET`  | `/api/v1/stock-adjustments/:id` | Get specific adjustment details | AP, WP | -                     |
| `PATCH`| `/api/v1/stock-adjustments/:id` | Update adjustment details       | AP, WP | -                     |
| `GET`  | `/api/v1/stock-adjustments/export` | Export adjustments to CSV/Excel | AP, WP | File Download         |

---

### Stock Movement History

| Method | Endpoint                         | Description                             | Access | Features              |
| ------ | -------------------------------- | --------------------------------------- | ------ | --------------------- |
| `GET`  | `/api/v1/stock-movements`        | List all stock movements (unified view) | AP, WP | Paginated, Filterable |
| `GET`  | `/api/v1/stock-movements/:id`    | Get specific movement details           | AP, WP | -                     |
| `GET`  | `/api/v1/stock-movements/export` | Export movements to CSV/Excel           | AP, WP | File Download         |

**Note:** Stock movements include sales, purchases, and adjustments in one unified view.

---

### POS - Cart Management

| Method   | Endpoint                           | Description                    | Access | Features |
| -------- | ---------------------------------- | ------------------------------ | ------ | -------- |
| `GET`    | `/api/v1/pos/cart`                 | Get current user's active cart | Auth   | -        |
| `POST`   | `/api/v1/pos/cart/add-item`        | Add product to cart            | Auth   | -        |
| `PATCH`    | `/api/v1/pos/cart/update-item/:id` | Update cart item quantity      | Auth   | -        |
| `DELETE` | `/api/v1/pos/cart/remove-item/:id` | Remove item from cart          | Auth   | -        |
| `POST`   | `/api/v1/pos/cart/clear`           | Clear all items from cart      | Auth   | -        |
| `POST`   | `/api/v1/pos/cart/apply-discount`  | Apply discount to cart         | Auth   | -        |

---

### POS - Hold Transactions (DRAFT - Future Implementation)

| Method   | Endpoint                             | Description                   | Access | Features |
| -------- | ------------------------------------ | ----------------------------- | ------ | -------- |
| `GET`    | `/api/v1/pos/held-transactions`      | List user's held transactions | Auth   | -        |
| `POST`   | `/api/v1/pos/hold-transaction`       | Hold current cart transaction | Auth   | -        |
| `POST`   | `/api/v1/pos/resume-transaction/:id` | Resume held transaction       | Auth   | -        |
| `DELETE` | `/api/v1/pos/held-transactions/:id`  | Delete held transaction       | Auth   | -        |

**Status:** Not yet implemented. To be developed in future sprint.

---

### POS - Checkout

| Method | Endpoint               | Description                      | Access | Features                        |
| ------ | ---------------------- | -------------------------------- | ------ | ------------------------------- |
| `POST` | `/api/v1/pos/checkout` | Process checkout and create sale | Auth   | Creates sale, deducts inventory |

---

### Sales Transactions

| Method | Endpoint                    | Description                 | Access | Features                          |
| ------ | --------------------------- | --------------------------- | ------ | --------------------------------- |
| `GET`  | `/api/v1/sales`             | List all sales transactions | AP, WP | Paginated, Searchable, Filterable |
| `GET`  | `/api/v1/sales/:id`         | Get specific sale details   | AP, WP | -                                 |
| `GET`  | `/api/v1/sales/:id/receipt` | Get/print sale receipt      | AP, WP | File/PDF                          |
| `POST` | `/api/v1/sales/:id/void`    | Void sale transaction       | AP, WP | Requires authorization            |
| `POST` | `/api/v1/sales/:id/refund`  | Process refund for sale     | AP, WP | Requires authorization            |

**Note:** Currently no UI view in Figma. To be designed.

---

### Purchases

| Method   | Endpoint                        | Description                          | Access | Features                          |
| -------- | ------------------------------- | ------------------------------------ | ------ | --------------------------------- |
| `GET`    | `/api/v1/purchases`             | List all purchase orders             | AP, WP | Paginated, Searchable, Filterable |
| `GET`    | `/api/v1/purchases/:id`         | Get specific purchase order details  | AP, WP | -                                 |
| `POST`   | `/api/v1/purchases`             | Create new purchase order            | AP, WP | -                                 |
| `PUT`    | `/api/v1/purchases/:id`         | Update purchase order                | AP, WP | -                                 |
| `DELETE` | `/api/v1/purchases/:id`         | Delete purchase order (soft delete)  | AP, WP | -                                 |
| `POST`   | `/api/v1/purchases/:id/receive` | Mark purchase as received, add stock | AP, WP | Updates inventory                 |

---

### Dashboard

| Method | Endpoint                                       | Description                       | Access | Features                |
| ------ | ---------------------------------------------- | --------------------------------- | ------ | ----------------------- |
| `GET`  | `/api/v1/dashboard/stats`                      | Get dashboard KPI statistics      | Auth   | Response varies by role |
| `GET`  | `/api/v1/dashboard/charts/sales-trend`         | Get sales trend chart data        | Auth   | Response varies by role |
| `GET`  | `/api/v1/dashboard/charts/top-products`        | Get top selling products          | Auth   | Response varies by role |
| `GET`  | `/api/v1/dashboard/charts/revenue-by-category` | Get revenue breakdown by category | AP     | Admin only              |
| `GET`  | `/api/v1/dashboard/charts/inventory-overview`  | Get inventory status overview     | AP     | Admin only              |
| `GET`  | `/api/v1/dashboard/recent-activities`          | Get recent system activities      | Auth   | Response varies by role |

**Note:** Response payload varies based on user role (admin/superadmin see all data, staff see only their data).

---

### Reports

| Method | Endpoint                              | Description                    | Access | Features                 |
| ------ | ------------------------------------- | ------------------------------ | ------ | ------------------------ |
| `GET`  | `/api/v1/reports/sales`               | Get sales report               | AP, WP | Filterable by date range |
| `GET`  | `/api/v1/reports/purchases`           | Get purchase report            | AP, WP | Filterable by date range |
| `GET`  | `/api/v1/reports/inventory`           | Get inventory report           | AP, WP | Filterable               |
| `GET`  | `/api/v1/reports/product-performance` | Get product performance report | AP, WP | Filterable by date range |
| `GET`  | `/api/v1/reports/stock-adjustments`   | Get stock adjustments report   | AP, WP | Filterable by date range |
| `GET`  | `/api/v1/reports/profit-loss`         | Get profit & loss report       | AP, WP | Filterable by date range |
| `GET`  | `/api/v1/reports/:type/export`        | Export report to CSV/Excel     | AP, WP | File Download            |

**Available report types:** sales, purchases, inventory, product-performance, stock-adjustments, profit-loss

---

### Activity Logs

| Method | Endpoint                       | Description          | Access | Features                          |
| ------ | ------------------------------ | -------------------- | ------ | --------------------------------- |
| `GET`  | `/api/v1/activity-logs`        | List activity logs   | AP, WP | Paginated, Searchable, Filterable |
| `GET`  | `/api/v1/activity-logs/export` | Export activity logs | WP     | File Download                     |

**Note:** Admin/Superadmin see all logs, Staff see only their own logs.

---

### Settings

| Method | Endpoint                          | Description              | Access | Features        |
| ------ | --------------------------------- | ------------------------ | ------ | --------------- |
| `GET`  | `/api/v1/settings/profile`        | Get current user profile | Auth   | -               |
| `PATCH`  | `/api/v1/settings/profile`        | Update user profile      | Auth   | -               |
| `PATCH`  | `/api/v1/settings/password`       | Change user password     | Auth   | -               |
| `PATCH`  | `/api/v1/settings/theme`          | Update theme preference  | Auth   | Light/Dark mode |
| `GET`  | `/api/v1/settings/system`         | Get global system config | AP, WP | -               |
| `PATCH`  | `/api/v1/settings/system`         | Update global config     | AP, WP | -               |
| `GET`  | `/api/v1/settings/system/backup`  | Create system backup     | AP, WP | File Download   |
| `PATCH`  | `/api/v1/settings/system/restore` | Restore from backup      | AP, WP | File Upload     |

---

## 📋 HTTP Method Quick Reference

| Method   | Purpose                      | Example                      |
| -------- | ---------------------------- | ---------------------------- |
| `GET`    | **Retrieve** data            | Get list or specific item    |
| `POST`   | **Create** new resource      | Create product, checkout     |
| `PUT`    | **Update** existing resource | Update product details       |
| `DELETE` | **Delete** resource          | Remove product (soft delete) |

---

## 🔐 Access Level Reference

| Code       | Meaning               | Who Can Access                        |
| ---------- | --------------------- | ------------------------------------- |
| **AP**     | Admin/Superadmin only | Admin, Superadmin                     |
| **WP**     | With Permission       | Users with specific module permission |
| **Auth**   | Authenticated         | Any logged-in user                    |
| **Public** | No auth required      | Anyone                                |

---

## 🎯 Common Query Parameters

### Pagination

```
?page=1&limit=20
```

### Sorting

```
?sort=name&order=asc
```

### Filtering

```
?status=active&category_id=5&brand_id=2
```

### Searching

```
?search=helmet
or
?q=yamaha
```

### Date Range
