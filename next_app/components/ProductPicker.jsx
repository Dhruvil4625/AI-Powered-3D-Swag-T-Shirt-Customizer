"use client";
import React from 'react';
import { useSnapshot } from 'valtio';
import state from '@/store';

const options = [
  { key: 'tshirt', label: 'Men T‑Shirt' },
  { key: 'women_top', label: 'Women Top' },
  { key: 'hoodie', label: 'Hoodie' },
  { key: 'cap', label: 'Cap' },
];

const ProductPicker = () => {
  const snap = useSnapshot(state);
  return (
    <div className="aipicker-container">
      <div className="flex flex-col gap-2">
        {options.map((o) => (
          <button
            key={o.key}
            onClick={() => (state.product = o.key)}
            className={`text-xs px-3 py-2 rounded border ${
              snap.product === o.key ? 'bg-foreground text-background' : 'bg-background'
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductPicker;
