export type Role = 'ADMIN' | 'USER'

export interface User {
  id: string
  name: string
  email: string
  role: Role
}

export interface Player {
  _id: string
  firstName: string
  lastName: string
  country: string
  birthDate: string
  hand: 'RIGHT' | 'LEFT'
  backhand: 'ONE_HANDED' | 'TWO_HANDED'
  heightCm?: number
  ranking?: number
  grandSlams?: number
  bio: string
  active: boolean
}

export interface Tournament {
  _id: string
  name: string
  category: 'GRAND_SLAM' | 'MASTERS_1000' | 'ATP_500' | 'ATP_250'
  surface: 'HARD' | 'CLAY' | 'GRASS' | 'CARPET'
  city: string
  country: string
  year: number
  indoor: boolean
  description: string
  active: boolean
}

export interface ListResponse<T> {
  data: T[]
  meta: { total: number; page: number; limit: number; totalPages: number }
}
