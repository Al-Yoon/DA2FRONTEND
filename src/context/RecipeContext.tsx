import { createContext, useContext, useCallback, useMemo, ReactNode, useState } from 'react'
import { useAuth } from './AuthContext'
import { fetchRecipes } from '@/lib/api/recipes'
import type { Recipe } from '@/lib/types/recipes'

type RecipesContextValue = {
  recipes: Recipe[]
  loading: boolean
  error: string | null
  refreshRecipes: () => Promise<void>
}

const RecipesContext = createContext<RecipesContextValue | null>(null)

export function RecipesProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const refreshRecipes = useCallback(async () => {
    if (!user?.token) return

    setLoading(true)
    setError(null)
    try {
      const data = await fetchRecipes(user.token)
      setRecipes(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading recipes')
    } finally {
      setLoading(false)
    }
  }, [user?.token])

  const value = useMemo(
    () => ({ recipes, loading, error, refreshRecipes }),
    [recipes, loading, error, refreshRecipes]
  )

  return <RecipesContext.Provider value={value}>{children}</RecipesContext.Provider>
}

export function useRecipes() {
  const ctx = useContext(RecipesContext)
  if (!ctx) throw new Error('useRecipes debe usarse dentro de RecipesProvider')
  return ctx
}