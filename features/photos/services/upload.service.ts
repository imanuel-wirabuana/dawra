import type { Photo } from "@/types"

// Client-side Google Drive upload to bypass Vercel payload limits
async function uploadToGoogleDrive(file: File): Promise<{ id: string; webViewLink: string }> {
  const now = new Date()
  const date = now.toISOString().split("T")[0].replace(/-/g, "")
  const time = now.toTimeString().split(" ")[0].replace(/:/g, "")
  const extension = file.name.split(".").pop()
  const fileName = `dawra${date}${time}.${extension}`

  const metadata = {
    name: fileName,
    parents: [process.env.NEXT_PUBLIC_GDRIVE_FOLDER_ID!],
  }

  const form = new FormData()
  form.append("metadata", new Blob([JSON.stringify(metadata)], { type: "application/json" }))
  form.append("file", file)

  const accessToken = await getAccessToken()

  const response = await fetch(
    "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,webViewLink",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: form,
    }
  )

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Google Drive upload failed: ${error}`)
  }

  const data = await response.json()

  // Make file public
  await fetch(`https://www.googleapis.com/drive/v3/files/${data.id}/permissions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      role: "reader",
      type: "anyone",
    }),
  })

  return { id: data.id, webViewLink: data.webViewLink }
}

// Get fresh access token using refresh token
async function getAccessToken(): Promise<string> {
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: process.env.NEXT_PUBLIC_GDRIVE_CLIENT_ID!,
      client_secret: process.env.NEXT_PUBLIC_GDRIVE_CLIENT_SECRET!,
      refresh_token: process.env.NEXT_PUBLIC_GDRIVE_REFRESH_TOKEN!,
      grant_type: "refresh_token",
    }),
  })

  if (!response.ok) {
    throw new Error("Failed to get access token")
  }

  const data = await response.json()
  return data.access_token
}

export async function uploadPhoto(
  file: File,
  folderId?: string
): Promise<Photo> {
  // Upload directly to Google Drive from client
  const driveResult = await uploadToGoogleDrive(file)

  // Save metadata via API
  const metadata = {
    id: driveResult.id,
    url: driveResult.webViewLink,
    realFileName: file.name,
    extension: file.name.split(".").pop() || "",
    size: file.size,
    folderId: folderId || null,
  }

  const response = await fetch("/api/v1/photos", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(metadata),
  })

  if (!response.ok) {
    const errorData = await response.json()
    console.error("Photo metadata save failed:", errorData)
    throw new Error(errorData.message || `Upload failed for ${file.name}`)
  }

  const data = await response.json()
  return data.data
}
