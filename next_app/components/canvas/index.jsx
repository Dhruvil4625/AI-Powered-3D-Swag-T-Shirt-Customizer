"use client";
import { Canvas } from '@react-three/fiber';
import { Center, PresentationControls, Environment, AdaptiveDpr, AdaptiveEvents } from '@react-three/drei';
import { Suspense } from 'react';
import { XR, ARButton, useXR } from '@react-three/xr';

import Shirt from './Shirt';
import Backdrop from './Backdrop';
import CameraRig from './CameraRig';

const CanvasModel = () => {
  return (
    <Canvas
      shadows
      camera={{ position: [0, 0, 0], fov: 25 }}
      gl={{ preserveDrawingBuffer: true, antialias: true }} // Added antialias for smoother edges
      className="w-full max-w-full h-full transition-all ease-in"
      onCreated={({ scene }) => { window.appScene = scene }}
    >
      <XR referenceSpace="local-floor">
        <ARButton className="absolute z-20 top-5 left-5 px-3 py-2 rounded-md bg-black/80 text-white text-sm" />

        <ambientLight intensity={0.6} />
        {/* Studio Lighting Setup */}
        <spotLight position={[0, 15, 10]} angle={0.2} penumbra={1} intensity={1.2} castShadow shadow-mapSize={1024} />
        <directionalLight position={[-10, 5, -5]} intensity={0.6} color="#ffffff" />
        
        {/* Premium Studio Reflections */}
        <Environment preset="city" />
        <AdaptiveDpr pixelated />
        <AdaptiveEvents />

        <CameraRig>
          <Backdrop />
          <Center>
            <PresentationControls 
              global={true}
              cursor={true}
              snap={false} // Allow the model to stay where dragged
              speed={2}
              zoom={1}
              polar={[-Math.PI / 2, Math.PI / 2]} // Allow full vertical tilt
              azimuth={[-Infinity, Infinity]} // INFINITE 360-degree rotation spin
            >
              <Suspense fallback={null}>
                <Shirt />
              </Suspense>
            </PresentationControls>
          </Center>
        </CameraRig>
      </XR>
    </Canvas>
  )
}

export default CanvasModel;
