
import React, { useState } from 'react';
import { AppView, ImageData } from './types';
import * as gemini from './services/geminiService';

// --- Components ---

const Header: React.FC<{ activeView: AppView; setView: (v: AppView) => void }> = ({ activeView, setView }) => (
  <header className="sticky top-0 z-50 glass-panel border-b-0 mb-8">
    <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-violet-200">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m19 11-4-7-4 7Z"/><path d="M12 11h.01"/><path d="M15 11h.01"/><path d="M11 22 7 15l-4 7Z"/><path d="M6 15v.01"/><path d="M9 15v.01"/><path d="M14 15h.01"/><path d="M18 15h.01"/><path d="M22 22l-4-7-4 7Z"/></svg>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gradient tracking-tight">AI Outfit Studio</h1>
          <p className="text-xs text-zinc-500 font-medium tracking-wide uppercase">Generative AI Powered</p>
        </div>
      </div>
      <nav className="flex bg-zinc-100/80 p-1.5 rounded-xl backdrop-blur-sm">
        {[
          { id: AppView.OUTFIT_SWAP, label: 'Swap Outfit', icon: '👕' },
          { id: AppView.IMAGE_EDITOR, label: 'Edit Image', icon: '🪄' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setView(tab.id)}
            className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
              activeView === tab.id
              ? 'bg-white text-violet-700 shadow-sm ring-1 ring-black/5'
              : 'text-zinc-500 hover:text-zinc-800 hover:bg-zinc-200/50'
            }`}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  </header>
);

const FileUpload: React.FC<{ 
  label: string; 
  onUpload: (img: ImageData | null) => void;
  preview: string | null;
  active?: boolean;
}> = ({ label, onUpload, preview, active }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpload({
          base64: reader.result as string,
          mimeType: file.type
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col gap-3 w-full group">
      <label className="text-sm font-bold text-zinc-700 ml-1">{label}</label>
      <div className={`relative border-2 border-dashed rounded-3xl transition-all duration-300 h-72 flex flex-col items-center justify-center overflow-hidden bg-white/50 backdrop-blur-sm ${
        preview
        ? 'border-violet-300 ring-4 ring-violet-50'
        : 'border-zinc-200 hover:border-violet-400 hover:bg-white/80'
      }`}>
        {preview ? (
          <>
            <img src={preview} alt="preview" className="w-full h-full object-cover animate-fade-in" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-start justify-end p-3">
              <button
                onClick={() => onUpload(null)}
                className="bg-white/90 text-red-500 p-2 rounded-full shadow-lg hover:bg-red-50 hover:text-red-600 transition-all transform scale-0 group-hover:scale-100"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>
          </>
        ) : (
          <label className="cursor-pointer flex flex-col items-center p-8 text-center w-full h-full justify-center">
            <div className="w-16 h-16 bg-violet-50 rounded-full flex items-center justify-center mb-4 text-violet-500 group-hover:scale-110 transition-transform duration-300">
               <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
            </div>
            <span className="text-sm font-semibold text-zinc-600 group-hover:text-violet-600 transition-colors">Upload Image</span>
            <span className="text-xs text-zinc-400 mt-1">PNG, JPG, WEBP up to 5MB</span>
            <input type="file" className="hidden" accept="image/*" onChange={handleChange} />
          </label>
        )}
      </div>
    </div>
  );
};

const LoadingOverlay: React.FC<{ message: string }> = ({ message }) => (
  <div className="absolute inset-0 z-50 bg-white/60 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center animate-fade-in">
    <div className="w-16 h-16 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin mb-6"></div>
    <p className="text-zinc-800 font-bold text-xl">{message}</p>
    <p className="text-zinc-500 text-sm mt-2 animate-pulse">Sedang memproses...</p>
  </div>
);

// --- Main App ---

export default function App() {
  const [activeView, setActiveView] = useState<AppView>(AppView.OUTFIT_SWAP);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Outfit Swap States
  const [targetImage, setTargetImage] = useState<ImageData | null>(null);
  const [outfitImage, setOutfitImage] = useState<ImageData | null>(null);
  const [swapResult, setSwapResult] = useState<string | null>(null);

  // Image Editor States
  const [editorImage, setEditorImage] = useState<ImageData | null>(null);
  const [editPrompt, setEditPrompt] = useState('');
  const [editResult, setEditResult] = useState<string | null>(null);

  const handleSwap = async () => {
    if (!targetImage || !outfitImage) return;
    setLoading(true);
    setError(null);
    try {
      const result = await gemini.outfitSwap(targetImage, outfitImage);
      setSwapResult(result);
    } catch (err: any) {
      setError(err.message || "Failed to swap outfit");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async () => {
    if (!editorImage || !editPrompt) return;
    setLoading(true);
    setError(null);
    try {
      const result = await gemini.editImageWithText(editorImage, editPrompt);
      setEditResult(result);
    } catch (err: any) {
      setError(err.message || "Editing failed");
    } finally {
      setLoading(false);
    }
  };

  const downloadImage = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen pb-20 selection:bg-violet-100 selection:text-violet-900">
      <Header activeView={activeView} setView={setActiveView} />

      <main className="max-w-7xl mx-auto px-6">
        {error && (
          <div className="mb-8 bg-red-50/50 backdrop-blur-sm border border-red-200 text-red-600 px-6 py-4 rounded-2xl flex items-center justify-between shadow-sm animate-fade-in">
            <div className="flex items-center gap-3">
              <div className="bg-red-100 p-2 rounded-full">
                 <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              </div>
              <span className="font-medium">{error}</span>
            </div>
            <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>
        )}

        {/* --- Outfit Swap View --- */}
        {activeView === AppView.OUTFIT_SWAP && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-6 p-8 glass-card rounded-[2rem] relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent pointer-events-none"></div>
              {loading && <LoadingOverlay message="Generating New Outfit..." />}

              <div className="md:col-span-2 mb-2">
                 <h2 className="text-2xl font-bold text-zinc-800">Studio Panel</h2>
                 <p className="text-zinc-500">Upload foto target dan referensi outfit.</p>
              </div>

              <FileUpload 
                label="1. Target Person"
                preview={targetImage?.base64 || null}
                onUpload={setTargetImage} 
              />
              <FileUpload 
                label="2. Outfit Reference"
                preview={outfitImage?.base64 || null}
                onUpload={setOutfitImage} 
              />
              <div className="md:col-span-2 flex justify-end mt-4">
                <button
                  disabled={!targetImage || !outfitImage || loading}
                  onClick={handleSwap}
                  className="w-full md:w-auto bg-zinc-900 hover:bg-zinc-800 disabled:bg-zinc-300 text-white px-8 py-4 rounded-2xl font-bold shadow-xl shadow-zinc-200 transition-all flex items-center justify-center gap-3 text-lg active:scale-95 disabled:cursor-not-allowed group"
                >
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-violet-500"></span>
                  </span>
                  Generate Outfit
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </button>
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col h-full">
              <div className="glass-panel p-8 rounded-[2rem] flex flex-col items-center h-full relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-violet-500 to-fuchsia-500"></div>
                <h3 className="text-lg font-bold text-zinc-800 mb-6 self-start flex items-center gap-2">
                  <span className="bg-zinc-100 p-1.5 rounded-lg text-lg">✨</span> Result
                </h3>

                <div className="w-full flex-1 min-h-[400px] rounded-3xl bg-zinc-50/50 border-2 border-dashed border-zinc-200 flex items-center justify-center overflow-hidden relative group">
                  {swapResult ? (
                    <img src={swapResult} alt="result" className="w-full h-full object-cover animate-fade-in" />
                  ) : (
                    <div className="text-zinc-300 text-center p-8 flex flex-col items-center">
                      <div className="w-20 h-20 bg-zinc-100 rounded-full flex items-center justify-center mb-4">
                         <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><image width="24" height="24" href=""/><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                      </div>
                      <p className="text-sm font-medium">AI Generation Output</p>
                    </div>
                  )}
                </div>

                {swapResult && (
                  <button
                    onClick={() => downloadImage(swapResult, 'outfit-studio-result.png')}
                    className="mt-8 w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-200 transition-all active:scale-95 hover:shadow-emerald-300"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                    Download HD Image
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* --- Image Editor View --- */}
        {activeView === AppView.IMAGE_EDITOR && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="glass-card p-8 rounded-[2rem] flex flex-col gap-8 relative overflow-hidden">
              {loading && <LoadingOverlay message="Processing Image..." />}

              <div>
                <h2 className="text-2xl font-bold text-zinc-800">AI Magic Editor</h2>
                <p className="text-zinc-500">Describe changes and watch the magic happen.</p>
              </div>

              <FileUpload 
                label="Original Image"
                preview={editorImage?.base64 || null}
                onUpload={setEditorImage} 
              />

              <div className="space-y-3">
                <label className="text-sm font-bold text-zinc-700 ml-1 block">Prompt Instruksi</label>
                <textarea 
                  value={editPrompt}
                  onChange={(e) => setEditPrompt(e.target.value)}
                  placeholder="e.g., 'Change background to a cozy cafe', 'Add sunglasses', 'Make it cyberpunk style'"
                  className="w-full p-6 rounded-3xl bg-white/50 border border-zinc-200 focus:border-violet-400 focus:ring-4 focus:ring-violet-50 outline-none transition-all h-40 resize-none text-zinc-700 placeholder:text-zinc-400 font-medium leading-relaxed"
                />
              </div>

              <button
                disabled={!editorImage || !editPrompt || loading}
                onClick={handleEdit}
                className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white py-4 rounded-2xl font-bold shadow-xl shadow-violet-200 transition-all active:scale-95 disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M9 3v4"/><path d="M3 5h4"/><path d="M3 9h4"/></svg>
                Execute Edit
              </button>
            </div>

            <div className="glass-panel p-8 rounded-[2rem] flex flex-col items-center justify-center relative">
               <div className="absolute top-0 right-0 w-32 h-32 bg-fuchsia-500/10 blur-[60px] rounded-full pointer-events-none"></div>
              <h3 className="text-lg font-bold text-zinc-800 mb-6 self-start w-full flex justify-between items-center">
                <span>Result</span>
                <span className="text-xs font-normal px-3 py-1 bg-zinc-100 rounded-full text-zinc-500">High Quality</span>
              </h3>

              <div className="w-full aspect-square rounded-3xl bg-zinc-50 border-2 border-dashed border-zinc-200 flex items-center justify-center overflow-hidden relative">
                {editResult ? (
                  <img src={editResult} alt="edit result" className="w-full h-full object-contain animate-fade-in" />
                ) : (
                  <div className="text-zinc-300 text-center p-8">
                     <p className="text-sm font-medium">Edited image will appear here</p>
                  </div>
                )}
              </div>

              {editResult && (
                <button 
                  onClick={() => downloadImage(editResult, 'edited-by-gemini.png')}
                  className="mt-8 w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-200"
                >
                  Download Result
                </button>
              )}
            </div>
          </div>
        )}
      </main>
      
      <footer className="mt-24 text-center text-zinc-400 text-sm pb-8">
        <p>&copy; 2025 AI Outfit Studio • Crafted with ❤️ & Gemini</p>
      </footer>
    </div>
  );
}
