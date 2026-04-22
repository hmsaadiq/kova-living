// ─── Product ────────────────────────────────────────────────────────────────

export interface OptionChoice {
  label: string
  value: string
  priceModifier: number
  swatchColor?: string   // hex — for fabric/finish color swatches
  swatchImage?: string   // URL — for material/texture swatches
}

export interface OptionGroup {
  name: string           // "Fabric", "Legs", "Size"
  type: 'swatch' | 'toggle' | 'select'
  choices: OptionChoice[]
}

export interface Product {
  id: string
  slug: string
  name: string
  description: string
  base_price: number     // USD cents
  category: 'living-room' | 'bedroom' | 'dining'
  images: string[]       // ordered — first is primary
  options: OptionGroup[]
  featured?: boolean
  created_at?: string
}

// ─── Cart ────────────────────────────────────────────────────────────────────

export type SelectedOptions = Record<string, string> // { Fabric: "velvet", Legs: "oak" }

export interface CartItem {
  id: string             // uuid — stable key in cart
  product: Product
  selectedOptions: SelectedOptions
  quantity: number
  unitPrice: number      // calculated at time of add
}

// ─── Order ───────────────────────────────────────────────────────────────────

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'in_progress'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'

export interface ShippingAddress {
  name: string
  address: string
  city: string
  state: string
  zip: string
  phone: string
}

export interface OrderItem {
  product_id: string
  product_name: string
  selected_options: SelectedOptions
  quantity: number
  unit_price: number
}

export interface Order {
  id: string
  user_id: string
  items: OrderItem[]
  status: OrderStatus
  total_price: number
  shipping_address: ShippingAddress
  created_at: string
  updated_at?: string
  cancelled_at?: string
  cancelled_by?: string
  cancelled_by_role?: 'user' | 'admin'
  cancellation_reason?: string
  previous_status?: OrderStatus
}

// ─── Auth ────────────────────────────────────────────────────────────────────

export interface UserProfile {
  id: string
  email: string
  full_name: string | null
  is_admin: boolean
  updated_at: string
}
