import { API_ENDPOINTS } from '../utils';

/* ----------------------------- mock data ----------------------------- */

const mockCategories = [
  { id: 'cat-engine', name: 'Engine Parts' },
  { id: 'cat-brakes', name: 'Braking System' },
  { id: 'cat-lubricants', name: 'Lubricants' },
  { id: 'cat-electrical', name: 'Electrical' },
  { id: 'cat-body', name: 'Body & Frame' },
];

const mockBrands = [
  { id: 'brand-yamaha', name: 'Yamaha' },
  { id: 'brand-honda', name: 'Honda' },
  { id: 'brand-ktm', name: 'KTM' },
  { id: 'brand-suzuki', name: 'Suzuki' },
  { id: 'brand-kawasaki', name: 'Kawasaki' },
];

/* ----------------------------- helpers ----------------------------- */

const simulateNetworkDelay = (ms = 200) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const generateId = () =>
  `prod_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;

const getStockStatus = (stock, reorderPoint) => {
  if (stock <= 0) return 'out_of_stock';
  if (stock <= reorderPoint) return 'low_stock';
  return 'in_stock';
};

const enrichProduct = (p) => ({
  ...p,
  categoryName: mockCategories.find((x) => x.id === p.categoryId)?.name || 'Unassigned',
  brandName: mockBrands.find((x) => x.id === p.brandId)?.name || 'Unassigned',
  stockStatus: p.stockStatus || getStockStatus(p.currentStock, p.reorderPoint),
});

const saveToLocalStorage = () => {
  try {
    window.localStorage.setItem('motomedic_products', JSON.stringify(mockProducts));
  } catch (err) {
    console.warn('Failed to save products:', err);
  }
};

/* ----------------------------- mock products ----------------------------- */

let mockProducts = [
  {
    id: 'prod-1',
    sku: 'ENG-1001',
    name: 'Premium Spark Plug',
    categoryId: 'cat-engine',
    brandId: 'brand-honda',
    costPrice: 120,
    sellingPrice: 180,
    currentStock: 42,
    reorderPoint: 15,
    description: 'High performance spark plug for 150cc engines',
    createdAt: '2024-07-10T09:00:00Z',
    updatedAt: '2024-11-15T11:10:00Z',
  },
  {
    id: 'prod-2',
    sku: 'BRK-2105',
    name: 'Ceramic Brake Pads',
    categoryId: 'cat-brakes',
    brandId: 'brand-yamaha',
    costPrice: 560,
    sellingPrice: 790,
    currentStock: 8,
    reorderPoint: 10,
    description: 'Front brake pads compatible with Yamaha NMAX',
    createdAt: '2024-06-22T14:20:00Z',
    updatedAt: '2024-11-05T07:45:00Z',
  },
  {
    id: 'prod-3',
    sku: 'LUB-3002',
    name: 'Fully Synthetic 10W-40 Oil',
    categoryId: 'cat-lubricants',
    brandId: 'brand-suzuki',
    costPrice: 280,
    sellingPrice: 410,
    currentStock: 96,
    reorderPoint: 25,
    description: '1L bottle of long-drain fully synthetic oil',
    createdAt: '2024-05-18T08:15:00Z',
    updatedAt: '2024-11-12T10:30:00Z',
  },
  {
    id: 'prod-4',
    sku: 'ELE-4411',
    name: 'Maintenance-Free Battery',
    categoryId: 'cat-electrical',
    brandId: 'brand-kawasaki',
    costPrice: 1450,
    sellingPrice: 1800,
    currentStock: 0,
    reorderPoint: 5,
    description: '12V MF battery with 12-month warranty',
    createdAt: '2024-08-01T09:30:00Z',
    updatedAt: '2024-10-30T16:05:00Z',
  },
  {
    id: 'prod-5',
    sku: 'BDY-5510',
    name: 'Carbon Fiber Side Mirror Set',
    categoryId: 'cat-body',
    brandId: 'brand-ktm',
    costPrice: 980,
    sellingPrice: 1350,
    currentStock: 18,
    reorderPoint: 6,
    description: 'Adjustable mirror set with anti-glare coating',
    createdAt: '2024-04-05T12:40:00Z',
    updatedAt: '2024-11-01T09:20:00Z',
  },
];

/* ----------------------------- filter + paginate ----------------------------- */

const applyFilters = (items, { search, categoryId, brandId, status }) =>
  items.filter((p) => {
    const matchesSearch =
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      p.description?.toLowerCase().includes(search.toLowerCase());

    const matchesCategory = !categoryId || p.categoryId === categoryId;
    const matchesBrand = !brandId || p.brandId === brandId;
    const matchesStatus =
      !status || getStockStatus(p.currentStock, p.reorderPoint) === status;

    return matchesSearch && matchesCategory && matchesBrand && matchesStatus;
  });

const paginate = (items, page, size) => {
  const start = (page - 1) * size;
  return items.slice(start, start + size);
};

/* ----------------------------- services ----------------------------- */

export const fetchProductsPaginated = async ({
  page = 1,
  pageSize = 20,
  search = '',
  categoryId = '',
  brandId = '',
  status = '',
  sortBy = 'updatedAt',
  sortOrder = 'desc',
} = {}) => {
  try {
    await simulateNetworkDelay();

    // ensure localStorage mirror exists
    if (typeof window !== 'undefined' && mockProducts.length) {
      const stored = window.localStorage.getItem('motomedic_products');
      if (!stored || JSON.parse(stored).length === 0) saveToLocalStorage();
    }

    const filtered = applyFilters(mockProducts, {
      search,
      categoryId,
      brandId,
      status,
    });

    const sorted = [...filtered].sort((a, b) => {
      const aVal = a[sortBy] ?? '';
      const bVal = b[sortBy] ?? '';

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
      }

      return sortOrder === 'asc'
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });

    const totalItems = sorted.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

    const data = paginate(sorted, page, pageSize).map(enrichProduct);

    return {
      success: true,
      data,
      pagination: {
        page,
        pageSize,
        totalItems,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  } catch (err) {
    console.error('fetchProductsPaginated failed', err);

    return {
      success: false,
      data: [],
      pagination: {
        page: 1,
        pageSize,
        totalItems: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPrevPage: false,
      },
      error: err.message || 'Unable to load products',
    };
  }
};

/* ----------------------------- filter options ----------------------------- */

export const fetchFilterOptions = async () => {
  try {
    await simulateNetworkDelay(150);

    return {
      success: true,
      data: {
        categories: mockCategories.map((c) => ({
          value: c.id,
          label: c.name,
        })),
        brands: mockBrands.map((b) => ({
          value: b.id,
          label: b.name,
        })),
      },
    };
  } catch (err) {
    return {
      success: false,
      error: err.message || 'Unable to load filters',
      data: { categories: [], brands: [] },
    };
  }
};

/* ----------------------------- create / update / delete ----------------------------- */

export const createProduct = async (productData) => {
  try {
    await simulateNetworkDelay();

    const timestamp = new Date().toISOString();

    const product = {
      ...productData,
      id: generateId(),
      createdAt: timestamp,
      updatedAt: timestamp,
      stockStatus: getStockStatus(productData.currentStock, productData.reorderPoint),
    };

    mockProducts = [product, ...mockProducts];

    if (typeof window !== 'undefined') saveToLocalStorage();

    return { success: true, data: enrichProduct(product) };
  } catch (err) {
    return {
      success: false,
      error: err.message || 'Unable to create product',
    };
  }
};

export const updateProduct = async (id, productData) => {
  try {
    await simulateNetworkDelay();

    const index = mockProducts.findIndex((p) => p.id === id);
    if (index === -1) return { success: false, error: 'Product not found' };

    const updated = {
      ...mockProducts[index],
      ...productData,
      updatedAt: new Date().toISOString(),
      stockStatus: getStockStatus(productData.currentStock, productData.reorderPoint),
    };

    mockProducts[index] = updated;

    if (typeof window !== 'undefined') saveToLocalStorage();

    return { success: true, data: enrichProduct(updated) };
  } catch (err) {
    return {
      success: false,
      error: err.message || 'Unable to update product',
    };
  }
};

export const deleteProduct = async (id) => {
  try {
    await simulateNetworkDelay();

    mockProducts = mockProducts.filter((p) => p.id !== id);

    if (typeof window !== 'undefined') saveToLocalStorage();

    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err.message || 'Unable to delete product',
    };
  }
};

/* ----------------------------- export CSV ----------------------------- */

export const exportProductsAsCsv = async ({
  search = '',
  categoryId = '',
  brandId = '',
  status = '',
} = {}) => {
  try {
    await simulateNetworkDelay(100);

    const filtered = applyFilters(mockProducts, {
      search,
      categoryId,
      brandId,
      status,
    }).map(enrichProduct);

    const headers = [
      'SKU',
      'Name',
      'Category',
      'Brand',
      'Cost Price',
      'Selling Price',
      'Stock',
      'Reorder Point',
      'Updated',
    ];

    const rows = filtered.map((p) => [
      p.sku,
      p.name,
      p.categoryName,
      p.brandName,
      p.costPrice,
      p.sellingPrice,
      p.currentStock,
      p.reorderPoint,
      p.updatedAt,
    ]);

    const csv = [headers, ...rows].map((r) => r.join(',')).join('\n');
    const filename = `products_${new Date().toISOString().split('T')[0]}.csv`;

    return { success: true, data: csv, filename };
  } catch (err) {
    return {
      success: false,
      error: err.message || 'Unable to export products',
    };
  }
};

/* ----------------------------- export service ----------------------------- */

const productService = {
  fetchProductsPaginated,
  fetchFilterOptions,
  createProduct,
  updateProduct,
  deleteProduct,
  exportProductsAsCsv,
  API_ENDPOINTS,
};

export default productService;
