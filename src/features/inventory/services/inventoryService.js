/**
 * Inventory Service
 * Handles all data operations for the inventory feature
 * 
 * This service uses localStorage for persistence.
 * Replace with actual API calls when backend is ready.
 */

const INVENTORY_STORAGE_KEY = 'motomedic_inventory';

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

const readFromStorage = (key, fallback = []) => {
  if (typeof window === 'undefined') return fallback;
  try {
    const stored = window.localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
};

const saveToStorage = (key, data) => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to storage:', error);
  }
};

// =============================================================================
// MOCK DATA (Initial seed data)
// =============================================================================

const mockInventory = [
  {
    id: 'inv-1',
    product: 'Laptop Dell XPS 13',
    sku: 'DELL-XPS13-001',
    currentStock: 25,
    minStock: 10,
    maxStock: 50,
    location: 'Warehouse A',
    lastUpdated: '2025-01-30',
    status: 'healthy',
  },
  {
    id: 'inv-2',
    product: 'Office Chair Ergonomic',
    sku: 'CHAIR-ERG-001',
    currentStock: 12,
    minStock: 15,
    maxStock: 30,
    location: 'Warehouse B',
    lastUpdated: '2025-01-29',
    status: 'low',
  },
  {
    id: 'inv-3',
    product: 'Wireless Mouse',
    sku: 'MOUSE-WL-001',
    currentStock: 5,
    minStock: 20,
    maxStock: 100,
    location: 'Warehouse A',
    lastUpdated: '2025-01-30',
    status: 'critical',
  },
  {
    id: 'inv-4',
    product: 'Monitor 24" LED',
    sku: 'MON-24LED-001',
    currentStock: 0,
    minStock: 8,
    maxStock: 25,
    location: 'Warehouse C',
    lastUpdated: '2025-01-28',
    status: 'out',
  },
  {
    id: 'inv-5',
    product: 'Printer Paper A4',
    sku: 'PAPER-A4-001',
    currentStock: 45,
    minStock: 50,
    maxStock: 200,
    location: 'Warehouse A',
    lastUpdated: '2025-01-30',
    status: 'low',
  },
];

// =============================================================================
// SERVICE METHODS
// =============================================================================

/**
 * Fetches all inventory items
 * @returns {Array} Inventory items array
 */
export const fetchInventory = () => {
  const stored = readFromStorage(INVENTORY_STORAGE_KEY, []);
  
  // Initialize with mock data if empty
  if (stored.length === 0 && typeof window !== 'undefined') {
    saveToStorage(INVENTORY_STORAGE_KEY, mockInventory);
    return mockInventory;
  }
  
  return stored;
};

/**
 * Updates inventory stock for an item
 * @param {string} id - Inventory item ID
 * @param {number} newStock - New stock quantity
 * @returns {Object|null} Updated inventory item or null
 */
export const updateInventoryStock = (id, newStock) => {
  const inventory = fetchInventory();
  const index = inventory.findIndex(item => item.id === id);
  
  if (index === -1) return null;
  
  const updatedItem = {
    ...inventory[index],
    currentStock: newStock,
    lastUpdated: new Date().toISOString().split('T')[0],
  };
  
  const updatedInventory = [
    ...inventory.slice(0, index),
    updatedItem,
    ...inventory.slice(index + 1),
  ];
  
  saveToStorage(INVENTORY_STORAGE_KEY, updatedInventory);
  return updatedItem;
};

// =============================================================================
// SERVICE EXPORT
// =============================================================================

const inventoryService = {
  fetchInventory,
  updateInventoryStock,
};

export default inventoryService;

