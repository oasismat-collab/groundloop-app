'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { REGIONS, type Site, type Region } from '@/lib/regions';

// Fix for default marker icons in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function RecenterMap({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], 13);
  }, [lat, lng, map]);
  return null;
}

export default function MapView() {
  const [selectedRegion, setSelectedRegion] = useState('boston');
  const [selectedSite, setSelectedSite] = useState<Site | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const region = REGIONS[selectedRegion];
  const sites = region?.sites || [];

  // Calculate center of all sites
  const lat = sites.length > 0 
    ? sites.reduce((a, s) => a + s.lat, 0) / sites.length 
    : 42.361;
  const lng = sites.length > 0 
    ? sites.reduce((a, s) => a + s.lng, 0) / sites.length 
    : -71.0655;

  const getDirections = (site: Site) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${site.lat},${site.lng}`;
    window.open(url, '_blank');
  };

  if (!mounted) {
    return (
      <div className="w-full h-[600px] bg-gray-100 rounded-xl flex items-center justify-center">
        <div className="text-gray-500">Loading map...</div>
      </div>
    );
  }

  if (!sites.length) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h2 className="text-3xl font-bold mb-4">{region.programme}</h2>
        <div className="bg-white border-2 border-gray-200 rounded-xl p-6 space-y-4">
          <p className="text-lg">{region.summary}</p>
          <p className="text-gray-600">{region.access}</p>
          <a
            href={region.source}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-green-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-green-700 transition-colors"
          >
            Official info →
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Region selector */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold mb-4">Find Drop-Off Locations</h2>
        <div className="flex flex-wrap gap-2">
          {Object.values(REGIONS)
            .filter(r => r.sites.length > 0)
            .map((r) => (
              <button
                key={r.id}
                onClick={() => {
                  setSelectedRegion(r.id);
                  setSelectedSite(null);
                }}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedRegion === r.id
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {r.name}
              </button>
            ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map */}
        <div className="lg:col-span-2">
          <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden">
            <MapContainer
              center={[lat, lng]}
              zoom={13}
              style={{ height: '600px', width: '100%' }}
              scrollWheelZoom={true}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <RecenterMap lat={lat} lng={lng} />
              {sites.map((site) => (
                <Marker
                  key={site.id}
                  position={[site.lat, site.lng]}
                  eventHandlers={{
                    click: () => setSelectedSite(site),
                  }}
                >
                  <Popup>
                    <div className="p-2">
                      <div className="font-bold text-lg">{site.label}</div>
                      <div className="text-gray-600">{site.area}</div>
                      {site.note && <div className="text-sm text-gray-500 mt-1">{site.note}</div>}
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>

        {/* Site list */}
        <div className="lg:col-span-1">
          <div className="bg-white border-2 border-gray-200 rounded-xl p-4">
            <div className="mb-4">
              <h3 className="font-bold text-xl mb-1">{region.programme}</h3>
              <p className="text-sm text-gray-600">{region.name}</p>
            </div>

            {selectedSite && (
              <div className="mb-6 p-4 bg-green-50 border-2 border-green-200 rounded-xl">
                <div className="text-sm text-green-800 font-bold mb-1">{selectedSite.area}</div>
                <div className="font-bold text-lg mb-1">{selectedSite.label}</div>
                {selectedSite.note && <div className="text-sm text-gray-600 mb-3">{selectedSite.note}</div>}
                <button
                  onClick={() => getDirections(selectedSite)}
                  className="w-full bg-green-600 text-white font-bold py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Get Directions
                </button>
              </div>
            )}

            <div className="text-sm font-bold text-gray-600 mb-2">All Sites ({sites.length})</div>
            <div className="space-y-2 max-h-[480px] overflow-y-auto">
              {sites.map((site) => (
                <button
                  key={site.id}
                  onClick={() => setSelectedSite(site)}
                  className={`w-full text-left p-3 rounded-lg border-2 transition-colors ${
                    selectedSite?.id === site.id
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-green-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="font-bold text-sm">{site.label}</div>
                  <div className="text-xs text-gray-600">{site.area}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Program info */}
      <div className="mt-6 bg-white border-2 border-gray-200 rounded-xl p-6">
        <h3 className="font-bold text-xl mb-4">About {region.programme}</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <div className="text-sm font-bold text-green-600 mb-1">SUMMARY</div>
            <p className="text-gray-700">{region.summary}</p>
          </div>
          <div>
            <div className="text-sm font-bold text-green-600 mb-1">ACCESS</div>
            <p className="text-gray-700">{region.access}</p>
          </div>
          <div>
            <div className="text-sm font-bold text-green-600 mb-1">PROCESSOR</div>
            <p className="text-gray-700">{region.processor}</p>
          </div>
          <div>
            <div className="text-sm font-bold text-green-600 mb-1">TIP</div>
            <p className="text-gray-700">{region.tip}</p>
          </div>
        </div>
        <div className="mt-4">
          <a
            href={region.source}
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-600 hover:text-green-700 font-medium"
          >
            Official program information →
          </a>
        </div>
      </div>
    </div>
  );
}
