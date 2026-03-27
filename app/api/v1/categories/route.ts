import {
  getDocs,
  collection,
  addDoc,
  serverTimestamp,
  doc,
  updateDoc,
  deleteDoc,
  getDoc,
} from "firebase/firestore"
import { db } from "@/lib/firebase/client"
import { apiSuccess, apiError } from "@/lib/utils"
import type { Category } from "@/types"

/**
 * GET handler for retrieving all categories
 * @returns {Promise<Response>} JSON response with array of categories
 */
export const GET = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "categories"))
    const data = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    })) as Category[]
    return Response.json(
      apiSuccess(data, "Categories retrieved successfully")
    )
  } catch (error) {
    return Response.json(apiError("Failed to retrieve categories"), { status: 500 })
  }
}

/**
 * POST handler for adding a new category
 * @param {Request} request - The incoming request object
 * @returns {Promise<Response>} JSON response indicating success or failure
 */
export const POST = async (request: Request) => {
  const body = await request.json()
  
  try {
    const docRef = await addDoc(collection(db, "categories"), {
      ...body,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
    
    return Response.json(
      apiSuccess({ id: docRef.id }, "Category added successfully"),
      { status: 201 }
    )
  } catch (error) {
    return Response.json(apiError("Failed to add category"), { status: 500 })
  }
}

/**
 * PUT handler for updating a category
 * @param {Request} request - The incoming request object
 * @returns {Promise<Response>} JSON response indicating success or failure
 */
export const PUT = async (request: Request) => {
  const body = await request.json()
  const { id, ...updateData } = body
  
  if (!id) {
    return Response.json(apiError("Category ID is required"), { status: 400 })
  }
  
  try {
    const categoryRef = doc(db, "categories", id)
    await updateDoc(categoryRef, {
      ...updateData,
      updatedAt: serverTimestamp(),
    })
    
    return Response.json(apiSuccess(null, "Category updated successfully"))
  } catch (error) {
    return Response.json(apiError("Failed to update category"), { status: 500 })
  }
}

/**
 * DELETE handler for deleting a category
 * @param {Request} request - The incoming request object
 * @returns {Promise<Response>} JSON response indicating success or failure
 */
export const DELETE = async (request: Request) => {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")
  
  if (!id) {
    return Response.json(apiError("Category ID is required"), { status: 400 })
  }
  
  try {
    await deleteDoc(doc(db, "categories", id))
    return Response.json(apiSuccess(null, "Category deleted successfully"))
  } catch (error) {
    return Response.json(apiError("Failed to delete category"), { status: 500 })
  }
}
