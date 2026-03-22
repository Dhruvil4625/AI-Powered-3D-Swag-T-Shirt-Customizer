"use client";
import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useSnapshot } from 'valtio';

import state from '@/store';
import { downloadCanvasToImage, reader, captureCanvasImage, downloadCanvasToPDF } from '@/config/helpers';
import { EditorTabs, FilterTabs, DecalTypes } from '@/config/constants';
import { fadeAnimation, slideAnimation } from '@/config/motion';
import { AIPicker, ColorPicker, CustomButton, FilePicker, Tab, TuningPicker, FabricEditor } from '@/components';

const Customizer = () => {
  const snap = useSnapshot(state);
  const [file, setFile] = useState('');
  const [prompt, setPrompt] = useState('');
  const [generatingImg, setGeneratingImg] = useState(false);
  const [generatingMockup, setGeneratingMockup] = useState(false);
  const [activeEditorTab, setActiveEditorTab] = useState("");
  const [activeFilterTab, setActiveFilterTab] = useState({
    logoShirt: true,
    stylishShirt: false,
  });

  const generateTabContent = () => {
    switch (activeEditorTab) {
      case "colorpicker": return <ColorPicker />;
      case "tuningpicker": return <TuningPicker />;
      case "fabriceditor":
        return (
          <FabricEditor
            onApplyLogo={(dataUrl) => { handleDecals('logo', dataUrl); setActiveEditorTab(""); }}
            onApplyFull={(dataUrl) => { handleDecals('full', dataUrl); setActiveEditorTab(""); }}
          />
        );
      case "filepicker": return <FilePicker file={file} setFile={setFile} readFile={readFile} />;
      case "aipicker": return <AIPicker prompt={prompt} setPrompt={setPrompt} generatingImg={generatingImg} handleSubmit={handleSubmit} />;
      default: return null;
    }
  }

  const handleSubmit = async (type) => {
    if(!prompt) return alert("Please enter a prompt");
    try {
      setGeneratingImg(true);
      const isEnhance = type === 'enhance';
      const endpoint = isEnhance ? '/api/v1/dalle/enhance' : '/api/v1/dalle';
      const body = isEnhance ? { prompt, image: state.logoDecal } : { prompt };
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to generate image.');

      handleDecals(isEnhance ? 'logo' : type, `data:image/png;base64,${data.photo}`);
    } catch (error) {
      alert(error.message);
    } finally {
      setGeneratingImg(false);
      setActiveEditorTab("");
    }
  }

  const handleDecals = (type, result) => {
    const decalType = DecalTypes[type];
    state[decalType.stateProperty] = result;
    if(!activeFilterTab[decalType.filterTab]) handleActiveFilterTab(decalType.filterTab);
  }

  const handleActiveFilterTab = (tabName) => {
    switch (tabName) {
      case "logoShirt": state.isLogoTexture = !activeFilterTab[tabName]; break;
      case "stylishShirt": state.isFullTexture = !activeFilterTab[tabName]; break;
      default: state.isLogoTexture = true; state.isFullTexture = false; break;
    }
    setActiveFilterTab((prevState) => ({ ...prevState, [tabName]: !prevState[tabName] }));
  }

  const readFile = (type) => {
    reader(file).then((result) => {
      handleDecals(type, result);
      setActiveEditorTab("");
    });
  }

  const handleDownloadModel = async () => {
    if (!window.appScene) return alert("3D Scene not ready yet!");
    const { GLTFExporter } = await import('three/examples/jsm/exporters/GLTFExporter.js');
    const exporter = new GLTFExporter();
    
    exporter.parse(window.appScene, (gltf) => {
      const blob = new Blob([gltf], { type: 'application/octet-stream' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url; link.download = "custom_shirt.glb";
      document.body.appendChild(link); link.click(); document.body.removeChild(link); URL.revokeObjectURL(url);
    }, (error) => {
      console.error("Export Error:", error); alert("Failed to export 3D model.");
    }, { binary: true });
  }

  const handleGenerateMockup = async () => {
    try {
      const png = captureCanvasImage();
      if (!png) return alert('Canvas not ready');
      
      setGeneratingMockup(true);
      const res = await fetch('/api/v1/printful/mockup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: png }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to generate mockup');
      if (data.mockupUrl) window.open(data.mockupUrl, '_blank');
    } catch (e) {
      alert(e.message);
    } finally {
      setGeneratingMockup(false);
    }
  }

  return (
    <AnimatePresence>
      {!snap.intro && (
        <>
          <motion.div key="custom" className="absolute top-0 left-0 z-10" {...slideAnimation('left')}>
            <div className="flex items-center min-h-screen">
              <div className="editortabs-container tabs">
                {EditorTabs.map((tab) => (
                  <Tab key={tab.name} tab={tab} handleClick={() => setActiveEditorTab(tab.name)} />
                ))}
                {generateTabContent()}
              </div>
            </div>
          </motion.div>

          {/* Premium Glassmorphism Top-Right Toolbar */}
          <motion.div className="absolute z-10 top-5 right-5 flex gap-3 glassmorphism px-4 py-3 rounded-2xl" {...fadeAnimation}>
            <CustomButton 
              type="outline"
              title={generatingMockup ? "Creating..." : "Mockup"}
              handleClick={generatingMockup ? undefined : handleGenerateMockup}
              customStyles="font-semibold text-sm rounded-lg"
            />
            <CustomButton 
              type="outline"
              title="Export PDF"
              handleClick={downloadCanvasToPDF}
              customStyles="font-semibold text-sm rounded-lg"
            />
            <CustomButton 
              type="outline"
              title="Export .GLB"
              handleClick={handleDownloadModel}
              customStyles="font-semibold text-sm rounded-lg"
            />
            <CustomButton 
              type="filled"
              title="Go Back"
              handleClick={() => state.intro = true}
              customStyles="font-bold text-sm rounded-lg shadow-md"
            />
          </motion.div>

          <motion.div className='filtertabs-container' {...slideAnimation("up")}>
            {FilterTabs.map((tab) => (
              <Tab
                key={tab.name}
                tab={tab}
                isFilterTab
                isActiveTab={activeFilterTab[tab.name]}
                handleClick={() => { tab.name === "download" ? downloadCanvasToImage() : handleActiveFilterTab(tab.name) }}
              />
            ))}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default Customizer;
