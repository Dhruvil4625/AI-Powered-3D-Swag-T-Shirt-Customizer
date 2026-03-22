"use client";
import { Canvas } from '@react-three/fiber'
import { Center, PresentationControls } from '@react-three/drei';
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
      gl={{ preserveDrawingBuffer: true }}
      className="w-full max-w-full h-full transition-all ease-in"
      onCreated={({ scene }) => { window.appScene = scene }}
    >
      <XR referenceSpace="local-floor">
        <ARButton className="absolute z-20 top-5 left-5 px-3 py-2 rounded-md bg-black/80 text-white text-sm" />

        <ambientLight intensity={1.5} />
        <directionalLight position={[0, 0, 10]} intensity={2} />

        <CameraRig>
          <Backdrop />
          <Center>
            <PresentationControls 
              global={true}
              cursor={true}
              snap={false}
              speed={2}
              zoom={1}
              polar={[-Math.PI / 2, Math.PI / 2]}
              azimuth={[-Infinity, Infinity]}
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

export default CanvasModel

