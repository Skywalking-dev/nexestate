/**
 * Tokko Broker API — response type definitions.
 * Ref: https://www.tokkobroker.com/api/playground
 */

export interface TokkoPhoto {
  image: string
  thumb: string
  order: number
  original: string
}

export interface TokkoLocation {
  lat: number | null
  long: number | null
}

export interface TokkoPropertyType {
  id: number
  code: string
}

export interface TokkoProperty {
  id: number
  address: string
  title: string
  description: string
  type: TokkoPropertyType
  operations: Array<{
    operation_type: string
    prices: Array<{ currency: string; price: number }>
  }>
  /** Flattened price — first operation/price entry */
  price: number | null
  currency: string | null
  photos: TokkoPhoto[]
  geo_lat: number | null
  geo_long: number | null
  surface_total: number | null
  surface_covered: number | null
  suite_amount: number | null
  bathroom_amount: number | null
  tags: Array<{ id: number; name: string }>
  custom_tags: Array<{ id: number; name: string }>
  status: number | string
  public_url: string | null
  publication_title: string | null
  reference_code: string | null
  expenses: number | null
  orientation: string | null
  room_amount: number | null
  dining_room: number | null
  living_amount: number | null
  parking_lot_amount: number | null
  surface: string | null
  floors_amount: number | null
  videos: Array<{ url: string; provider: string }>
  credit_eligible: string | null
  created_date: string
  modified_date: string
}

export interface TokkoContact {
  id: number
  name: string
  email: string
  phone: string
  tags: Array<{ id: number; name: string }>
  created_date: string
}

export interface TokkoApiResponse<T> {
  count: number
  next: string | null
  previous: string | null
  objects: T[]
}

export interface TokkoApiError {
  detail: string
}
