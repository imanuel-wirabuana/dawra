import {
  getDocs,
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore"
import { db } from "@/lib/firebase/client"
import { apiSuccess, apiError } from "@/lib/utils"
import { isSameMonth, parseISO } from "date-fns"
import type { Transaction } from "@/types"

const COLLECTION_NAME = "transactions"

/**
 * GET handler for retrieving all transactions or filtering by month
 * @param {Request} request - The incoming request object
 * @returns {Promise<Response>} JSON response with array of transactions
 */
export const GET = async (request: Request) => {
  const { searchParams } = new URL(request.url)
  const monthParam = searchParams.get("month")

  let querySnapshot

  if (monthParam) {
    // Fetch all transactions and filter client-side by month
    // Firestore doesn't support direct month queries on string dates
    querySnapshot = await getDocs(collection(db, COLLECTION_NAME))
    const allData = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    })) as Transaction[]

    // Filter by month
    const monthDate = parseISO(monthParam)
    const data = allData.filter((item) =>
      isSameMonth(parseISO(item.date), monthDate)
    )

    return Response.json(
      apiSuccess(data, "Transactions retrieved successfully")
    )
  } else {
    querySnapshot = await getDocs(collection(db, COLLECTION_NAME))
    const data = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }))
    return Response.json(
      apiSuccess(data, "Transactions retrieved successfully")
    )
  }
}

/**
 * POST handler for adding a new transaction
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
    return Response.json(apiError("Failed to add transaction"), {
      status: 500,
    })
  }

  return Response.json(apiSuccess(null, "Transaction added successfully"), {
    status: 201,
  })
}
