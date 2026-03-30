import { google } from "googleapis"

const oauth2Client = new google.auth.OAuth2(
  process.env.NEXT_PUBLIC_GDRIVE_CLIENT_ID,
  process.env.NEXT_PUBLIC_GDRIVE_CLIENT_SECRET
)

oauth2Client.setCredentials({
  refresh_token: process.env.NEXT_PUBLIC_GDRIVE_REFRESH_TOKEN,
})

export const drive = google.drive({
  version: "v3",
  auth: oauth2Client,
})
