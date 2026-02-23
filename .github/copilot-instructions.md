# Copilot Instructions for MotoMedic IMS App

## Project Context
This is a React 19 frontend application for an Inventory Management System (IMS) for motorcycle parts and services.

## Tech Stack
- **React:** 19.2.0 (with React Compiler)
- **State Management:** Redux Toolkit (@reduxjs/toolkit)
- **Routing:** React Router v7
- **UI:** Tailwind CSS + Lucide React icons
- **HTTP Client:** Axios
- **Auth:** Google OAuth (@react-oauth/google) + JWT
- **Build Tool:** Vite (Rolldown fork)
- **Testing:** Vitest + React Testing Library

## Architecture Principles
1. **Feature-based structure** - Organize by feature, not by file type
2. **Redux slices** - One slice per domain (auth, inventory, pos, etc.)
3. **Async thunks** - For all API calls via Redux Toolkit
4. **Smart/Dumb components** - Containers vs Presentational

## File Structure
```
src/
├── features/          # Feature modules (Redux slices + components)
├── components/        # Shared UI components
├── pages/            # Route-level page components
├── store/            # Redux store configuration
└── shared/           # Utilities, hooks, constants
```

## Code Standards

### Component Structure
```jsx
// Use default exports for components
export default function ProductCard({ product, onSelect }) {
  // Hooks at the top
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  
  // Event handlers
  const handleClick = () => {
    dispatch(selectProduct(product.id));
    onSelect?.(product);
  };
  
  return (
    <div className="p-4 border rounded">
      {/* JSX */}
    </div>
  );
}
```

### Redux Slice Pattern
```js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/shared/api';

export const fetchProducts = createAsyncThunk(
  'products/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/products');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  }
});
```

### PropTypes Usage
Always define PropTypes for components:
```jsx
import PropTypes from 'prop-types';

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired
  }).isRequired,
  onSelect: PropTypes.func
};
```

## React 19 Best Practices
1. **Use transitions** - For non-urgent state updates
2. **Avoid unnecessary re-renders** - React Compiler helps, but be mindful
3. **Use `use` hook** - For reading context/promises (React 19 feature)
4. **Suspense boundaries** - For async components

## Common Patterns

### API Integration
```js
// shared/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```

### Protected Routes
```jsx
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useSelector(state => state.auth);
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}
```

## Code Review Checklist
Before suggesting changes:
- [ ] Does it use Redux for global state?
- [ ] Are PropTypes defined?
- [ ] Is the component properly memoized if needed?
- [ ] Are there proper error boundaries?
- [ ] Is loading/error state handled?
- [ ] Are API calls in async thunks, not in components?

## When to Ask
- State management architecture decisions
- New feature component structure
- Performance optimization strategies
- Breaking changes to shared components
