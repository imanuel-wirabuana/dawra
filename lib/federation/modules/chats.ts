// Chats module entry point for module federation
// Exposes the chats module components and utilities

export { default as ChatsPanel } from '@/features/chats/components/ChatsPanel';
export { useRealtimeChats } from '@/features/chats/hooks/useRealtimeChats';
export { useAddChatMessage } from '@/features/chats/hooks/useAddChatMessage';
export type { ChatMessage } from '@/lib/federation/shared-types';

// Module metadata
export const moduleMetadata = {
  name: 'chats_module',
  displayName: 'Chats',
  route: '/chats',
  description: 'Real-time chat messaging feature',
  version: '1.0.0',
};
