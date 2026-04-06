// =============================================================================
// InstaTickets — Shared TypeScript Types
// Mirrors the Go backend domain models exactly.
// =============================================================================

// --- Enums ---

export type UserRole = "ORGANIZER" | "BUYER" | "SCANNER";

export type OrderStatus = "PENDING" | "PAID" | "EXPIRED" | "CANCELLED";

export type TicketStatus = "UNSCANNED" | "SCANNED";

export type EventStatus = "ACTIVE" | "CANCELLED";

export type TierAvailability =
  | "AVAILABLE"
  | "COMING_SOON"
  | "SALE_ENDED"
  | "SOLD_OUT";

// --- Core Models ---

export interface User {
  id: string;
  email: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Event {
  id: string;
  name: string;
  venue: string;
  description: string;
  event_date: string;
  organizer_id: string;
  status: EventStatus;
  created_at: string;
  updated_at: string;
  ticket_tiers?: TicketTier[];
}

export interface TicketTier {
  id: string;
  event_id: string;
  name: string;
  price: number;
  total_quantity: number;
  quantity_sold: number;
  locked_quantity: number;
  sale_start_date?: string | null;
  sale_end_date?: string | null;
  created_at: string;
}

// TicketTier enriched with availability — returned by GET /events/:id/tiers
export interface TierWithAvailability extends TicketTier {
  availability: TierAvailability;
  available_count: number;
}

export interface Order {
  id: string;
  event_id: string;
  buyer_id?: string;
  buyer_email: string;
  status: OrderStatus;
  total_amount: number;
  payment_reference?: string;
  expires_at: string;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
  tickets?: Ticket[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  tier_id: string;
  quantity: number;
  unit_price: number;
  tier?: TicketTier;
}

export interface Ticket {
  id: string;
  order_id: string;
  tier_id: string;
  unique_code: string;
  status: TicketStatus;
  scanned_at?: string | null;
  created_at: string;
  tier?: TicketTier;
}

// --- API Request Payloads ---

export interface RegisterPayload {
  email: string;
  password: string;
  role: UserRole;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface CreateTierPayload {
  name: string;
  price: number;
  total_quantity: number;
  sale_start_date?: string | null;
  sale_end_date?: string | null;
}

export interface CreateEventPayload {
  name: string;
  venue: string;
  description: string;
  event_date: string;
  tiers: CreateTierPayload[];
}

export interface UpdateEventPayload {
  name: string;
  venue: string;
  description: string;
  event_date: string;
}

export interface CheckoutItemPayload {
  tier_id: string;
  quantity: number;
}

export interface CheckoutPayload {
  event_id: string;
  buyer_email: string;
  items: CheckoutItemPayload[];
}

export interface ScanPayload {
  unique_code: string;
}

// --- API Response Shapes ---

export interface EventsListResponse {
  events: Event[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface EventsListResponse {
  events: Event[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface CheckoutResponse {
  order_id: string;
  status: OrderStatus;
  total: number;
  expires_at: string;
  items: OrderItem[];
}

export interface ScanSuccessResponse {
  ticket_id: string;
  status: "ACCESS_GRANTED";
  message: string;
  tier_name: string;
  event_name: string;
  scanned_at: string;
}

export interface ScanErrorResponse {
  error: string;
  scanned_at?: string;
}

// --- UI-only types (not from API) ---

// Cart item managed in Zustand before checkout is called
export interface CartItem {
  tier: TierWithAvailability;
  quantity: number;
}

// Auth store shape
export interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  setAuth: (token: string, user: User) => void;
  clearAuth: () => void;
}

// Generic API error shape
export interface APIError {
  success: false;
  error: string;
  code: number;
}