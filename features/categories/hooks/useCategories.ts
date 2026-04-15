import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  getCategories,
  addCategory,
  deleteCategory,
} from "../services/category.service"
import { addActivity } from "@/features/activities/services/add.service"
import type { Category } from "@/types"
import { toast } from "sonner"

export function useCategories() {
  const queryClient = useQueryClient()

  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  const createCategoryMutation = useMutation({
    mutationFn: async (category: Omit<Category, "id">) => {
      const toastId = toast.loading("Creating category...")
      try {
        const result = await addCategory(category)
        if (result.success) {
          toast.success("Category created", { id: toastId })

          // Log activity (non-blocking)
          addActivity({
            type: "category.create",
            entity: "category",
            entityId: result.id || "",
            message: `Created category: ${category.name}`,
            metadata: {
              categoryName: category.name,
              categoryColor: category.color,
            },
          }).catch(() => {
            // Ignore errors - activities are non-blocking
          })
        } else {
          toast.error(result.error || "Failed to create category", {
            id: toastId,
          })
        }
        return result
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to create category"
        toast.error(message, { id: toastId })
        throw error
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["categories"] })
      return data
    },
  })

  const deleteCategoryMutation = useMutation({
    mutationFn: async (id: string) => {
      const toastId = toast.loading("Deleting category...")
      try {
        const result = await deleteCategory(id)
        if (result.success) {
          toast.success("Category deleted", { id: toastId })

          // Log activity (non-blocking)
          addActivity({
            type: "category.delete",
            entity: "category",
            entityId: id,
            message: "Deleted a category",
            metadata: {},
          }).catch(() => {
            // Ignore errors - activities are non-blocking
          })
        } else {
          toast.error(result.error || "Failed to delete category", {
            id: toastId,
          })
        }
        return result
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to delete category"
        toast.error(message, { id: toastId })
        throw error
      }
    },
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
