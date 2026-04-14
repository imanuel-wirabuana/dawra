import {
  getDocs,
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore"
import { db } from "@/lib/firebase/client"
import { apiSuccess, apiError } from "@/lib/utils"

const COLLECTION_NAME = "itineraries"

/**
 * GET handler for retrieving all itinerary items
 * @returns {Promise<Response>} JSON response with array of itinerary items
 */
export const GET = async () => {
  const querySnapshot = await getDocs(collection(db, COLLECTION_NAME))
  const data = querySnapshot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  }))
  return Response.json(
    apiSuccess(data, "Itinerary items retrieved successfully")
  )
}

/**
 * POST handler for adding a new itinerary item
 * @param {Request} request - The incoming request object
 * @returns {Promise<Response>} JSON response indicating success or failure
 */
export const POST = async (request: Request) => {
  const body = await request.json()
  try {
    await addDoc(collection(db, COLLECTION_NAME), {
      ...body,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
  } catch {
    return Response.json(apiError("Failed to add itinerary item"), {
      status: 500,
    })
  }

  return Response.json(apiSuccess(null, "Itinerary item added successfully"), {
    status: 201,
  })
}
