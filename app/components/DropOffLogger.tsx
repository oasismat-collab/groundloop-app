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
      reader.onloadend = () => {
        setPhoto(reader.result as string);
      };
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
          maximumAge: 0
        });
      });
      
      return {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        accuracy: position.coords.accuracy
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
      carefulSorting
    };

    // Save to localStorage
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
    if (dropOff.photo && dropOff.location && dropOff.location.accuracy < 50) {
      return 'Photo + Location';
    } else if (dropOff.photo) {
      return 'Photo';
    }
    return 'Self-reported';
  };

  const getSeedsAwarded = (dropOff: DropOffData) => {
    let seeds = 0;
    if (dropOff.photo && dropOff.location && dropOff.location.accuracy < 50) {
      seeds = 15;
    } else if (dropOff.photo) {
      seeds = 10;
    } else {
      seeds = 5;
    }
    if (dropOff.carefulSorting) seeds += 5;
    return seeds;
  };

  if (step === 'region') {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <h2 className="text-3xl font-bold mb-4">Log a Drop-Off</h2>
        <p className="text-gray-600 mb-6">Select your city to get started</p>
        
        <div className="space-y-3">
          {Object.values(REGIONS).map((r) => (
            <button
              key={r.id}
              onClick={() => {
                setSelectedRegion(r.id);
                setStep(r.kind === 'drop' ? 'site' : 'proof');
              }}
              className="w-full text-left p-4 border-2 border-gray-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition-colors"
            >
              <div className="font-bold text-lg">{r.name}</div>
              <div className="text-sm text-gray-600">{r.programme}</div>
              <div className="text-sm text-gray-500 mt-1">{r.summary}</div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (step === 'site' && region.kind === 'drop') {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <button onClick={() => setStep('region')} className="text-green-600 mb-4">← Back</button>
        <h2 className="text-3xl font-bold mb-4">Where did you drop off?</h2>
        <p className="text-gray-600 mb-2">{region.programme} · {region.name}</p>
        
        <div className="space-y-3 mt-6">
          {sites.map((site) => (
            <button
              key={site.id}
              onClick={() => {
                setSelectedSite(site);
                setStep('proof');
              }}
              className="w-full text-left p-4 border-2 border-gray-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition-colors"
            >
              <div className="font-bold">{site.label}</div>
              <div className="text-sm text-gray-600">{site.area}</div>
              {site.note && <div className="text-sm text-gray-500 mt-1">{site.note}</div>}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (step === 'proof') {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <button onClick={() => setStep(region.kind === 'drop' ? 'site' : 'region')} className="text-green-600 mb-4">← Back</button>
        <h2 className="text-3xl font-bold mb-4">Add proof</h2>
        <p className="text-gray-600 mb-6">
          {selectedSite ? `${selectedSite.label} · ${selectedSite.area}` : region.name}
        </p>

        {/* Photo upload */}
        <div className="mb-6">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handlePhotoUpload}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full border-2 border-dashed border-gray-300 rounded-xl p-8 hover:border-green-500 hover:bg-green-50 transition-colors"
          >
            {photo ? (
              <img src={photo} alt="Drop-off proof" className="w-full h-48 object-cover rounded-lg" />
            ) : (
              <div className="text-center">
                <div className="text-4xl mb-2">📸</div>
                <div className="font-bold">Take a photo of your scraps going in</div>
              </div>
            )}
          </button>
        </div>

        {/* Options */}
        <div className="bg-white border-2 border-gray-200 rounded-xl p-4 space-y-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="font-bold">Check my location</div>
              <div className="text-sm text-gray-600">
                Confirms you're within 75 m of {region.kind === 'drop' ? 'the bin' : 'home or your station'}. Read once, never tracked.
              </div>
            </div>
            <input
              type="checkbox"
              checked={useLocation}
              onChange={(e) => setUseLocation(e.target.checked)}
              className="ml-4 w-6 h-6 accent-green-600"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="font-bold">I kept out stickers, plastic and packaging</div>
            </div>
            <input
              type="checkbox"
              checked={carefulSorting}
              onChange={(e) => setCarefulSorting(e.target.checked)}
              className="ml-4 w-6 h-6 accent-green-600"
            />
          </div>
        </div>

        <div className="text-sm text-gray-600 mb-4">
          {photo && useLocation ? '🎯 Aiming for: Photo + Location' : photo ? '📷 Aiming for: Photo' : '📝 Self-reported'}
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-green-600 text-white font-bold py-4 rounded-xl hover:bg-green-700 transition-colors"
        >
          Log it
        </button>
      </div>
    );
  }

  if (step === 'done') {
    const lastDropOff = dropOffs[0];
    const proofLevel = lastDropOff ? getProofLevel(lastDropOff) : 'Self-reported';
    const seeds = lastDropOff ? getSeedsAwarded(lastDropOff) : 0;

    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <div className="text-8xl mb-4">🍌</div>
        <div className="text-5xl font-bold text-green-600 mb-2">+{seeds}</div>
        <h2 className="text-2xl font-bold mb-2">Logged · {proofLevel}</h2>
        <p className="text-gray-600 mb-8">
          Seeds reward proof and consistency, never how much you throw away.
        </p>

        {/* Recent drop-offs */}
        <div className="mb-8">
          <h3 className="text-xl font-bold mb-4 text-left">Your Recent Drop-Offs</h3>
          <div className="space-y-3">
            {dropOffs.slice(0, 5).map((dropOff, idx) => (
              <div key={idx} className="border-2 border-gray-200 rounded-xl p-4 text-left">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-bold">{REGIONS[dropOff.region].name}</div>
                    <div className="text-sm text-gray-600">
                      {dropOff.site ? `${dropOff.site.label}` : REGIONS[dropOff.region].programme}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-green-600">+{getSeedsAwarded(dropOff)}</div>
                    <div className="text-xs text-gray-500">{getProofLevel(dropOff)}</div>
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  {new Date(dropOff.timestamp).toLocaleDateString()} at {new Date(dropOff.timestamp).toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={resetForm}
          className="w-full bg-green-600 text-white font-bold py-4 rounded-xl hover:bg-green-700 transition-colors"
        >
          Log another drop-off
        </button>
      </div>
    );
  }

  return null;
}
