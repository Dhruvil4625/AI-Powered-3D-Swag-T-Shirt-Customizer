import React from 'react';
import { useSnapshot } from 'valtio';
import state from '../store';

const TuningPicker = () => {
  const snap = useSnapshot(state);

  return (
    <div className="absolute left-full ml-3 glassmorphism p-3 w-[250px] rounded-md flex flex-col gap-3">
        <div className="flex gap-2">
            <div className="flex-1">
                <label className="text-[11px] font-bold text-gray-700">Roughness
                <input type="range" min="0" max="1" step="0.01" value={snap.roughness} onChange={(e) => state.roughness = parseFloat(e.target.value)} className="w-full mt-1 cursor-pointer" />
                </label>
            </div>
            <div className="flex-1">
                <label className="text-[11px] font-bold text-gray-700">Metalness
                <input type="range" min="0" max="1" step="0.01" value={snap.metalness} onChange={(e) => state.metalness = parseFloat(e.target.value)} className="w-full mt-1 cursor-pointer" />
                </label>
            </div>
        </div>

        <hr className="border-gray-400 opacity-50" />

        <label className="text-[11px] font-bold text-gray-700">Logo Scale
        <input type="range" min="0.05" max="0.3" step="0.01" value={snap.logoScale} onChange={(e) => state.logoScale = parseFloat(e.target.value)} className="w-full mt-1 cursor-pointer" />
        </label>

        <div className="flex gap-2">
            <div className="flex-1">
                <label className="text-[11px] font-bold text-gray-700">Logo X
                <input type="range" min="-0.2" max="0.2" step="0.01" value={snap.logoX} onChange={(e) => state.logoX = parseFloat(e.target.value)} className="w-full mt-1 cursor-pointer" />
                </label>
            </div>
            <div className="flex-1">
                <label className="text-[11px] font-bold text-gray-700">Logo Y
                <input type="range" min="-0.2" max="0.2" step="0.01" value={snap.logoY} onChange={(e) => state.logoY = parseFloat(e.target.value)} className="w-full mt-1 cursor-pointer" />
                </label>
            </div>
        </div>
    </div>
  )
}

export default TuningPicker;
