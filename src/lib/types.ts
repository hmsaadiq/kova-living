// ─── Product ────────────────────────────────────────────────────────────────

export interface OptionChoice {
  label: string
  value: string
  priceModifier: number
  swatchColor?: string   // hex — for fabric/finish color swatches + 3D material color
  swatchImage?: string   // URL — for material/texture swatches
  image?: string         // URL — full product photo shown when this choice is active (image-swap mode)
  roughness?: number     // 0–1, for 3D material (lower = shinier). default 0.8
  metalness?: number     // 0–1, for 3D material. default 0
  textureUrl?: string    // diffuse/albedo texture map URL
  roughnessUrl?: string  // roughness map URL (jpg/png only)
  aoUrl?: string         // ambient occlusion map URL
}

export interface OptionGroup {
  name: string               // "Seat Cushion", "Back Left", "Legs"
  type: 'swatch' | 'toggle' | 'select'
  choices: OptionChoice[]
  isLayer?: boolean          // PNG layer mode: choice images are transparent PNGs stacked over baseLayer
  layerOrder?: number        // PNG layer mode: z-index order (lower = bottom)
  meshName?: string          // 3D mode: single mesh name in the GLB this group controls
  meshNames?: string[]        // 3D mode: multiple meshes controlled by this group (all get same material)
  materialName?: string      // 3D mode: single material name in the GLB this group controls
  materialNames?: string[]    // 3D mode: multiple material names controlled by this group
}

export interface Product {
  id: string
  slug: string
  name: string
  description: string
  base_price: number         // USD cents
  category: 'living-room' | 'bedroom' | 'dining'
  images: string[]           // ordered — first is primary (used when no 3D model / layers)
  options: OptionGroup[]
  model_url?: string         // GLB/GLTF URL — enables 3D configurator mode
  base_layer?: string        // PNG layer mode: frame/skeleton image at bottom of stack
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
