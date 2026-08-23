import axios from 'axios'
import type { Game } from './types'

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { 'Content-Type': 'application/json' },
})

export async function getGames(): Promise<Game[]> {
  const { data } = await api.get<Game[]>('/games')
  return data
}
