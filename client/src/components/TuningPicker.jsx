import React from 'react';
import { useSnapshot } from 'valtio';
import state from '../store';

const TuningPicker = () => {
    const snap = useSnapshot(state);

    return (
        <div className="aipicker-container">
            <div className="flex flex-col gap-4">
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
            </div>
        </div>
    )
}

export default TuningPicker;
