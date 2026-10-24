'use client';

import { useState, useRef } from 'react';
import { REGIONS, type Site } from '@/lib/regions';

interface DropOffData {
  region: string;
  site?: Site;
  timestamp: number;
  photo?: string;
  location?: { lat: number; lng: number; accuracy: number };
  carefulSorting: boolean;
}

export default function DropOffLogger() {
  const [selectedRegion, setSelectedRegion] = useState('boston');
  const [step, setStep] = useState<'region' | 'site' | 'proof' | 'done'>('region');
  const [selectedSite, setSelectedSite] = useState<Site | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [useLocation, setUseLocation] = useState(true);
  const [carefulSorting, setCarefulSorting] = useState(true);
  const [dropOffs, setDropOffs] = useState<DropOffData[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const region = REGIONS[selectedRegion];
  const sites = region?.sites || [];

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPhoto(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleGetLocation = async (): Promise<{ lat: number; lng: number; accuracy: number } | undefined> => {
    if (!useLocation) return undefined;
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        });
      });
      return {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        accuracy: position.coords.accuracy,
      };
    } catch (error) {
      console.error('Location error:', error);
      return undefined;
    }
  };

  const handleSubmit = async () => {
    const location = await handleGetLocation();
    const newDropOff: DropOffData = {
      region: selectedRegion,
      site: selectedSite || undefined,
      timestamp: Date.now(),
      photo: photo || undefined,
      location,
      carefulSorting,
    };
    const saved = localStorage.getItem('dropoffs');
    const existing = saved ? JSON.parse(saved) : [];
    const updated = [newDropOff, ...existing];
    localStorage.setItem('dropoffs', JSON.stringify(updated));
    setDropOffs(updated);
    setStep('done');
  };

  const resetForm = () => {
    setStep('region');
    setSelectedSite(null);
    setPhoto(null);
    setCarefulSorting(true);
    setUseLocation(true);
  };

  const getProofLevel = (dropOff: DropOffData) => {
    if (dropOff.photo && dropOff.location && dropOff.location.accuracy < 50) return 'Photo + Location';
    if (dropOff.photo) return 'Photo';
    return 'Self-reported';
  };

  const getSeedsAwarded = (dropOff: DropOffData) => {
    let seeds = 5;
    if (dropOff.photo && dropOff.location && dropOff.location.accuracy < 50) seeds = 15;
    else if (dropOff.photo) seeds = 10;
    if (dropOff.carefulSorting) seeds += 5;
    return seeds;
  };

  // ── Step 1: choose city ──
  if (step === 'region') {
    return (
      <div className="gw-page">
        <div className="gw-flow">
          <div className="gw-head">
            <div className="gw-eyebrow"><span /> LOG A DROP-OFF</div>
            <h1>Give your scraps <em>another purpose.</em></h1>
            <p className="gw-sub">Select your city to get started.</p>
          </div>
          <div className="gw-optionlist">
            {Object.values(REGIONS).map((r) => (
              <button
                key={r.id}
                onClick={() => {
                  setSelectedRegion(r.id);
                  setStep(r.kind === 'drop' ? 'site' : 'proof');
                }}
                className="gw-option"
              >
                <div className="title">{r.name}</div>
                <div className="prog">{r.programme}</div>
                <div className="desc">{r.summary}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── Step 2: choose site ──
  if (step === 'site' && region.kind === 'drop') {
    return (
      <div className="gw-page">
        <div className="gw-flow">
          <button className="gw-back" onClick={() => setStep('region')}>← Back</button>
          <div className="gw-head">
            <h1>Where did you <em>drop off?</em></h1>
            <p className="gw-sub">{region.programme} · {region.name}</p>
          </div>
          <div className="gw-optionlist">
            {sites.map((site) => (
              <button
                key={site.id}
                onClick={() => {
                  setSelectedSite(site);
                  setStep('proof');
                }}
                className="gw-option"
              >
                <div className="title">{site.label}</div>
                <div className="prog">{site.area}</div>
                {site.note && <div className="desc">{site.note}</div>}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── Step 3: add proof ──
  if (step === 'proof') {
    return (
      <div className="gw-page">
        <div className="gw-flow">
          <button className="gw-back" onClick={() => setStep(region.kind === 'drop' ? 'site' : 'region')}>← Back</button>
          <div className="gw-head">
            <h1>Add <em>proof.</em></h1>
            <p className="gw-sub">{selectedSite ? `${selectedSite.label} · ${selectedSite.area}` : region.name}</p>
          </div>

          {/* Photo upload */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handlePhotoUpload}
            style={{ display: 'none' }}
          />
          <button className="gw-dropzone" onClick={() => fileInputRef.current?.click()}>
            {photo ? (
              <img src={photo} alt="Drop-off proof" />
            ) : (
              <div style={{ textAlign: 'center' }}>
                <div className="ph-emoji">📸</div>
                <div className="ph-text">Take a photo of your scraps going in</div>
              </div>
            )}
          </button>

          {/* Options */}
          <div className="gw-card pad gw-toggles">
            <div className="gw-togglerow">
              <div>
                <div className="t">Check my location</div>
                <div className="d">
                  Confirms you&apos;re within 75 m of {region.kind === 'drop' ? 'the bin' : 'home or your station'}. Read once, never tracked.
                </div>
              </div>
              <input type="checkbox" checked={useLocation} onChange={(e) => setUseLocation(e.target.checked)} aria-label="Check my location" />
            </div>
            <div className="gw-togglerow">
              <div>
                <div className="t">I kept out stickers, plastic and packaging</div>
              </div>
              <input type="checkbox" checked={carefulSorting} onChange={(e) => setCarefulSorting(e.target.checked)} aria-label="Careful sorting" />
            </div>
          </div>

          <div style={{ marginBottom: 18 }}>
            <span className="gw-aim">
              {photo && useLocation ? '🎯 Aiming for: Photo + Location' : photo ? '📷 Aiming for: Photo' : '📝 Self-reported'}
            </span>
          </div>

          <button className="gw-btn block" onClick={handleSubmit}>Log it</button>
        </div>
      </div>
    );
  }

  // ── Step 4: done ──
  if (step === 'done') {
    const lastDropOff = dropOffs[0];
    const proofLevel = lastDropOff ? getProofLevel(lastDropOff) : 'Self-reported';
    const seeds = lastDropOff ? getSeedsAwarded(lastDropOff) : 0;

    return (
      <div className="gw-page">
        <div className="gw-done">
          <div className="banana">🍌</div>
          <p className="seeds">+{seeds}</p>
          <p className="proof">Logged · {proofLevel}</p>
          <p className="copy">Seeds reward proof and consistency, never how much you throw away.</p>

          <div className="gw-recent">
            <h3>Your recent drop-offs</h3>
            {dropOffs.slice(0, 5).map((dropOff, idx) => (
              <div key={idx} className="gw-recentitem">
                <div className="top">
                  <div>
                    <div className="city">{REGIONS[dropOff.region].name}</div>
                    <div className="site">{dropOff.site ? dropOff.site.label : REGIONS[dropOff.region].programme}</div>
                  </div>
                  <div>
                    <div className="sd">+{getSeedsAwarded(dropOff)}</div>
                    <div className="pl">{getProofLevel(dropOff)}</div>
                  </div>
                </div>
                <div className="when">
                  {new Date(dropOff.timestamp).toLocaleDateString()} at {new Date(dropOff.timestamp).toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>

          <button className="gw-btn block" onClick={resetForm}>Log another drop-off</button>
        </div>
      </div>
    );
  }

  return null;
}
