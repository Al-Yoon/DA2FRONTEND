// Como el backend obtiene pacienteId del token, solo necesito 1 función

import { apiCall } from './client'
import type { Recipe } from '../types/recipes'

export async function fetchRecipes(token: string): Promise<Recipe[]> {
  return apiCall<Recipe[]>('/api/mi-salud/recetas', {
    method: 'GET',
    token,
  })
}