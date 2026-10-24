'use client';

import dynamic from 'next/dynamic';

// Import MapView dynamically to avoid SSR issues with Leaflet
const MapView = dynamic(() => import('../components/MapView'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center">
      <div className="text-gray-500">Loading map...</div>
    </div>
  ),
});

export default function MapPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <MapView />
    </div>
  );
}
