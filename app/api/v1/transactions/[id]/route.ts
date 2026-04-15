import {
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore"
import { db } from "@/lib/firebase/client"
import { apiSuccess, apiError } from "@/lib/utils"

const COLLECTION_NAME = "transactions"

/**
 * PATCH handler for updating a transaction
 * @param {Request} request - The incoming request object
 * @param {Object} params - Route parameters
 * @param {string} params.id - Transaction ID
 * @returns {Promise<Response>} JSON response indicating success or failure
 */
export const PATCH = async (
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params
  const body = await request.json()

  try {
    const docRef = doc(db, COLLECTION_NAME, id)
    await updateDoc(docRef, {
      ...body,
      updatedAt: serverTimestamp(),
    })
  } catch {
    return Response.json(apiError("Failed to update transaction"), {
      status: 500,
    })
  }

  return Response.json(apiSuccess(null, "Transaction updated successfully"))
}

/**
 * DELETE handler for deleting a transaction
 * @param {Request} request - The incoming request object
 * @param {Object} params - Route parameters
 * @param {string} params.id - Transaction ID
 * @returns {Promise<Response>} JSON response indicating success or failure
 */
export const DELETE = async (
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params

  try {
    const docRef = doc(db, COLLECTION_NAME, id)
    await deleteDoc(docRef)
  } catch {
    return Response.json(apiError("Failed to delete transaction"), {
      status: 500,
    })
  }

  return Response.json(apiSuccess(null, "Transaction deleted successfully"))
}
