"use client";
import React, { useState } from 'react'
import { useSnapshot } from 'valtio';
import state from '@/store';

import CustomButton from './CustomButton';

const AIPicker = ({ prompt, setPrompt, generatingImg, handleSubmit }) => {
  const snap = useSnapshot(state);
  const [suggesting, setSuggesting] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  const handleSuggest = async () => {
    try {
      setSuggesting(true);
      const res = await fetch('/api/v1/ai/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to get suggestions');
      setSuggestions(data.suggestions || []);
      if (data.suggestions?.[0]) setPrompt(data.suggestions[0]);
    } catch (e) {
      alert(e);
    } finally {
      setSuggesting(false);
    }
  }
  return (
    <div className="aipicker-container">
      <textarea 
        placeholder="Ask AI..."
        rows={5}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="aipicker-textarea"
      />
      <div className="flex flex-wrap gap-3">
        {generatingImg ? (
          <CustomButton 
            type="outline"
            title="Asking AI..."
            customStyles="text-xs"
          />
        ) : (
          <>
            <CustomButton 
              type="outline"
              title={suggesting ? "Suggesting..." : "Suggest"}
              handleClick={suggesting ? undefined : handleSuggest}
              customStyles="text-xs"
            />
            <CustomButton 
              type="outline"
              title="AI Logo"
              handleClick={() => handleSubmit('logo')}
              customStyles="text-xs"
            />

            <CustomButton 
              type="filled"
              title="AI Full"
              handleClick={() => handleSubmit('full')}
              customStyles="text-xs"
            />
            {snap.logoDecal !== '/threejs.png' && (
              <CustomButton 
                type="filled"
                title="Enhance Logo"
                handleClick={() => handleSubmit('enhance')}
                customStyles="text-xs border border-green-500 text-green-500 bg-green-50"
              />
            )}
          </>
        )}
      </div>
      {suggestions.length > 0 && (
        <div className="mt-2 grid gap-1">
          {suggestions.map((s, i) => (
            <button
              key={i}
              onClick={() => setPrompt(s)}
              className="text-left text-xs underline decoration-dotted hover:opacity-80"
            >
              {i + 1}. {s}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default AIPicker

