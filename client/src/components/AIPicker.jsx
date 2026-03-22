import React from 'react'
import { useSnapshot } from 'valtio';
import state from '../store';

import CustomButton from './CustomButton';

const AIPicker = ({ prompt, setPrompt, generatingImg, handleSubmit }) => {
  const snap = useSnapshot(state);
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
            {snap.logoDecal !== './threejs.png' && (
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
    </div>
  )
}

export default AIPicker