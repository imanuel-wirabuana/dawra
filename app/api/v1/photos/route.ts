import { drive } from "@/lib/gdrive/gdrive"
import { Readable } from "stream"
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

/**
 * POST handler for uploading a new photo
 * @param {Request} request - The incoming request object with form data
 * @returns {Promise<Response>} JSON response with uploaded photo data
 */
export const POST = async (request: Request) => {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const folderId = formData.get("folderId") as string | undefined

    if (!file) {
      return Response.json(apiError("No file provided"), { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const now = new Date()
    const date = now.toISOString().split("T")[0].replace(/-/g, "")
    const time = now.toTimeString().split(" ")[0].replace(/:/g, "")
    const extension = file.name.split(".").pop()
    const fileName = `dawra${date}${time}.${extension}`

    // Upload to Google Drive
    const res = await drive.files.create({
      requestBody: {
        name: fileName,
        parents: [process.env.NEXT_PUBLIC_GDRIVE_FOLDER_ID!],
      },
      media: {
        mimeType: file.type,
        body: Readable.from(buffer),
      },
      fields: "id,webViewLink",
    })

    const fileId = res.data.id!
    const webViewLink = res.data.webViewLink!

    // Make file public
    await drive.permissions.create({
      fileId,
      requestBody: {
        role: "reader",
        type: "anyone",
      },
    })

    // Create Photo object
    const photo = {
      id: fileId,
      url: webViewLink,
      name: fileName,
      realFileName: file.name,
      extension: extension || "",
      size: file.size,
      folderId: folderId || null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }

    // Insert into Firebase Firestore
    const photosRef = collection(db, "photos")
    const docRef = await addDoc(photosRef, photo)

    return Response.json(
      apiSuccess({ ...photo, docId: docRef.id }, "Photo uploaded successfully"),
      { status: 201 }
    )
  } catch (error) {
    console.error(error)
    return Response.json(apiError("Failed to upload photo"), { status: 500 })
  }
}

/**
 * GET handler for retrieving all photos
 * @returns {Promise<Response>} JSON response with array of photos
 */
export const GET = async () => {
  try {
    const photosRef = collection(db, "photos")
    const q = query(photosRef, orderBy("createdAt", "desc"))
    const querySnapshot = await getDocs(q)

    const photos: Photo[] = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    })) as Photo[]

    return Response.json(apiSuccess(photos, "Photos retrieved successfully"))
  } catch (error) {
    console.error(error)
    return Response.json(apiError("Failed to retrieve photos"), { status: 500 })
  }
}
