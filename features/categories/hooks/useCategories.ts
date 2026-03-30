import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  getCategories,
  addCategory,
  deleteCategory,
} from "../services/category.service"
import type { Category } from "@/types"

export function useCategories() {
  const queryClient = useQueryClient()

  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  const createCategoryMutation = useMutation({
    mutationFn: addCategory,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["categories"] })
      return data
    },
  })

  const deleteCategoryMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] })
    },
  })

  return {
    categories: categoriesQuery.data?.data || [],
    isLoading: categoriesQuery.isLoading,
    error: categoriesQuery.error,
    createCategory: createCategoryMutation.mutate,
    createCategoryMutation,
    isCreating: createCategoryMutation.isPending,
    createError: createCategoryMutation.error,
    deleteCategory: deleteCategoryMutation.mutate,
    isDeleting: deleteCategoryMutation.isPending,
    deleteError: deleteCategoryMutation.error,
  }
}
