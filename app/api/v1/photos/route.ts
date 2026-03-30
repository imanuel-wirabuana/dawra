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
import type { Photo } from "@/types"

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get("file") as File

    if (!file) {
      return Response.json({ error: "No file" }, { status: 400 })
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

    const url = webViewLink

    // Create Photo object
    const photo: Photo = {
      id: fileId,
      url,
      name: fileName,
      realFileName: file.name,
      extension: extension || "",
      size: file.size,
    }

    // Insert into Firebase Firestore
    const photosRef = collection(db, "photos")
    await addDoc(photosRef, {
      ...photo,
      createdAt: serverTimestamp(),
    })

    return Response.json(photo)
  } catch (err) {
    console.error(err)
    return Response.json({ error: "Upload failed" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const photosRef = collection(db, "photos")
    const q = query(photosRef, orderBy("createdAt", "desc"))
    const querySnapshot = await getDocs(q)

    const photos: Photo[] = []
    querySnapshot.forEach((doc) => {
      const data = doc.data()
      photos.push({
        id: data.id,
        url: data.url,
        name: data.name,
        realFileName: data.realFileName,
        extension: data.extension || "",
        size: data.size || 0,
      })
    })

    return Response.json(photos)
  } catch (err) {
    console.error(err)
    return Response.json({ error: "Failed to fetch photos" }, { status: 500 })
  }
}
