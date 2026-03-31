import {
  getDoc,
  doc,
  deleteDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore"
import { db } from "@/lib/firebase/client"
import { apiSuccess, apiError } from "@/lib/utils"

const COLLECTION_NAME = "itineraries"

/**
 * GET handler for retrieving a specific itinerary item by ID
 * @param {Request} _request - The incoming request object (unused)
 * @param {Object} params - Route parameters containing the document ID
 * @param {Promise<{ id: string }>} params.params - Promise resolving to object with id string
 * @returns {Promise<Response>} JSON response with the requested itinerary item
 */
export const GET = async (
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params
  const querySnapshot = await getDoc(doc(db, COLLECTION_NAME, id))
  const data = querySnapshot.data()
  if (!data) {
    return Response.json(apiError("Itinerary item not found"), { status: 404 })
  }
  return Response.json(
    apiSuccess({ ...data, id }, "Itinerary item retrieved successfully")
  )
}

/**
 * PATCH handler for updating a specific itinerary item by ID (partial update)
 * @param {Request} request - The incoming request object containing update data
 * @param {Object} params - Route parameters containing the document ID
 * @param {Promise<{ id: string }>} params.params - Promise resolving to object with id string
 * @returns {Promise<Response>} JSON response indicating success or failure
 */
export const PATCH = async (
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params
  const body = await request.json()
  try {
    await updateDoc(doc(db, COLLECTION_NAME, id), {
      ...body,
      updatedAt: serverTimestamp(),
    })
  } catch (error) {
    return Response.json(apiError("Failed to update itinerary item"), {
      status: 500,
    })
  }
  return Response.json(apiSuccess(null, "Itinerary item updated successfully"))
}

/**
 * PUT handler for updating a specific itinerary item by ID (full update)
 * @param {Request} request - The incoming request object containing update data
 * @param {Object} params - Route parameters containing the document ID
 * @param {Promise<{ id: string }>} params.params - Promise resolving to object with id string
 * @returns {Promise<Response>} JSON response indicating success or failure
 */
export const PUT = async (
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params
  const body = await request.json()
  try {
    await updateDoc(doc(db, COLLECTION_NAME, id), {
      ...body,
      updatedAt: serverTimestamp(),
    })
  } catch (error) {
    return Response.json(apiError("Failed to update itinerary item"), {
      status: 500,
    })
  }
  return Response.json(apiSuccess(null, "Itinerary item updated successfully"))
}

/**
 * DELETE handler for removing a specific itinerary item by ID
 * @param {Request} _request - The incoming request object (unused)
 * @param {Object} params - Route parameters containing the document ID
 * @param {Promise<{ id: string }>} params.params - Promise resolving to object with id string
 * @returns {Promise<Response>} JSON response indicating success or failure
 */
export const DELETE = async (
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, id))
  } catch (error) {
    return Response.json(apiError("Failed to delete itinerary item"), {
      status: 500,
    })
  }
  return Response.json(apiSuccess(null, "Itinerary item deleted successfully"))
}
