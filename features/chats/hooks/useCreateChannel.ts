import { useMutation } from "@tanstack/react-query"
import { createChannel } from "../services/channels.service"
import type { Channel } from "@/types"
import { toast } from "sonner"

export function useCreateChannel() {
  return useMutation({
    mutationFn: async (
      channel: Omit<Channel, "id" | "createdAt" | "updatedAt">
    ) => {
      const toastId = toast.loading("Creating channel...")
      try {
        const result = await createChannel(channel)
        toast.success("Channel created", { id: toastId })
        return result
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to create channel"
        toast.error(message, { id: toastId })
        throw error
      }
    },
  })
}
