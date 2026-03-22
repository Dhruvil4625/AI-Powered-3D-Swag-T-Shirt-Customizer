"use client";
import React, { useEffect, useRef } from 'react';
import { fabric } from 'fabric';
import { reader } from '@/config/helpers';

const FabricEditor = ({ onApplyLogo, onApplyFull }) => {
  const canvasRef = useRef(null);
  const fabricRef = useRef(null);

  useEffect(() => {
    const canvasEl = canvasRef.current;
    const f = new fabric.Canvas(canvasEl, {
      width: 180,
      height: 180,
      backgroundColor: 'white',
      selection: true,
    });
    fabricRef.current = f;

    const text = new fabric.Textbox('Your Text', {
      left: 20,
      top: 20,
      fontSize: 18,
      fill: '#000',
      editable: true,
    });
    f.add(text).setActiveObject(text);
    return () => f.dispose();
  }, []);

  const addImage = async (file) => {
    if (!file) return;
    const url = await new Promise((resolve) => {
      const fr = new FileReader();
      fr.onload = () => resolve(fr.result);
      fr.readAsDataURL(file);
    });
    fabric.Image.fromURL(url, (img) => {
      img.scaleToWidth(120);
      img.set({ left: 30, top: 30 });
      fabricRef.current.add(img);
      fabricRef.current.renderAll();
    });
  };

  const applyLogo = () => {
    const dataUrl = fabricRef.current.toDataURL({ format: 'png' });
    onApplyLogo?.(dataUrl);
  };
  const applyFull = () => {
    const dataUrl = fabricRef.current.toDataURL({ format: 'png' });
    onApplyFull?.(dataUrl);
  };

  return (
    <div className="aipicker-container">
      <canvas ref={canvasRef} className="border border-gray-300 rounded" />
      <div className="mt-2 flex gap-2">
        <label className="filepicker-label">
          Add Image
          <input
            type="file"
            accept="image/*"
            onChange={(e) => addImage(e.target.files?.[0])}
            style={{ display: 'none' }}
          />
        </label>
        <button onClick={applyLogo} className="text-xs border px-2 py-1 rounded">
          Apply as Logo
        </button>
        <button onClick={applyFull} className="text-xs border px-2 py-1 rounded">
          Apply as Full
        </button>
      </div>
    </div>
  );
};

export default FabricEditor;
