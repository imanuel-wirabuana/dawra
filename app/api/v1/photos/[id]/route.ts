import { drive } from "@/lib/gdrive/gdrive"
import { db } from "@/lib/firebase/client"
import {
  collection,
  deleteDoc,
  where,
  getDocs,
  query,
} from "firebase/firestore"
import { apiSuccess, apiError } from "@/lib/utils"

const COLLECTION_NAME = "photos"

/**
 * DELETE handler for removing a specific photo by ID
 * @param {Request} _request - The incoming request object (unused)
 * @param {Object} params - Route parameters containing the photo ID
 * @param {Promise<{ id: string }>} params.params - Promise resolving to object with id string
 * @returns {Promise<Response>} JSON response indicating success or failure
 */
export const DELETE = async (
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params

  try {
    // Delete from Google Drive
    await drive.files.delete({
      fileId: id,
    })

    // Delete from Firestore
    const photosRef = collection(db, COLLECTION_NAME)
    const q = query(photosRef, where("id", "==", id))
    const querySnapshot = await getDocs(q)

    if (querySnapshot.empty) {
      return Response.json(apiError("Photo not found"), { status: 404 })
    }

    // Delete all matching documents
    await Promise.all(
      querySnapshot.docs.map(async (doc) => {
        await deleteDoc(doc.ref)
      })
    )

    return Response.json(apiSuccess(null, "Photo deleted successfully"))
  } catch (error) {
    console.error("Delete error:", error)
    return Response.json(apiError("Failed to delete photo"), { status: 500 })
  }
}
