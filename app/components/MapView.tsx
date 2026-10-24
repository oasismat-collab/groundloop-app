'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { REGIONS, type Site } from '@/lib/regions';

// Branded teardrop marker (GroundLoop green + leaf) as a Leaflet divIcon,
// replacing the generic blue default pin.
function leafMarker(active = false): L.DivIcon {
  const fill = active ? '#1f5c3f' : '#2f7a55';
  return L.divIcon({
    className: 'gw-marker',
    html: `<svg width="34" height="44" viewBox="0 0 34 44" xmlns="http://www.w3.org/2000/svg">
      <path d="M17 1C8.2 1 1 8 1 16.6 1 28 17 43 17 43s16-15 16-26.4C33 8 25.8 1 17 1Z" fill="${fill}" stroke="#ffffff" stroke-width="2"/>
      <path d="M17 11c-4 0-7 3-7 7 5 0 7-2 7-7Zm0 0c4 0 7 3 7 7-5 0-7-2-7-7Z" fill="#eaf3ea"/>
    </svg>`,
    iconSize: [34, 44],
    iconAnchor: [17, 43],
    popupAnchor: [0, -38],
  });
}

const LeafGlyph = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M12 21V11M12 14C4 14.5 2.5 8 3.5 3c6.5 0 11 3.5 8.5 11Zm0-3C11.5 3.6 17 1.6 21.5 2c0 6-3 10-9.5 9Z"
      stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

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

  const lat = sites.length > 0 ? sites.reduce((a, s) => a + s.lat, 0) / sites.length : 42.361;
  const lng = sites.length > 0 ? sites.reduce((a, s) => a + s.lng, 0) / sites.length : -71.0655;

  const getDirections = (site: Site) => {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${site.lat},${site.lng}`, '_blank');
  };

  if (!mounted) {
    return (
      <div className="gw-page">
        <div className="gw-loading">Loading map…</div>
      </div>
    );
  }

  // Cities with no drop-off sites — explain the collection model instead.
  if (!sites.length) {
    return (
      <div className="gw-page">
        <div className="gw-hero">
          <div className="gw-eyebrow"><span /> DROP-OFF LOCATIONS</div>
          <h1>{region.programme}</h1>
          <LeafGlyph className="leaf-watermark" />
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
      <div className="gw-hero">
        <div className="gw-eyebrow"><span /> DROP-OFF LOCATIONS</div>
        <h1>Find a place to <em>close the loop.</em></h1>
        <p className="gw-sub">Pick your city to see nearby composting drop-off sites.</p>
        <LeafGlyph className="leaf-watermark" />
      </div>

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

      <div className="gw-maplayout" style={{ marginTop: 18 }}>
        {/* Map */}
        <div className="gw-mapframe">
          <div className="gw-mapbar">
            <LeafGlyph className="leaf" />
            {region.programme} · {region.name}
            <span className="count">{sites.length} sites</span>
          </div>
          <MapContainer
            center={[lat, lng]}
            zoom={13}
            style={{ height: '560px', width: '100%' }}
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
                icon={leafMarker(selectedSite?.id === site.id)}
                eventHandlers={{ click: () => setSelectedSite(site) }}
              >
                <Popup>
                  <div className="gw-pop">
                    <div className="pl">{site.label}</div>
                    <div className="ar">{site.area}</div>
                    {site.note && <div className="nt">{site.note}</div>}
                    <a href={`https://www.google.com/maps/dir/?api=1&destination=${site.lat},${site.lng}`} target="_blank" rel="noopener noreferrer">
                      Get directions ↗
                    </a>
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
                <span className="pin"><LeafGlyph /></span>
                <span className="body">
                  <span className="name">{site.label}</span>
                  <span className="area">{site.area}</span>
                </span>
              </button>
            ))}
          </div>
        </aside>
      </div>

      {/* Program info */}
      <div className="gw-card pad gw-about">
        <h3>About {region.programme}</h3>
        <div className="gw-aboutgrid">
          <div><div className="k">Summary</div><p>{region.summary}</p></div>
          <div><div className="k">Access</div><p>{region.access}</p></div>
          <div><div className="k">Processor</div><p>{region.processor}</p></div>
          <div><div className="k">Tip</div><p>{region.tip}</p></div>
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
