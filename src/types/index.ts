import type { Database } from './database'

export type Profile = Database['public']['Tables']['profiles']['Row']
export type Product = Database['public']['Tables']['products']['Row']
export type ProductImage = Database['public']['Tables']['product_images']['Row']
export type Category = Database['public']['Tables']['categories']['Row']
export type Team = Database['public']['Tables']['teams']['Row']
export type Order = Database['public']['Tables']['orders']['Row']
export type OrderItem = Database['public']['Tables']['order_items']['Row']
export type Review = Database['public']['Tables']['reviews']['Row']
export type Coupon = Database['public']['Tables']['coupons']['Row']
export type CartItem = Database['public']['Tables']['cart_items']['Row']
export type Favorite = Database['public']['Tables']['favorites']['Row']
export type SiteSetting = Database['public']['Tables']['site_settings']['Row']
export type Testimonial = Database['public']['Tables']['testimonials']['Row']
export type ManualSale = Database['public']['Tables']['manual_sales']['Row']

export type PaymentStatus = ManualSale['payment_status']
export type DeliveryStatus = ManualSale['delivery_status']
export type SaleChannel = ManualSale['sale_channel']

export interface SaleItem {
  product_type: string
  product_model: string
  product_size: string
  product_quantity: number
  unit_price: number
}

export interface ProductWithImages extends Product {
  images: ProductImage[]
  category?: Category
  team?: Team
}

export interface CartItemWithProduct extends CartItem {
  product: ProductWithImages
}

export interface OrderWithItems extends Order {
  items: (OrderItem & { product: Product })[]
}
