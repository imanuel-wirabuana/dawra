import {
  getDocs,
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore"
import { db } from "@/lib/firebase/client"
import { apiSuccess, apiError } from "@/lib/utils"
import type { Category } from "@/types"

const COLLECTION_NAME = "categories"

/**
 * GET handler for retrieving all categories
 * @returns {Promise<Response>} JSON response with array of categories
 */
export const GET = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME))
    const data = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    })) as Category[]
    return Response.json(apiSuccess(data, "Categories retrieved successfully"))
  } catch (error) {
    return Response.json(apiError("Failed to retrieve categories"), {
      status: 500,
    })
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
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
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
