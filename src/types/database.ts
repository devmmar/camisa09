export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          role: 'user' | 'admin'
          phone: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          role?: 'user' | 'admin'
          phone?: string | null
        }
        Update: {
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          role?: 'user' | 'admin'
          phone?: string | null
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          image_url: string | null
          sort_order: number
          is_visible: boolean
          created_at: string
        }
        Insert: {
          name: string
          slug: string
          description?: string | null
          image_url?: string | null
          sort_order?: number
          is_visible?: boolean
        }
        Update: {
          name?: string
          slug?: string
          description?: string | null
          image_url?: string | null
          sort_order?: number
          is_visible?: boolean
        }
      }
      site_settings: {
        Row: {
          key: string
          value: string
          label: string | null
          type: string
          section: string
          updated_at: string
        }
        Insert: {
          key: string
          value?: string
          label?: string | null
          type?: string
          section?: string
        }
        Update: {
          value?: string
          label?: string | null
          type?: string
          section?: string
          updated_at?: string
        }
      }
      testimonials: {
        Row: {
          id: string
          author_name: string
          author_handle: string | null
          rating: number
          body: string
          is_active: boolean
          created_at: string
        }
        Insert: {
          author_name: string
          author_handle?: string | null
          rating?: number
          body: string
          is_active?: boolean
        }
        Update: {
          author_name?: string
          author_handle?: string | null
          rating?: number
          body?: string
          is_active?: boolean
        }
      }
      manual_sales: {
        Row: {
          id: string
          sale_code: string | null
          customer_name: string
          customer_phone: string | null
          customer_email: string | null
          customer_address: string | null
          product_type: string
          product_model: string
          product_size: string | null
          product_quantity: number
          unit_price: number
          discount: number
          shipping_price: number
          total: number
          items: Json
          payment_method: string | null
          payment_status: 'pending' | 'paid' | 'partial' | 'refunded' | 'cancelled'
          sale_channel: 'manual' | 'whatsapp' | 'instagram' | 'loja_fisica' | 'indicacao' | 'outro'
          delivery_status: 'pending' | 'preparing' | 'shipped' | 'delivered' | 'cancelled'
          tracking_code: string | null
          shipped_at: string | null
          delivered_at: string | null
          notes: string | null
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          customer_name: string
          customer_phone?: string | null
          customer_email?: string | null
          customer_address?: string | null
          product_type: string
          product_model: string
          product_size?: string | null
          product_quantity?: number
          unit_price: number
          discount?: number
          shipping_price?: number
          total: number
          items?: Json
          payment_method?: string | null
          payment_status?: 'pending' | 'paid' | 'partial' | 'refunded' | 'cancelled'
          sale_channel?: 'manual' | 'whatsapp' | 'instagram' | 'loja_fisica' | 'indicacao' | 'outro'
          delivery_status?: 'pending' | 'preparing' | 'shipped' | 'delivered' | 'cancelled'
          tracking_code?: string | null
          shipped_at?: string | null
          delivered_at?: string | null
          notes?: string | null
          created_by?: string | null
        }
        Update: {
          customer_name?: string
          customer_phone?: string | null
          customer_email?: string | null
          customer_address?: string | null
          product_type?: string
          product_model?: string
          product_size?: string | null
          product_quantity?: number
          unit_price?: number
          discount?: number
          shipping_price?: number
          total?: number
          items?: Json
          payment_method?: string | null
          payment_status?: 'pending' | 'paid' | 'partial' | 'refunded' | 'cancelled'
          sale_channel?: 'manual' | 'whatsapp' | 'instagram' | 'loja_fisica' | 'indicacao' | 'outro'
          delivery_status?: 'pending' | 'preparing' | 'shipped' | 'delivered' | 'cancelled'
          tracking_code?: string | null
          shipped_at?: string | null
          delivered_at?: string | null
          notes?: string | null
        }
      }
      teams: {
        Row: {
          id: string
          name: string
          slug: string
          country: string | null
          league: string | null
          logo_url: string | null
          created_at: string
        }
        Insert: {
          name: string
          slug: string
          country?: string | null
          league?: string | null
          logo_url?: string | null
        }
        Update: {
          name?: string
          slug?: string
          country?: string | null
          league?: string | null
          logo_url?: string | null
        }
      }
      products: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          price: number
          original_price: number | null
          category_id: string | null
          team_id: string | null
          sizes: string[]
          stock: number
          is_active: boolean
          is_featured: boolean
          is_new: boolean
          tags: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          name: string
          slug: string
          description?: string | null
          price: number
          original_price?: number | null
          category_id?: string | null
          team_id?: string | null
          sizes?: string[]
          stock?: number
          is_active?: boolean
          is_featured?: boolean
          is_new?: boolean
          tags?: string[]
        }
        Update: {
          name?: string
          slug?: string
          description?: string | null
          price?: number
          original_price?: number | null
          category_id?: string | null
          team_id?: string | null
          sizes?: string[]
          stock?: number
          is_active?: boolean
          is_featured?: boolean
          is_new?: boolean
          tags?: string[]
        }
      }
      product_images: {
        Row: {
          id: string
          product_id: string
          url: string
          alt: string | null
          is_primary: boolean
          position: number
          created_at: string
        }
        Insert: {
          product_id: string
          url: string
          alt?: string | null
          is_primary?: boolean
          position?: number
        }
        Update: {
          product_id?: string
          url?: string
          alt?: string | null
          is_primary?: boolean
          position?: number
        }
      }
      favorites: {
        Row: {
          id: string
          user_id: string
          product_id: string
          created_at: string
        }
        Insert: {
          user_id: string
          product_id: string
        }
        Update: never
      }
      cart_items: {
        Row: {
          id: string
          user_id: string
          product_id: string
          size: string
          quantity: number
          created_at: string
        }
        Insert: {
          user_id: string
          product_id: string
          size: string
          quantity?: number
        }
        Update: {
          quantity?: number
        }
      }
      orders: {
        Row: {
          id: string
          user_id: string
          status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
          total: number
          discount: number
          coupon_code: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          status?: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
          total: number
          discount?: number
          coupon_code?: string | null
          notes?: string | null
        }
        Update: {
          status?: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
          total?: number
          discount?: number
          coupon_code?: string | null
          notes?: string | null
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
          size: string
          quantity: number
          unit_price: number
          created_at: string
        }
        Insert: {
          order_id: string
          product_id: string
          size: string
          quantity: number
          unit_price: number
        }
        Update: never
      }
      reviews: {
        Row: {
          id: string
          user_id: string
          product_id: string
          rating: number
          comment: string | null
          is_approved: boolean
          created_at: string
        }
        Insert: {
          user_id: string
          product_id: string
          rating: number
          comment?: string | null
          is_approved?: boolean
        }
        Update: {
          rating?: number
          comment?: string | null
          is_approved?: boolean
        }
      }
      coupons: {
        Row: {
          id: string
          code: string
          discount_type: 'percent' | 'fixed'
          discount_value: number
          min_order: number | null
          max_uses: number | null
          used_count: number
          is_active: boolean
          expires_at: string | null
          created_at: string
        }
        Insert: {
          code: string
          discount_type: 'percent' | 'fixed'
          discount_value: number
          min_order?: number | null
          max_uses?: number | null
          is_active?: boolean
          expires_at?: string | null
        }
        Update: {
          code?: string
          discount_type?: 'percent' | 'fixed'
          discount_value?: number
          min_order?: number | null
          max_uses?: number | null
          used_count?: number
          is_active?: boolean
          expires_at?: string | null
        }
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}
