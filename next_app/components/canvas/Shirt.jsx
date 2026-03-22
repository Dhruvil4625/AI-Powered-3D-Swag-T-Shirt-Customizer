"use client";
import React, { useRef } from 'react'
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
  const fullTexture = useTexture(snap.fullDecal);

  useFrame((state, delta) => {
    if (materialRef.current) {
      easing.dampC(materialRef.current.color, snap.color, 0.25, delta)
    }
  });

  const stateString = JSON.stringify(snap);

  return (
    <group>
      <mesh
        castShadow
        geometry={nodes.T_Shirt_male.geometry}
        dispose={null}
      >
        <meshStandardMaterial 
          ref={materialRef}
          roughness={snap.roughness}
          metalness={snap.metalness}
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
            position={[snap.logoX, snap.logoY, 0.15]}
            rotation={[0, 0, 0]}
            scale={snap.logoScale}
            map={logoTexture}
            depthTest={false}
            depthWrite={true}
          />
        )}
      </mesh>
    </group>
  )
}

useGLTF.preload('/shirt_baked.glb');

export default Shirt

