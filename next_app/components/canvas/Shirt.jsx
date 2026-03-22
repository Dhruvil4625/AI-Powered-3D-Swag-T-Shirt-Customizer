"use client";
import React, { useRef } from 'react';
import { easing } from 'maath';
import { useSnapshot } from 'valtio';
import { useFrame } from '@react-three/fiber';
import { Decal, useGLTF, useTexture } from '@react-three/drei';

import state from '@/store';

const Shirt = () => {
  const materialRef = useRef();
  const snap = useSnapshot(state);
  const { nodes, materials } = useGLTF('/shirt_baked.glb');

  const logoTexture = useTexture(snap.logoDecal);
  const backLogoTexture = useTexture(snap.backLogoDecal);
  const fullTexture = useTexture(snap.fullDecal);
  
  // Premium Texture Rendering (Fixes blurriness at angles)
  logoTexture.anisotropy = 16;
  backLogoTexture.anisotropy = 16;
  fullTexture.anisotropy = 16;

  useFrame((state, delta) => {
    if (materialRef.current) {
      easing.dampC(materialRef.current.color, snap.color, 0.25, delta)
    }
  });

  return (
    <group>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.T_Shirt_male.geometry}
        dispose={null}
      >
        <meshStandardMaterial 
          ref={materialRef}
          roughness={snap.roughness || 0.8} // Default values fallback
          metalness={snap.metalness || 0.1}
          envMapIntensity={0.8} // Allows the <Environment> to reflect beautifully
        />
        
        {snap.isFullTexture && (
          <Decal 
            position={[0, 0, 0]}
            rotation={[0, 0, 0]}
            scale={1}
            map={fullTexture}
          />
        )}

        {snap.isLogoTexture && (
          <Decal 
            position={[snap.logoX || 0, snap.logoY || 0.04, 0.15]}
            rotation={[0, 0, 0]}
            scale={snap.logoScale || 0.15}
            map={logoTexture}
            depthTest={true} // Set to true to fix clipping issues with lighting
            depthWrite={false}
          />
        )}
        
        {/* Back side of the shirt */}
        {snap.isBackLogoTexture && (
          <Decal 
            position={[snap.backLogoX || 0, snap.backLogoY || 0.04, -0.15]}
            rotation={[0, Math.PI, 0]} // Rotate 180 degrees to face the back
            scale={snap.backLogoScale || 0.15}
            map={backLogoTexture}
            depthTest={true} 
            depthWrite={false}
          />
        )}
      </mesh>
    </group>
  )
}

useGLTF.preload('/shirt_baked.glb');

export default Shirt

