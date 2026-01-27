
import React, { useState } from 'react';
import { AppView, ImageData } from './types';
import * as gemini from './services/geminiService';

// --- Components ---

const Header: React.FC<{ activeView: AppView; setView: (v: AppView) => void }> = ({ activeView, setView }) => (
  <header className="sticky top-0 z-50 bg-white border-b border-gray-200 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
    <div className="flex items-center gap-2">
      <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m19 11-4-7-4 7Z"/><path d="M12 11h.01"/><path d="M15 11h.01"/><path d="M11 22 7 15l-4 7Z"/><path d="M6 15v.01"/><path d="M9 15v.01"/><path d="M14 15h.01"/><path d="M18 15h.01"/><path d="M22 22l-4-7-4 7Z"/></svg>
      </div>
      <div>
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">AI Outfit Studio</h1>
        <p className="text-xs text-gray-500 font-medium">Powered by Gemini Nano</p>
      </div>
    </div>
    <nav className="flex bg-gray-100 p-1 rounded-lg">
      {[
        { id: AppView.OUTFIT_SWAP, label: 'Ganti Outfit', icon: '👕' },
        { id: AppView.IMAGE_EDITOR, label: 'Edit Foto', icon: '🪄' }
      ].map((tab) => (
        <button
          key={tab.id}
          onClick={() => setView(tab.id)}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
            activeView === tab.id 
            ? 'bg-white text-indigo-600 shadow-sm' 
            : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          <span className="mr-2">{tab.icon}</span>
          {tab.label}
        </button>
      ))}
    </nav>
  </header>
);

const FileUpload: React.FC<{ 
  label: string; 
  onUpload: (img: ImageData | null) => void;
  preview: string | null;
}> = ({ label, onUpload, preview }) => {
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
    <div className="flex flex-col gap-2 w-full">
      <label className="text-sm font-semibold text-gray-700">{label}</label>
      <div className={`relative border-2 border-dashed rounded-2xl transition-all h-64 flex flex-col items-center justify-center overflow-hidden ${preview ? 'border-indigo-400' : 'border-gray-300 hover:border-gray-400'}`}>
        {preview ? (
          <>
            <img src={preview} alt="preview" className="w-full h-full object-cover" />
            <button 
              onClick={() => onUpload(null)}
              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full shadow-lg hover:bg-red-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </>
        ) : (
          <label className="cursor-pointer flex flex-col items-center p-4 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 mb-2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
            <span className="text-sm text-gray-500">Klik untuk upload atau drag & drop</span>
            <input type="file" className="hidden" accept="image/*" onChange={handleChange} />
          </label>
        )}
      </div>
    </div>
  );
};

const LoadingOverlay: React.FC<{ message: string }> = ({ message }) => (
  <div className="absolute inset-0 z-50 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center p-8 text-center">
    <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
    <p className="text-indigo-900 font-semibold text-lg">{message}</p>
    <p className="text-gray-500 text-sm mt-2">Ini mungkin memakan waktu hingga satu menit...</p>
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
    <div className="min-h-screen bg-gray-50 pb-12">
      <Header activeView={activeView} setView={setActiveView} />

      <main className="max-w-7xl mx-auto px-4 mt-8">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl flex items-center justify-between">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              <span>{error}</span>
            </div>
            <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>
        )}

        {/* --- Outfit Swap View --- */}
        {activeView === AppView.OUTFIT_SWAP && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-white rounded-3xl shadow-sm relative overflow-hidden">
              {loading && <LoadingOverlay message="Menyulap outfit baru..." />}
              <FileUpload 
                label="1. Foto Orang (Target)" 
                preview={targetImage?.base64 || null}
                onUpload={setTargetImage} 
              />
              <FileUpload 
                label="2. Foto Outfit (Referensi)" 
                preview={outfitImage?.base64 || null}
                onUpload={setOutfitImage} 
              />
              <div className="md:col-span-2 flex justify-center mt-4">
                <button
                  disabled={!targetImage || !outfitImage || loading}
                  onClick={handleSwap}
                  className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-indigo-200 transition-all flex items-center gap-2 text-lg active:scale-95"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 10v4a5 5 0 0 1-10 0v-4"/><path d="M17 10v4a5 5 0 0 0 10 0v-4"/><path d="M12 21c-2 0-4-1-4-1s-1 4-1 4a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2s-1-4-1-4-2 1-4 1Z"/><path d="M12 3a9 9 0 0 1 9 9v1"/><path d="M12 3a9 9 0 0 0-9 9v1"/><path d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/></svg>
                  Ganti Outfit Sekarang
                </button>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-sm flex flex-col items-center">
              <h3 className="text-lg font-bold text-gray-800 mb-4 self-start">3. Hasil Generate</h3>
              <div className="w-full aspect-[3/4] rounded-2xl bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-100 relative">
                {swapResult ? (
                  <img src={swapResult} alt="result" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-gray-400 text-center p-8">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-4 opacity-20"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                    <p className="text-sm">Hasil akan muncul di sini setelah Anda menekan tombol ganti outfit</p>
                  </div>
                )}
              </div>
              {swapResult && (
                <button 
                  onClick={() => downloadImage(swapResult, 'outfit-studio-result.png')}
                  className="mt-6 w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-md shadow-emerald-100 transition-all active:scale-95"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                  Download Hasil
                </button>
              )}
            </div>
          </div>
        )}

        {/* --- Image Editor View --- */}
        {activeView === AppView.IMAGE_EDITOR && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-3xl shadow-sm flex flex-col gap-6 relative overflow-hidden">
              {loading && <LoadingOverlay message="Memproses editan Anda..." />}
              <h2 className="text-xl font-bold text-gray-800">Editor Gambar AI</h2>
              <FileUpload 
                label="Pilih Foto untuk Diedit" 
                preview={editorImage?.base64 || null}
                onUpload={setEditorImage} 
              />
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Apa yang ingin Anda ubah?</label>
                <textarea 
                  value={editPrompt}
                  onChange={(e) => setEditPrompt(e.target.value)}
                  placeholder="Contoh: 'Ubah latar belakang menjadi pantai', 'Tambahkan filter retro', 'Hapus orang di background'"
                  className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all h-32 resize-none"
                />
              </div>
              <button
                disabled={!editorImage || !editPrompt || loading}
                onClick={handleEdit}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-xl font-bold shadow-lg transition-all active:scale-95 disabled:bg-gray-300"
              >
                Proses Edit
              </button>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-sm flex flex-col items-center">
              <h3 className="text-lg font-bold text-gray-800 mb-4 self-start">Hasil Edit</h3>
              <div className="w-full aspect-square rounded-2xl bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-100">
                {editResult ? (
                  <img src={editResult} alt="edit result" className="w-full h-full object-contain" />
                ) : (
                  <div className="text-gray-400 text-center p-8">
                     <p className="text-sm">Hasil editan AI akan tampil di sini</p>
                  </div>
                )}
              </div>
              {editResult && (
                <button 
                  onClick={() => downloadImage(editResult, 'edited-by-gemini.png')}
                  className="mt-6 w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold flex items-center justify-center gap-2"
                >
                  Download Hasil Edit
                </button>
              )}
            </div>
          </div>
        )}
      </main>
      
      <footer className="mt-20 text-center text-gray-400 text-sm">
        <p>&copy; 2025 AI Outfit Studio • All Rights Reserved</p>
      </footer>
    </div>
  );
}
