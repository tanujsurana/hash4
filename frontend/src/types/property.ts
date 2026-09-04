export type PropertyImage = {
  id: number
  property_id: number
  image_url: string
  signed_url: string
  created_at: string
}

export type PropertyOwner = {
  id: number
  name: string
}

export type Property = {
  id: number
  title: string
  location: string
  city: string
  price: number
  bedrooms: number
  bathrooms: number
  property_type: string
  area_sqft: number
  description: string
  status: string
  created_at: string
  updated_at: string
  owner: PropertyOwner
  images: PropertyImage[]
}