// Itineraries module entry point for module federation
// Exposes the itineraries module components and utilities

export type { ItineraryItem } from '@/lib/federation/shared-types';

// Module metadata
export const moduleMetadata = {
  name: 'itineraries_module',
  displayName: 'Itineraries',
  route: '/itineraries',
  description: 'Travel and event itinerary planning',
  version: '1.0.0',
};
