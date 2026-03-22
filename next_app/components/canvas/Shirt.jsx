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
  const modelPath = state.models[snap.product] || state.models.tshirt;
  const gltf = useGLTF(modelPath);
  const nodes = gltf.nodes;

  const logoTexture = useTexture(snap.logoDecal);
  const backLogoTexture = useTexture(snap.backLogoDecal);
  const fullTexture = useTexture(snap.fullDecal);

  useFrame((state, delta) => {
    if (materialRef.current) {
      easing.dampC(materialRef.current.color, snap.color, 0.25, delta);
    }
  });

  return (
    <group>
      <mesh
        castShadow
        receiveShadow
        geometry={(Object.values(nodes).find((n) => n?.geometry) || {}).geometry || nodes?.T_Shirt_male?.geometry}
        dispose={null}
      >
        <meshStandardMaterial
          ref={materialRef}
          roughness={snap.roughness || 0.8}
          metalness={snap.metalness || 0.1}
          envMapIntensity={0.8}
        />

        {snap.isFullTexture && (
          <Decal position={[0, 0, 0]} rotation={[0, 0, 0]} scale={1} map={fullTexture} />
        )}

        {snap.isLogoTexture && (
          <Decal
            position={[snap.logoX || 0, snap.logoY || 0.04, 0.15]}
            rotation={[0, 0, 0]}
            scale={snap.logoScale || 0.15}
            map={logoTexture}
            depthTest
            depthWrite={false}
          />
        )}

        {snap.isBackLogoTexture && (
          <Decal
            position={[snap.backLogoX || 0, snap.backLogoY || 0.04, -0.15]}
            rotation={[0, Math.PI, 0]}
            scale={snap.backLogoScale || 0.15}
            map={backLogoTexture}
            depthTest
            depthWrite={false}
          />
        )}
      </mesh>
    </group>
  );
};

useGLTF.preload('/shirt_baked.glb');
useGLTF.preload('/hoodie.glb');
useGLTF.preload('/cap.glb');
useGLTF.preload('/women_top.glb');

export default Shirt;

