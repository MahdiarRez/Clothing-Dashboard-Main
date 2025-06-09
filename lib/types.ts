export interface ProductImage {
  id: string
  name: string // Original file name
  dataUrl: string // Base64 data URL of the image
  // croppedDataUrl?: string; // For future cropping integration
  isMain: boolean
}

export interface ProductVariant {
  id: string
  size: string
  color: string
  quantity: number
}

export interface Product {
  id: string
  name: string
  description: string
  images: ProductImage[]
  variants: ProductVariant[]
  totalQuantity: number
  createdAt: string // ISO date string
}

// Props for form sections
export interface BasicInfoProps {
  name: string
  setName: (name: string) => void
  description: string
  setDescription: (description: string) => void
}

export interface ImageUploadProps {
  images: ProductImage[]
  setImages: (images: ProductImage[]) => void
}

export interface SizesColorsQuantityProps {
  variants: ProductVariant[]
  setVariants: (variants: ProductVariant[]) => void
  totalQuantity: number
}

export const AVAILABLE_SIZES = ["S", "M", "L", "XL", "2XL", "3XL"]
export const AVAILABLE_COLORS = ["Black", "White", "Red", "Blue", "Green", "Yellow", "Gray"]
