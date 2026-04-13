import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/firebase/client"
import type { Expense, CustomExpenseData } from "@/types"

const COLLECTION_NAME = "expenses"

/**
 * Adds a new custom expense to the expenses collection.
 * Itinerary expenses are automatically generated from the system.
 */
export async function addCustomExpense(
  customExpense: CustomExpenseData
): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const expense: Omit<Expense, "id"> = {
      expenseType: "custom",
      include: true, // Default to included
      customExpense,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }

    const docRef = await addDoc(collection(db, COLLECTION_NAME), expense)
    return { success: true, id: docRef.id }
  } catch (error) {
    console.error("Error adding expense:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}
