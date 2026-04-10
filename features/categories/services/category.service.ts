import type { Category } from "@/types"

export async function getCategories(): Promise<{
  success: boolean
  data?: Category[]
  error?: string
}> {
  try {
    const response = await fetch("/api/v1/categories")

    if (!response.ok) {
      const errorText = await response.text()
      let errorMessage = errorText || `HTTP ${response.status}`
      try {
        const errorData = JSON.parse(errorText)
        errorMessage = errorData.message || errorText
      } catch {
        // Use raw text if not valid JSON
      }
      throw new Error(errorMessage || "Failed to fetch categories")
    }

    const result = await response.json()
    return { success: true, data: result.data }
  } catch (error) {
    console.error("Error fetching categories:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

export async function addCategory(category: Omit<Category, "id">): Promise<{
  success: boolean
  id?: string
  error?: string
}> {
  try {
    const response = await fetch("/api/v1/categories", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(category),
    })

    if (!response.ok) {
      const errorText = await response.text()
      let errorMessage = errorText || `HTTP ${response.status}`
      try {
        const errorData = JSON.parse(errorText)
        errorMessage = errorData.message || errorText
      } catch {
        // Use raw text if not valid JSON
      }
      throw new Error(errorMessage || "Failed to add category")
    }

    const data = await response.json()
    return { success: true, id: data.data.id }
  } catch (error) {
    console.error("Error adding category:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

export async function updateCategory(category: Category): Promise<{
  success: boolean
  error?: string
}> {
  try {
    const response = await fetch(`/api/v1/categories/${category.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(category),
    })

    if (!response.ok) {
      const errorText = await response.text()
      let errorMessage = errorText || `HTTP ${response.status}`
      try {
        const errorData = JSON.parse(errorText)
        errorMessage = errorData.message || errorText
      } catch {
        // Use raw text if not valid JSON
      }
      throw new Error(errorMessage || "Failed to update category")
    }

    return { success: true }
  } catch (error) {
    console.error("Error updating category:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

export async function deleteCategory(id: string): Promise<{
  success: boolean
  error?: string
}> {
  try {
    const response = await fetch(`/api/v1/categories/${id}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      const errorText = await response.text()
      let errorMessage = errorText || `HTTP ${response.status}`
      try {
        const errorData = JSON.parse(errorText)
        errorMessage = errorData.message || errorText
      } catch {
        // Use raw text if not valid JSON
      }
      throw new Error(errorMessage || "Failed to delete category")
    }

    return { success: true }
  } catch (error) {
    console.error("Error deleting category:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}
