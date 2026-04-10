// Bucket Lists module entry point for module federation
// Exposes the bucket lists module components and utilities

export type { BucketList } from '@/lib/federation/shared-types';

// Module metadata
export const moduleMetadata = {
  name: 'bucket-lists_module',
  displayName: 'Bucket Lists',
  route: '/bucket-lists',
  description: 'Bucket list management and tracking',
  version: '1.0.0',
};
