import { doc, updateDoc, setDoc, serverTimestamp, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase/client"
import type { Expense } from "@/types"

const COLLECTION_NAME = "expenses"

/**
 * Toggles the include status of an expense.
 * For custom expenses: updates the existing document.
 * For itinerary expenses: creates/updates an override document.
 */
export async function toggleExpenseInclude(
  expenseId: string,
  currentInclude: boolean | undefined,
  expenseData?: Partial<Expense>
): Promise<{ success: boolean; error?: string }> {
  try {
    const newInclude = currentInclude === false ? true : false

    // Check if this is an itinerary expense (IDs start with "it-")
    if (expenseId.startsWith("it-")) {
      // For itinerary expenses, we need to create/update an override document
      const itineraryId = expenseId.replace("it-", "")
      const overrideDocRef = doc(db, COLLECTION_NAME, expenseId)

      // Check if override document exists
      const existingDoc = await getDoc(overrideDocRef)

      if (existingDoc.exists()) {
        // Update existing override
        await updateDoc(overrideDocRef, {
          include: newInclude,
          updatedAt: serverTimestamp(),
        })
      } else {
        // Create new override document for itinerary expense
        const overrideExpense: Omit<Expense, "id"> = {
          expenseType: "itinerary",
          itineraryId: itineraryId,
          include: newInclude,
          // Cache the data from the itinerary
          cachedAmount: expenseData?.cachedAmount,
          cachedDate: expenseData?.cachedDate,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        }
        await setDoc(overrideDocRef, overrideExpense)
      }
    } else {
      // For custom expenses, just update the document
      await updateDoc(doc(db, COLLECTION_NAME, expenseId), {
        include: newInclude,
        updatedAt: serverTimestamp(),
      })
    }

    return { success: true }
  } catch (error) {
    console.error("Error toggling expense include:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}
