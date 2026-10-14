export type Variant = { id: string; product_id: string; color_name: string | null; color_hex: string | null; stock_on_hand: number; reserved: number; active: boolean };
export type Product = { id: string; slug?: string; category_id: string; title: string; summary: string; details: string; material: string; origin: string; price: number; compare_at_price: number | null; images: string[]; video_url: string | null; featured: boolean; product_variants: Variant[] };
export type Category = { id: string; slug?: string; title: string; image_url?: string; icon: string; sort_order: number };
// A banner opens one destination chosen in the admin app: a product, a category, or (neither set) the full catalog.
export type Banner = { id: string; title: string; subtitle: string; image_url: string | null; target_category_id: string | null; target_product_id?: string | null; target_product_slug?: string | null; external_url?: string | null; display_seconds?: number | null };
export type Settings = { support_phone: string; whatsapp_phone: string; payment_method: string; checkout_enabled: boolean; delivery_fees: Record<string,number>; governorate_discounts?: Record<string,number>; baghdad_hours: number; other_hours: number; cancellation_policy: string };
export type Profile = { id: string; name: string; phone: string; backup_phone: string | null; governorate: string; district: string; address_details: string; birth_date: string | null; privacy_accepted_at: string | null };
export type CartItem = { variant_id: string; quantity: number };
export type CatalogData = {products:Product[];categories:Category[];settings:Settings;banners:Banner[]};
export type Shipping = { name: string; phone: string; governorate: string; district: string; details: string; contact_confirmed: boolean };
export type OrderEvent = { id: string; status: string; reason: string | null; problem_type: string | null; scheduled_at: string | null; created_at: string };
export type Order = { id: string; slug: string; order_number: number; status: string; total: number; discount_amount?: number; delivery_fee: number; payment_method: string; created_at: string; delivery_due_at: string; shipping_snapshot: Shipping; order_events: OrderEvent[]; order_items: { id: string; title: string; color_name: string | null; image_url: string | null; quantity: number; unit_price: number }[] };

