'use client';

import dynamic from 'next/dynamic';
import SiteHeader from '../components/SiteHeader';

// Import MapView dynamically to avoid SSR issues with Leaflet
const MapView = dynamic(() => import('../components/MapView'), {
  ssr: false,
  loading: () => (
    <div className="gw-page">
      <div className="gw-loading">Loading map…</div>
    </div>
  ),
});

export default function MapPage() {
  return (
    <>
      <SiteHeader />
      <MapView />
    </>
  );
}
