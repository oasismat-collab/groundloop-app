'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { REGIONS, type Site } from '@/lib/regions';

// Fix for default marker icons in Leaflet
delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
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
      <div className="gw-page">
        <div className="gw-loading">Loading map…</div>
      </div>
    );
  }

  // Cities with no drop-off sites (curbside / none) — explain the model instead.
  if (!sites.length) {
    return (
      <div className="gw-page">
        <div className="gw-head">
          <div className="gw-eyebrow"><span /> DROP-OFF LOCATIONS</div>
          <h1>{region.programme}</h1>
        </div>
        <div className="gw-card pad gw-explainer">
          <p className="big">{region.summary}</p>
          <p className="muted">{region.access}</p>
          <a className="gw-btn" href={region.source} target="_blank" rel="noopener noreferrer">
            Official info <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="gw-page">
      <div className="gw-head">
        <div className="gw-eyebrow"><span /> DROP-OFF LOCATIONS</div>
        <h1>Find a place to <em>close the loop.</em></h1>
        <p className="gw-sub">Pick your city to see nearby composting drop-off sites.</p>
        <div className="gw-chips" role="tablist" aria-label="City">
          {Object.values(REGIONS)
            .filter((r) => r.sites.length > 0)
            .map((r) => (
              <button
                key={r.id}
                role="tab"
                aria-selected={selectedRegion === r.id}
                onClick={() => {
                  setSelectedRegion(r.id);
                  setSelectedSite(null);
                }}
                className={`gw-chip${selectedRegion === r.id ? ' active' : ''}`}
              >
                {r.name}
              </button>
            ))}
        </div>
      </div>

      <div className="gw-maplayout">
        {/* Map */}
        <div className="gw-mapframe">
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
                eventHandlers={{ click: () => setSelectedSite(site) }}
              >
                <Popup>
                  <div style={{ padding: 2 }}>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{site.label}</div>
                    <div style={{ color: '#687264', fontSize: 12 }}>{site.area}</div>
                    {site.note && <div style={{ fontSize: 12, color: '#8a9079', marginTop: 4 }}>{site.note}</div>}
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* Site list */}
        <aside className="gw-aside">
          <div className="gw-aside-head">
            <h3>{region.programme}</h3>
            <p>{region.name}</p>
          </div>

          {selectedSite && (
            <div className="gw-selected">
              <div className="area">{selectedSite.area}</div>
              <div className="label">{selectedSite.label}</div>
              {selectedSite.note && <div className="note">{selectedSite.note}</div>}
              <button className="gw-btn block" onClick={() => getDirections(selectedSite)}>
                Get directions <span aria-hidden="true">↗</span>
              </button>
            </div>
          )}

          <div className="gw-listlabel">All sites ({sites.length})</div>
          <div className="gw-sitelist">
            {sites.map((site) => (
              <button
                key={site.id}
                onClick={() => setSelectedSite(site)}
                className={`gw-siterow${selectedSite?.id === site.id ? ' active' : ''}`}
              >
                <div className="name">{site.label}</div>
                <div className="area">{site.area}</div>
              </button>
            ))}
          </div>
        </aside>
      </div>

      {/* Program info */}
      <div className="gw-card pad gw-about">
        <h3>About {region.programme}</h3>
        <div className="gw-aboutgrid">
          <div>
            <div className="k">Summary</div>
            <p>{region.summary}</p>
          </div>
          <div>
            <div className="k">Access</div>
            <p>{region.access}</p>
          </div>
          <div>
            <div className="k">Processor</div>
            <p>{region.processor}</p>
          </div>
          <div>
            <div className="k">Tip</div>
            <p>{region.tip}</p>
          </div>
        </div>
        <div style={{ marginTop: 18 }}>
          <a className="gw-link" href={region.source} target="_blank" rel="noopener noreferrer">
            Official program information ↗
          </a>
        </div>
      </div>
    </div>
  );
}
