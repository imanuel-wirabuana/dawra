// Photos module entry point for module federation
// Exposes the photos module components and utilities

export type { Photo, Folder } from '@/lib/federation/shared-types';

// Module metadata
export const moduleMetadata = {
  name: 'photos_module',
  displayName: 'Photos',
  route: '/photos',
  description: 'Photo organization and gallery feature',
  version: '1.0.0',
};
