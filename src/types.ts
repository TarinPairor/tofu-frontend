export interface TofuProduct {
  id: number
  created_at: string
  product_name: string
  user_id: number
  sustainability_level: string
  product_link: string
  product_image: string | null
  product_description: string
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  error?: string
  details?: string
}

export interface ProductEvaluation {
  product_name: string
  sustainability_level: string
  product: {
    image: string | null
    description: string
  }
} 