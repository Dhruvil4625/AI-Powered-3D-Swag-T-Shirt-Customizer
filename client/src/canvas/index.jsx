import { Canvas } from '@react-three/fiber';
import { Center, PresentationControls, Environment } from '@react-three/drei';
import { Suspense } from 'react';

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
      <ambientLight intensity={0.5} />
      {/* Studio Lighting Setup */}
      <spotLight position={[0, 15, 10]} angle={0.15} penumbra={1} intensity={1} castShadow shadow-mapSize={1024} />
      <directionalLight position={[-10, 5, -5]} intensity={0.5} color="#ffffff" />
      
      {/* Premium Studio Reflections */}
      <Environment preset="city" />

      <CameraRig>
        <Backdrop />
        <Center>
          <PresentationControls 
            global={true}
            cursor={true}
            snap={false} // Allow the model to stay where dragged instead of snapping back to center
            speed={2}
            zoom={1}
            polar={[-Math.PI / 2, Math.PI / 2]} // Allow full tilt limits
            azimuth={[-Infinity, Infinity]} // INFINITE 360-degree rotation spin
          >
            <Suspense fallback={null}>
              <Shirt />
            </Suspense>
          </PresentationControls>
        </Center>
      </CameraRig>
    </Canvas>
  )
}

export default CanvasModel;