// Robust Client-Side IndexedDB Offline Database Engine
// Provides high-capacity, permanent offline storage for POS data in browser

const DB_NAME = 'ShopKeep_Offline_Database';
const DB_VERSION = 1;

export interface OfflineDbStats {
  isSupported: boolean;
  isOpen: boolean;
  productsCount: number;
  transactionsCount: number;
  expensesCount: number;
  movementsCount: number;
  profilesCount: number;
  lastSyncTime: string;
}

class IndexedDbService {
  private dbPromise: Promise<IDBDatabase> | null = null;

  public isSupported(): boolean {
    return typeof window !== 'undefined' && 'indexedDB' in window;
  }

  public getDb(): Promise<IDBDatabase> {
    if (!this.isSupported()) {
      return Promise.reject(new Error('IndexedDB is not supported in this environment'));
    }

    if (!this.dbPromise) {
      this.dbPromise = new Promise((resolve, reject) => {
        const request = window.indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
          const db = (event.target as IDBOpenDBRequest).result;

          // Products store
          if (!db.objectStoreNames.contains('products')) {
            db.createObjectStore('products', { keyPath: 'id' });
          }

          // Transactions store
          if (!db.objectStoreNames.contains('transactions')) {
            const txStore = db.createObjectStore('transactions', { keyPath: 'id' });
            txStore.createIndex('timestamp', 'timestamp', { unique: false });
            txStore.createIndex('receiptNumber', 'receiptNumber', { unique: false });
          }

          // Expenses store
          if (!db.objectStoreNames.contains('expenses')) {
            const expStore = db.createObjectStore('expenses', { keyPath: 'id' });
            expStore.createIndex('timestamp', 'timestamp', { unique: false });
          }

          // Stock Movements store
          if (!db.objectStoreNames.contains('movements')) {
            const movStore = db.createObjectStore('movements', { keyPath: 'id' });
            movStore.createIndex('timestamp', 'timestamp', { unique: false });
            movStore.createIndex('productId', 'productId', { unique: false });
          }

          // Settings store
          if (!db.objectStoreNames.contains('settings')) {
            db.createObjectStore('settings', { keyPath: 'id' });
          }

          // Profiles store
          if (!db.objectStoreNames.contains('profiles')) {
            db.createObjectStore('profiles', { keyPath: 'id' });
          }

          // Device Security / Lock store
          if (!db.objectStoreNames.contains('deviceLock')) {
            db.createObjectStore('deviceLock', { keyPath: 'id' });
          }

          // Metadata store
          if (!db.objectStoreNames.contains('meta')) {
            db.createObjectStore('meta', { keyPath: 'key' });
          }
        };

        request.onsuccess = () => {
          resolve(request.result);
        };

        request.onerror = () => {
          reject(request.error);
        };
      });
    }

    return this.dbPromise;
  }

  // Get all items from a given store
  public async getAll<T>(storeName: string): Promise<T[]> {
    try {
      const db = await this.getDb();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.getAll();

        request.onsuccess = () => resolve(request.result || []);
        request.onerror = () => reject(request.error);
      });
    } catch {
      return [];
    }
  }

  // Put a single item into a store
  public async put<T>(storeName: string, item: T): Promise<void> {
    try {
      const db = await this.getDb();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.put(item);

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    } catch {
      // Graceful fallback if IndexedDB fails
    }
  }

  // Put multiple items into a store (clearing existing or replacing by key)
  public async setAll<T extends { id?: string | number }>(storeName: string, items: T[]): Promise<void> {
    try {
      const db = await this.getDb();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);

        store.clear();

        items.forEach((item) => {
          store.put(item);
        });

        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject(transaction.error);
      });
    } catch {
      // Graceful fallback
    }
  }

  // Save a single document/setting by fixed ID
  public async setSingleton<T>(storeName: string, id: string, data: T): Promise<void> {
    try {
      const db = await this.getDb();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        const record = { id, ...data };
        const request = store.put(record);

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    } catch {}
  }

  // Retrieve a singleton setting/document by fixed ID
  public async getSingleton<T>(storeName: string, id: string): Promise<T | null> {
    try {
      const db = await this.getDb();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.get(id);

        request.onsuccess = () => {
          if (request.result) {
            const { id: _id, ...rest } = request.result;
            resolve(rest as T);
          } else {
            resolve(null);
          }
        };
        request.onerror = () => reject(request.error);
      });
    } catch {
      return null;
    }
  }

  // Get full diagnostic statistics of the offline database
  public async getStats(): Promise<OfflineDbStats> {
    if (!this.isSupported()) {
      return {
        isSupported: false,
        isOpen: false,
        productsCount: 0,
        transactionsCount: 0,
        expensesCount: 0,
        movementsCount: 0,
        profilesCount: 0,
        lastSyncTime: 'IndexedDB unsupported',
      };
    }

    try {
      const [products, transactions, expenses, movements, profiles] = await Promise.all([
        this.getAll('products'),
        this.getAll('transactions'),
        this.getAll('expenses'),
        this.getAll('movements'),
        this.getAll('profiles'),
      ]);

      return {
        isSupported: true,
        isOpen: true,
        productsCount: products.length,
        transactionsCount: transactions.length,
        expensesCount: expenses.length,
        movementsCount: movements.length,
        profilesCount: profiles.length,
        lastSyncTime: new Date().toLocaleTimeString(),
      };
    } catch {
      return {
        isSupported: true,
        isOpen: false,
        productsCount: 0,
        transactionsCount: 0,
        expensesCount: 0,
        movementsCount: 0,
        profilesCount: 0,
        lastSyncTime: 'Error querying stats',
      };
    }
  }

  // Export entire IndexedDB database to JSON dump
  public async exportAll(): Promise<Record<string, any>> {
    const [products, transactions, expenses, movements, settings, profiles] = await Promise.all([
      this.getAll('products'),
      this.getAll('transactions'),
      this.getAll('expenses'),
      this.getAll('movements'),
      this.getSingleton('settings', 'current_settings'),
      this.getAll('profiles'),
    ]);

    return {
      exportTimestamp: new Date().toISOString(),
      engine: 'IndexedDB',
      products,
      transactions,
      expenses,
      movements,
      settings,
      profiles,
    };
  }
}

export const indexedDbService = new IndexedDbService();
