import { useRecipes as useRecipesContext } from '../src/context/RecipesContext'
import { useEffect } from 'react'

export function useRecipes() {
  const { recipes, loading, error, refreshRecipes } = useRecipesContext()

  useEffect(() => {
    refreshRecipes()
  }, [refreshRecipes])

  return { recipes, loading, error, refresh: refreshRecipes }
}