
import React, { useState, useCallback } from 'react';
import { AppStatus, ProSettings } from './types';
import { OUTFIT_OPTIONS, BACKGROUND_OPTIONS, LIGHTING_OPTIONS } from './constants';
import { generateProfessionalPhoto } from './services/geminiService';
import CameraModule from './components/CameraModule';
import SettingsGrid from './components/SettingsGrid';

const App: React.FC = () => {
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const [settings, setSettings] = useState<ProSettings>({
    outfit: OUTFIT_OPTIONS[0].id,
    background: BACKGROUND_OPTIONS[0].id,
    lighting: LIGHTING_OPTIONS[0].id,
    expression: 'professional'
  });

  const handleCapture = (base64: string) => {
    setSourceImage(base64);
    setStatus(AppStatus.IDLE);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSourceImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const startGeneration = async () => {
    if (!sourceImage) return;

    setStatus(AppStatus.GENERATING);
    setErrorMsg(null);

    try {
      const outfit = OUTFIT_OPTIONS.find(o => o.id === settings.outfit)?.prompt || '';
      const background = BACKGROUND_OPTIONS.find(b => b.id === settings.background)?.prompt || '';
      const lighting = LIGHTING_OPTIONS.find(l => l.id === settings.lighting)?.prompt || '';

      const result = await generateProfessionalPhoto(sourceImage, {
        outfit,
        background,
        lighting,
        expression: 'professional and approachable'
      });

      setResultImage(result);
      setStatus(AppStatus.SUCCESS);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Failed to generate your professional clone.");
      setStatus(AppStatus.ERROR);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
              <i className="fa-solid fa-user-tie text-white text-xl"></i>
            </div>
            <h1 className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">
              ProClone <span className="text-blue-500">AI</span>
            </h1>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-400">
            <span className="hover:text-white transition-colors cursor-pointer">Pricing</span>
            <span className="hover:text-white transition-colors cursor-pointer">Gallery</span>
            <button className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-white transition-colors">
              Docs
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left Column: Controls */}
        <div className="lg:col-span-5 space-y-10">
          <section>
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-2">Step 1: Your Reference</h2>
              <p className="text-zinc-400">Upload a clear photo or take a selfie to help the AI learn your features.</p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {sourceImage ? (
                <div className="relative group aspect-[4/3] rounded-3xl overflow-hidden border-2 border-zinc-800 bg-zinc-900">
                  <img src={sourceImage} className="w-full h-full object-cover" alt="Source" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <button 
                      onClick={() => setStatus(AppStatus.CAPTURING)}
                      className="p-3 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-md transition-all"
                    >
                      <i className="fa-solid fa-camera text-white"></i>
                    </button>
                    <label className="p-3 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-md transition-all cursor-pointer">
                      <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                      <i className="fa-solid fa-upload text-white"></i>
                    </label>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <button 
                    onClick={() => setStatus(AppStatus.CAPTURING)}
                    className="flex flex-col items-center justify-center gap-4 p-10 border-2 border-dashed border-zinc-800 rounded-3xl bg-zinc-900/30 hover:bg-zinc-900/50 hover:border-blue-500/50 transition-all group"
                  >
                    <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center group-hover:bg-blue-600/20 group-hover:text-blue-400 transition-all">
                      <i className="fa-solid fa-camera text-2xl"></i>
                    </div>
                    <div className="text-center">
                      <p className="font-semibold text-zinc-200">Take a Photo</p>
                      <p className="text-sm text-zinc-500">Use your webcam</p>
                    </div>
                  </button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-zinc-800"></span></div>
                    <div className="relative flex justify-center text-xs uppercase"><span className="bg-[#0a0a0c] px-2 text-zinc-500">Or</span></div>
                  </div>

                  <label className="flex items-center justify-center gap-3 p-4 bg-zinc-900 border border-zinc-800 rounded-2xl hover:bg-zinc-800 cursor-pointer transition-all">
                    <i className="fa-solid fa-cloud-arrow-up text-zinc-400"></i>
                    <span className="text-zinc-300 font-medium">Upload Image</span>
                    <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                  </label>
                </div>
              )}
            </div>
          </section>

          <section className="space-y-8">
            <div className="mb-4">
              <h2 className="text-3xl font-bold mb-2">Step 2: Style Selection</h2>
              <p className="text-zinc-400">Customize your professional look and environment.</p>
            </div>

            <SettingsGrid 
              title="Attire & Style" 
              icon="fa-shirt"
              options={OUTFIT_OPTIONS} 
              selectedId={settings.outfit}
              onChange={(id) => setSettings({...settings, outfit: id})}
            />

            <SettingsGrid 
              title="Room Environment" 
              icon="fa-house-laptop"
              options={BACKGROUND_OPTIONS} 
              selectedId={settings.background}
              onChange={(id) => setSettings({...settings, background: id})}
            />

            <SettingsGrid 
              title="Lighting Style" 
              icon="fa-lightbulb"
              options={LIGHTING_OPTIONS} 
              selectedId={settings.lighting}
              onChange={(id) => setSettings({...settings, lighting: id})}
            />

            <button
              disabled={!sourceImage || status === AppStatus.GENERATING}
              onClick={startGeneration}
              className={`w-full py-5 rounded-2xl font-bold text-lg shadow-xl transition-all flex items-center justify-center gap-3 ${
                !sourceImage || status === AppStatus.GENERATING
                  ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/20 active:scale-[0.98]'
              }`}
            >
              {status === AppStatus.GENERATING ? (
                <>
                  <i className="fa-solid fa-circle-notch animate-spin"></i>
                  Generating Your Clone...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-wand-magic-sparkles"></i>
                  Generate Professional Portrait
                </>
              )}
            </button>
            {errorMsg && (
              <p className="text-red-400 text-center text-sm bg-red-400/10 p-3 rounded-lg border border-red-400/20">
                {errorMsg}
              </p>
            )}
          </section>
        </div>

        {/* Right Column: Result */}
        <div className="lg:col-span-7">
          <div className="sticky top-24">
            <div className="bg-zinc-900/50 rounded-[40px] p-4 border border-zinc-800 min-h-[600px] flex flex-col items-center justify-center relative overflow-hidden">
              
              {status === AppStatus.GENERATING ? (
                <div className="text-center space-y-8 max-w-sm px-4">
                  <div className="relative inline-block">
                    <div className="w-32 h-32 rounded-full border-4 border-blue-600/20 border-t-blue-500 animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <i className="fa-solid fa-robot text-3xl text-blue-500"></i>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Creating Perfection</h3>
                    <p className="text-zinc-400 text-sm leading-relaxed">
                      Our AI is analyzing your facial structure and applying professional lighting, attire, and background layers. This takes about 10-15 seconds.
                    </p>
                  </div>
                  <div className="space-y-3 w-full bg-zinc-950/50 rounded-2xl p-4 border border-zinc-800">
                    <div className="flex justify-between text-xs font-mono text-zinc-500">
                      <span>Neural Mapping</span>
                      <span>COMPLETE</span>
                    </div>
                    <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-blue-500 h-full w-2/3 animate-[pulse_2s_infinite]"></div>
                    </div>
                    <div className="flex justify-between text-xs font-mono text-zinc-500">
                      <span>Refining Lighting</span>
                      <span className="animate-pulse">PROCESSING...</span>
                    </div>
                  </div>
                </div>
              ) : resultImage ? (
                <div className="w-full h-full space-y-6">
                  <div className="aspect-[4/5] md:aspect-[16/9] w-full rounded-3xl overflow-hidden shadow-2xl bg-zinc-800">
                    <img src={resultImage} className="w-full h-full object-cover" alt="Generated Clone" />
                  </div>
                  <div className="flex flex-wrap justify-center gap-4">
                    <a 
                      href={resultImage} 
                      download="pro-clone-portrait.png"
                      className="px-8 py-4 bg-zinc-100 hover:bg-white text-black font-bold rounded-2xl transition-all flex items-center gap-2"
                    >
                      <i className="fa-solid fa-download"></i>
                      Download HD
                    </a>
                    <button 
                      onClick={startGeneration}
                      className="px-8 py-4 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-2xl transition-all flex items-center gap-2 border border-zinc-700"
                    >
                      <i className="fa-solid fa-rotate-right"></i>
                      Regenerate
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center p-12">
                  <div className="w-24 h-24 bg-zinc-800/50 rounded-full flex items-center justify-center mx-auto mb-6 border border-zinc-700/50">
                    <i className="fa-regular fa-image text-4xl text-zinc-600"></i>
                  </div>
                  <h3 className="text-xl font-bold text-zinc-300 mb-2">Ready for Action</h3>
                  <p className="text-zinc-500 max-w-xs mx-auto">
                    Choose your style and click generate to see your professional AI clone in a high-end setup.
                  </p>
                </div>
              )}

              {/* Decorative elements */}
              <div className="absolute top-0 right-0 p-6">
                <div className="text-[10px] font-mono text-zinc-700 uppercase tracking-tighter vertical-text opacity-50">
                  GEMINI 2.5 FLASH IMAGE ENGINE v4.2
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-12 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2 opacity-50">
            <div className="w-6 h-6 bg-zinc-700 rounded flex items-center justify-center">
              <i className="fa-solid fa-user-tie text-[10px]"></i>
            </div>
            <span className="text-sm font-bold">ProClone AI</span>
            <span className="text-xs text-zinc-500 ml-4">© 2024 AI Professional Solutions</span>
          </div>
          <div className="flex gap-8 text-sm text-zinc-500">
            <span className="hover:text-white transition-colors cursor-pointer">Privacy Policy</span>
            <span className="hover:text-white transition-colors cursor-pointer">Terms of Service</span>
            <span className="hover:text-white transition-colors cursor-pointer">Contact Support</span>
          </div>
        </div>
      </footer>

      {/* Overlays */}
      {status === AppStatus.CAPTURING && (
        <CameraModule 
          onCapture={handleCapture}
          onCancel={() => setStatus(AppStatus.IDLE)}
        />
      )}
    </div>
  );
};

export default App;
