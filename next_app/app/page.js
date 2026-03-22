"use client";

import Canvas from '@/components/canvas';
import Customizer from '@/components/pages/Customizer';
import Home from '@/components/pages/Home';

export default function Page() {
  return (
    <main className="app transition-all ease-in">
      <Home />
      <Canvas />
      <Customizer />
    </main>
  )
}
