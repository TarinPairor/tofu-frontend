import { createClient } from '@supabase/supabase-js'

// Types
export interface TofuUser {
  id: number
  created_at: string
  username: string
  password: string
}

export interface TofuProduct {
  id: number
  created_at: string
  product_name: string | null
  user_id: number
  sustainability_level: string | null
  product_link: string | null
  product_image: string | null
  product_description: string | null
}

// Initialize Supabase client
const supabaseUrl = 'https://zbzioinhmaciqqskgejo.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

// User functions
export const userApi = {
  // Get all users
  async getAllUsers(): Promise<TofuUser[]> {
    const { data, error } = await supabase
      .from('tofu_user')
      .select()
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching users:', error)
      return []
    }

    return data || []
  },

  // Create a new user
  async createUser(username: string, password: string): Promise<TofuUser | null> {
    const { data, error } = await supabase
      .from('tofu_user')
      .insert([{ username, password }])
      .select()
      .single()

    if (error) {
      console.error('Error creating user:', error)
      return null
    }

    return data
  },

  // Get user by ID
  async getUserById(id: number): Promise<TofuUser | null> {
    const { data, error } = await supabase
      .from('tofu_user')
      .select()
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching user:', error)
      return null
    }

    return data
  },

  // Get user by username
  async getUserByUsername(username: string): Promise<TofuUser | null> {
    const { data, error } = await supabase
      .from('tofu_user')
      .select()
      .eq('username', username)
      .single()

    if (error) {
      console.error('Error fetching user:', error)
      return null
    }

    return data
  },

  // Update user
  async updateUser(id: number, updates: Partial<TofuUser>): Promise<TofuUser | null> {
    const { data, error } = await supabase
      .from('tofu_user')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating user:', error)
      return null
    }

    return data
  },

  // Delete user
  async deleteUser(id: number): Promise<boolean> {
    const { error } = await supabase
      .from('tofu_user')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting user:', error)
      return false
    }

    return true
  }
}

// Product functions
export const productApi = {
  // Create a new product
  async createProduct(product: Omit<TofuProduct, 'id' | 'created_at'>): Promise<TofuProduct | null> {
    const { data, error } = await supabase
      .from('tofu_product')
      .insert([product])
      .select()
      .single()

    if (error) {
      console.error('Error creating product:', error)
      return null
    }

    return data
  },

  // Get product by ID
  async getProductById(id: number): Promise<TofuProduct | null> {
    const { data, error } = await supabase
      .from('tofu_product')
      .select()
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching product:', error)
      return null
    }

    return data
  },

  // Get all products for a user
  async getUserProducts(userId: number): Promise<TofuProduct[]> {
    const { data, error } = await supabase
      .from('tofu_product')
      .select()
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching user products:', error)
      return []
    }

    return data || []
  },

  // Update product
  async updateProduct(id: number, updates: Partial<TofuProduct>): Promise<TofuProduct | null> {
    const { data, error } = await supabase
      .from('tofu_product')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating product:', error)
      return null
    }

    return data
  },

  // Delete product
  async deleteProduct(id: number): Promise<boolean> {
    const { error } = await supabase
      .from('tofu_product')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting product:', error)
      return false
    }

    return true
  },

  // Get all products (with optional filters)
  async getAllProducts(filters?: {
    status?: string
    search?: string
  }): Promise<TofuProduct[]> {
    let query = supabase
      .from('tofu_product')
      .select()
      .order('created_at', { ascending: false })

    if (filters?.status) {
      query = query.eq('status', filters.status)
    }

    if (filters?.search) {
      query = query.ilike('product_name', `%${filters.search}%`)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching products:', error)
      return []
    }

    return data || []
  },

  // Add new product
  async addProduct(product: Omit<TofuProduct, 'id' | 'created_at'>): Promise<TofuProduct | null> {
    const { data, error } = await supabase
      .from('tofu_product')
      .insert([product])
      .select()
      .single()

    if (error) {
      console.error('Error adding product:', error)
      return null
    }

    return data
  }
}

export default supabase 