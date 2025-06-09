import type { Product } from "./types"

const DB_NAME = "clothingStoreDB"
const STORE_NAME = "products"
const DB_VERSION = 1

let db: IDBDatabase | null = null

export function initDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (db) {
      resolve(db)
      return
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = (event) => {
      console.error("IndexedDB error:", request.error)
      reject("Error opening DB")
    }

    request.onsuccess = (event) => {
      db = request.result
      resolve(db)
    }

    request.onupgradeneeded = (event) => {
      const tempDb = request.result
      if (!tempDb.objectStoreNames.contains(STORE_NAME)) {
        tempDb.createObjectStore(STORE_NAME, { keyPath: "id" })
      }
    }
  })
}

export async function addProduct(product: Product): Promise<void> {
  const currentDb = await initDB()
  return new Promise((resolve, reject) => {
    const transaction = currentDb.transaction([STORE_NAME], "readwrite")
    const store = transaction.objectStore(STORE_NAME)
    const request = store.add(product)

    request.onsuccess = () => resolve()
    request.onerror = () => {
      console.error("Error adding product:", request.error)
      reject(request.error)
    }
  })
}

export async function getProducts(): Promise<Product[]> {
  const currentDb = await initDB()
  return new Promise((resolve, reject) => {
    const transaction = currentDb.transaction([STORE_NAME], "readonly")
    const store = transaction.objectStore(STORE_NAME)
    const request = store.getAll()

    request.onsuccess = () =>
      resolve(request.result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))
    request.onerror = () => {
      console.error("Error getting products:", request.error)
      reject(request.error)
    }
  })
}
