import React, { useState } from 'react';
import { UserProfile, ServiceRequest } from '../types/exchange';
import { LOCAL_ZONES } from '../data/mockData';
import { calculateDistanceKm } from '../utils/matchingEngine';
import { 
  MapPin, 
  Compass, 
  Navigation, 
  ShieldCheck, 
  Sliders 
} from 'lucide-react';

interface LocationRadarViewProps {
  currentUser: UserProfile;
  providers: UserProfile[];
  requests: ServiceRequest[];
  onSelectProvider: (provider: UserProfile) => void;
  onSelectZone: (zoneId: string) => void;
}

export const LocationRadarView: React.FC<LocationRadarViewProps> = ({
  currentUser,
  providers,
  requests,
  onSelectProvider,
}) => {
  const [selectedUserPin, setSelectedUserPin] = useState<UserProfile | null>(null);
  const [activeRadiusKm, setActiveRadiusKm] = useState<number>(5);

  const centerLat = currentUser.coordinates.lat;
  const centerLng = currentUser.coordinates.lng;

  return (
    <div className="space-y-6">
      {/* Header and Radius control */}
      <div className="bg-[#18181b] border border-zinc-800 rounded-[4px] p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">
            GEO_PROXIMITY_RADAR // CAMPUS_NODES
          </p>
          <h2 className="text-xl font-extrabold text-zinc-100 tracking-tight mt-0.5">
            Local Proximity Radar
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Current Anchor: <span className="text-zinc-200 font-mono font-semibold">{currentUser.locationName}</span>. Walking & biking peer radius.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-[11px]">
          <Sliders className="w-3 h-3 text-zinc-500" />
          <span className="text-zinc-500">RADAR_SWEEP:</span>
          <div className="flex items-center gap-1 bg-[#111113] p-0.5 border border-zinc-800 rounded-[2px]">
            {[1, 3, 5, 10].map((km) => (
              <button
                key={km}
                onClick={() => setActiveRadiusKm(km)}
                className={`px-2.5 py-0.5 font-mono text-[10px] font-bold rounded-[2px] transition-colors cursor-pointer uppercase ${
                  activeRadiusKm === km
                    ? 'bg-zinc-800 text-emerald-400 border border-emerald-500/40'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {km} KM
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Radar Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Radar Canvas (2 Cols) */}
        <div className="lg:col-span-2 bg-[#080809] rounded-[4px] p-6 relative min-h-[460px] flex items-center justify-center overflow-hidden border border-zinc-800 shadow-inner">
          {/* Subtle Radar Concentric Rings */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {/* Outer Ring 5km */}
            <div className="w-[380px] h-[380px] rounded-full border border-zinc-800/80 flex items-center justify-center">
              <span className="absolute top-2 text-[9px] font-mono text-zinc-600">5.0 KM</span>
              {/* Mid Ring 2.5km */}
              <div className="w-[260px] h-[260px] rounded-full border border-zinc-800 flex items-center justify-center">
                <span className="absolute top-16 text-[9px] font-mono text-zinc-600">2.5 KM</span>
                {/* Inner Ring 1km */}
                <div className="w-[140px] h-[140px] rounded-full border border-emerald-900/40 flex items-center justify-center">
                  <span className="absolute top-32 text-[9px] font-mono text-emerald-500/60">1.0 KM</span>
                </div>
              </div>
            </div>
          </div>

          {/* Radar Sweep Effect */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
            <div className="w-[380px] h-[380px] rounded-full border-t-2 border-r-2 border-emerald-500 animate-spin" style={{ animationDuration: '10s' }} />
          </div>

          {/* Crosshairs */}
          <div className="absolute inset-x-0 h-px bg-zinc-800 pointer-events-none" />
          <div className="absolute inset-y-0 w-px bg-zinc-800 pointer-events-none" />

          {/* Center Pin: Current User */}
          <div className="relative z-20 flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-emerald-500 text-black font-bold flex items-center justify-center shadow-lg ring-4 ring-emerald-500/20">
              <Navigation className="w-4 h-4 fill-current" />
            </div>
            <span className="mt-1 px-1.5 py-0.5 rounded-[2px] bg-zinc-900 text-white font-mono text-[9px] font-bold border border-zinc-800 whitespace-nowrap">
              YOU ({currentUser.name.split(' ')[0]})
            </span>
          </div>

          {/* Surrounding Provider Pins */}
          {providers
            .filter((p) => p.id !== currentUser.id)
            .map((p) => {
              const dist = calculateDistanceKm(currentUser.coordinates, p.coordinates);
              const dx = (p.coordinates.lng - centerLng) * 11000;
              const dy = (centerLat - p.coordinates.lat) * 11000;

              const isSelected = selectedUserPin?.id === p.id;
              const isWithinRadius = dist <= activeRadiusKm;

              return (
                <div
                  key={p.id}
                  style={{
                    transform: `translate(${dx}px, ${dy}px)`,
                    transition: 'all 0.4s ease',
                  }}
                  className={`absolute z-30 flex flex-col items-center transition-all ${
                    isWithinRadius ? 'opacity-100 scale-100' : 'opacity-20 scale-90'
                  }`}
                >
                  <button
                    onClick={() => setSelectedUserPin(p)}
                    className={`relative p-0.5 rounded-[2px] cursor-pointer transition-transform hover:scale-110 ${
                      isSelected
                        ? 'ring-2 ring-emerald-400 bg-white'
                        : 'bg-zinc-800 border border-zinc-700 hover:border-zinc-400'
                    }`}
                  >
                    <img
                      src={p.avatar}
                      alt={p.name}
                      className="w-7 h-7 rounded-[2px] object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </button>
                  <div
                    onClick={() => setSelectedUserPin(p)}
                    className="mt-1 px-1.5 py-0.2 rounded-[2px] bg-[#111113] text-zinc-300 font-mono text-[9px] border border-zinc-800 whitespace-nowrap cursor-pointer hover:text-white"
                  >
                    {p.name.split(' ')[0]} ({dist}KM)
                  </div>
                </div>
              );
            })}

          {/* Campus Zone Markers */}
          {LOCAL_ZONES.map((zone) => {
            const dx = (zone.coordinates.lng - centerLng) * 9000;
            const dy = (centerLat - zone.coordinates.lat) * 9000;

            return (
              <div
                key={zone.id}
                style={{
                  transform: `translate(${dx}px, ${dy}px)`,
                }}
                className="absolute z-10 pointer-events-none opacity-30 text-center"
              >
                <div className="w-1 h-1 rounded-full bg-zinc-500 mx-auto" />
                <span className="font-mono text-[8px] text-zinc-500 uppercase tracking-wider block mt-0.5 whitespace-nowrap">
                  {zone.name.split('·')[0]}
                </span>
              </div>
            );
          })}
        </div>

        {/* Selected Pin Details Panel */}
        <div className="bg-[#18181b] border border-zinc-800 rounded-[4px] p-5 flex flex-col justify-between">
          {selectedUserPin ? (
            <div className="space-y-4">
              <div className="flex items-start gap-3 pb-3 border-b border-zinc-800">
                <img
                  src={selectedUserPin.avatar}
                  alt={selectedUserPin.name}
                  className="w-12 h-12 rounded-[2px] object-cover border border-zinc-700"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-sm font-bold text-zinc-100">
                      {selectedUserPin.name}
                    </h3>
                    {selectedUserPin.isIdVerified && (
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    )}
                  </div>
                  <p className="font-mono text-[10px] text-zinc-500 uppercase">
                    {selectedUserPin.role}
                  </p>
                  <p className="font-mono text-[10px] text-emerald-400 font-bold mt-1">
                    {calculateDistanceKm(currentUser.coordinates, selectedUserPin.coordinates)} KM FROM CURRENT ANCHOR
                  </p>
                </div>
              </div>

              <div>
                <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest block mb-0.5">
                  CAMPUS_ZONE
                </span>
                <p className="text-xs text-zinc-300 font-medium">
                  {selectedUserPin.locationName}
                </p>
              </div>

              <div>
                <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest block mb-0.5">
                  OFFERED_SKILLS
                </span>
                <div className="space-y-1">
                  {selectedUserPin.skillsOffered.map((s) => (
                    <div
                      key={s.id}
                      className="flex items-center justify-between text-xs bg-[#111113] px-2 py-1 rounded-[2px] border border-zinc-800/80"
                    >
                      <span className="font-medium text-zinc-200">{s.name}</span>
                      <span className="font-mono text-[10px] text-zinc-500">{s.level}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest block mb-0.5">
                  SEEKING_EXCHANGE
                </span>
                <p className="text-xs text-zinc-400">
                  {selectedUserPin.skillsWanted.join(', ')}
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => onSelectProvider(selectedUserPin)}
                  className="w-full py-2 font-mono text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-black rounded-[2px] transition-colors cursor-pointer text-center uppercase tracking-wider"
                >
                  PROPOSE_EXCHANGE
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-4 space-y-2">
              <div className="w-8 h-8 rounded-full bg-[#111113] border border-zinc-800 flex items-center justify-center text-zinc-500">
                <MapPin className="w-4 h-4" />
              </div>
              <p className="font-mono text-xs font-bold text-zinc-300 uppercase">
                TARGET_NODE_UNSELECTED
              </p>
              <p className="text-xs text-zinc-500 max-w-xs leading-relaxed">
                Click any provider station on the radar canvas to inspect proximity distance and skills matrix.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
