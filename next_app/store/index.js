"use client";
import { proxy } from 'valtio';

const state = proxy({
  intro: true,
  color: '#EFBD48',
  isLogoTexture: true,
  isFullTexture: false,
  isBackLogoTexture: true,
  logoDecal: '/threejs.png',
  fullDecal: '/threejs.png',
  backLogoDecal: '/threejs.png',
  roughness: 1,
  metalness: 0,
  logoX: 0,
  logoY: 0.04,
  logoScale: 0.15,
  backLogoX: 0,
  backLogoY: 0.04,
  backLogoScale: 0.15,
});

export default state;
