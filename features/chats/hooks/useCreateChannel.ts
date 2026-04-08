import { useMutation } from "@tanstack/react-query"
import { createChannel } from "../services/channels.service"
import type { Channel } from "@/types"

export function useCreateChannel() {
  return useMutation({
    mutationFn: (channel: Omit<Channel, "id" | "createdAt" | "updatedAt">) =>
      createChannel(channel),
  })
}
