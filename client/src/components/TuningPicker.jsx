import React from 'react';
import { useSnapshot } from 'valtio';
import state from '../store';

const TuningPicker = () => {
    const snap = useSnapshot(state);

    return (
        <div className="aipicker-container">
            <div className="flex flex-col gap-4 max-h-[250px] overflow-y-auto pr-2">
                <label className="text-xs font-bold text-gray-700">Roughness
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={snap.roughness}
                        onChange={(e) => state.roughness = parseFloat(e.target.value)}
                        className="w-full mt-1 cursor-pointer"
                    />
                </label>

                <label className="text-xs font-bold text-gray-700">Metalness
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={snap.metalness}
                        onChange={(e) => state.metalness = parseFloat(e.target.value)}
                        className="w-full mt-1 cursor-pointer"
                    />
                </label>

                <hr className="border-gray-300 my-2" />

                <label className="text-xs font-bold text-gray-700">Logo Scale
                    <input
                        type="range"
                        min="0.05"
                        max="0.5"
                        step="0.01"
                        value={snap.logoScale}
                        onChange={(e) => state.logoScale = parseFloat(e.target.value)}
                        className="w-full mt-1 cursor-pointer"
                    />
                </label>

                <label className="text-xs font-bold text-gray-700">Logo X Position
                    <input
                        type="range"
                        min="-0.2"
                        max="0.2"
                        step="0.01"
                        value={snap.logoX}
                        onChange={(e) => state.logoX = parseFloat(e.target.value)}
                        className="w-full mt-1 cursor-pointer"
                    />
                </label>

                <label className="text-xs font-bold text-gray-700">Logo Y Position
                    <input
                        type="range"
                        min="-0.2"
                        max="0.2"
                        step="0.01"
                        value={snap.logoY}
                        onChange={(e) => state.logoY = parseFloat(e.target.value)}
                        className="w-full mt-1 cursor-pointer"
                    />
                </label>
            </div>
        </div>
    )
}

export default TuningPicker;
