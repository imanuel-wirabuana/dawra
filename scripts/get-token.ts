import { config } from "dotenv"
import { google } from "googleapis"
import readline from "readline"

config()

const oauth2Client = new google.auth.OAuth2(
  process.env.NEXT_PUBLIC_GDRIVE_CLIENT_ID,
  process.env.NEXT_PUBLIC_GDRIVE_CLIENT_SECRET,
  "http://localhost:3000/api/auth/callback"
)

const url = oauth2Client.generateAuthUrl({
  access_type: "offline",
  prompt: "consent",
  scope: ["https://www.googleapis.com/auth/drive"],
})

console.log("Authorize this app:", url)

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

rl.question("Enter code: ", async (code) => {
  const { tokens } = await oauth2Client.getToken(code)
  console.log(tokens)
  rl.close()
})
