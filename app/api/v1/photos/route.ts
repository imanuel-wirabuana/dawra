import { db } from "@/lib/firebase/client"
import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore"
import { apiSuccess, apiError } from "@/lib/utils"
import type { Photo } from "@/types"

const COLLECTION_NAME = "photos"

/**
 * POST handler for saving photo metadata (file upload now happens client-side)
 * @param {Request} request - The incoming request object with photo metadata
 * @returns {Promise<Response>} JSON response with saved photo data
 */
export const POST = async (request: Request) => {
  try {
    const body = await request.json()
    const { id, url, realFileName, extension, size, folderId } = body

    if (!id || !url) {
      return Response.json(apiError("Missing required photo metadata"), { status: 400 })
    }

    // Create Photo object
    const photo = {
      id,
      url,
      name: realFileName,
      realFileName,
      extension: extension || "",
      size: size || 0,
      folderId: folderId || null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }

    // Insert into Firebase Firestore
    const photosRef = collection(db, COLLECTION_NAME)
    const docRef = await addDoc(photosRef, photo)

    return Response.json(
      apiSuccess({ ...photo, docId: docRef.id }, "Photo uploaded successfully"),
      { status: 201 }
    )
  } catch (error) {
    console.error(error)
    return Response.json(apiError("Failed to save photo metadata"), { status: 500 })
  }
}

/**
 * GET handler for retrieving all photos
 * @returns {Promise<Response>} JSON response with array of photos
 */
export const GET = async () => {
  try {
    const photosRef = collection(db, COLLECTION_NAME)
    const q = query(photosRef, orderBy("createdAt", "desc"))
    const querySnapshot = await getDocs(q)

    const photos: Photo[] = querySnapshot.docs.map((doc) => {
      const data = doc.data() as Photo
      return {
        ...data,
        docId: doc.id,
      }
    })

    return Response.json(apiSuccess(photos, "Photos retrieved successfully"))
  } catch (error) {
    console.error(error)
    return Response.json(apiError("Failed to retrieve photos"), { status: 500 })
  }
}
