import React, { useState, useEffect, useRef } from 'react';
import { Camera, RefreshCw, AlertTriangle, CheckCircle2, Info, Loader2 } from 'lucide-react';

const injectStyles = () => {
  if (typeof document === 'undefined' || document.getElementById('wasteai-styles')) return;
  const style = document.createElement('style');
  style.id = 'wasteai-styles';
  style.innerHTML = `
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;800&display=swap');
    .font-display { font-family: 'Plus Jakarta Sans', sans-serif; }
    @keyframes scan {
      0% { top: 0%; opacity: 0.8; }
      50% { top: 100%; opacity: 0.8; }
      100% { top: 0%; opacity: 0.8; }
    }
    .animate-scan { animation: scan 2.5s ease-in-out infinite; }
  `;
  document.head.appendChild(style);
};

export default function App() {
  useEffect(() => { injectStyles(); }, []);

  const [stream, setStream] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "YOUR_GEMINI_API_KEY_HERE"; 

  const initCamera = async () => {
    setError(null);
    try {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
        audio: false
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error(err);
      setError("Unable to access the camera. Ensure HTTPS is active and permissions are granted.");
    }
  };

  useEffect(() => {
    initCamera();
    return () => {
      if (stream) stream.getTracks().forEach(track => track.stop());
    };
  }, []);

  const handleScan = async () => {
    if (!videoRef.current || !canvasRef.current || loading) return;
    setLoading(true);
    setError(null);

    try {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      const base64ImageWithHeader = canvas.toDataURL('image/jpeg', 0.8);
      const base64Data = base64ImageWithHeader.split(',')[1];
      await analyzeImage(base64Data);
    } catch (err) {
      setError("Failed to process image frame.");
      setLoading(false);
    }
  };

  const analyzeImage = async (base64Data) => {
    if (!GEMINI_API_KEY || GEMINI_API_KEY === "YOUR_GEMINI_API_KEY_HERE") {
      setError("Gemini API Key Missing! Please add it to your .env file and restart your server.");
      setLoading(false);
      return;
    }

    const systemInstruction = `You are a waste segregation expert for Hyderabad, India. Analyze the image and identify the waste item. Respond ONLY in JSON matching this schema: { "item": "name of item", "category": "Wet | Dry | Hazardous | E-Waste | Recyclable", "color": "hex color for the category (green for wet, blue for dry, red for hazardous, purple for e-waste, teal for recyclable)", "disposal": "1-sentence how to dispose", "tips": ["tip1", "tip2"], "ghmc_note": "relevant GHMC Hyderabad collection info" }`;

    try {
      // Calling the native Google Gemini 2.5 Flash endpoint (perfect for vision & completely free)
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: systemInstruction },
                {
                  inlineData: {
                    mimeType: "image/jpeg",
                    data: base64Data
                  }
                },
                { text: "Analyze this image and output the raw structural JSON object directly." }
              ]
            }
          ],
          generationConfig: {
            responseMimeType: "application/json" // Tells Gemini to strictly respond in clean JSON
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData?.error?.message || `HTTP ${response.status}`);
      }

      const data = await response.json();
      const rawText = data.candidates[0].content.parts[0].text;
      
      setResult(JSON.parse(rawText.trim()));
      setIsSheetOpen(true);
    } catch (err) {
      console.error(err);
      setError(`Analysis failed: ${err.message || "Network error. Please try again."}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full h-screen bg-neutral-950 text-neutral-100 overflow-hidden flex flex-col font-display select-none">
      <header className="absolute top-0 left-0 w-full z-20 bg-gradient-to-b from-black/80 to-transparent p-6 pt-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-400">
            WasteAI
          </h1>
          <p className="text-xs text-neutral-400 font-medium tracking-wide uppercase mt-0.5">Hyderabad Free Scanner</p>
        </div>
        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
      </header>

      <div className="relative flex-1 w-full h-full overflow-hidden">
        {error ? (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-8 text-center bg-neutral-900">
            <div className="p-4 bg-red-500/10 rounded-2xl text-red-400 mb-4 border border-red-500/20">
              <AlertTriangle size={32} />
            </div>
            <p className="text-sm text-neutral-300 max-w-xs leading-relaxed mb-6">{error}</p>
            <button onClick={initCamera} className="flex items-center gap-2 px-5 py-2.5 bg-neutral-800 border border-neutral-700 rounded-xl font-semibold text-sm">
              <RefreshCw size={16} /> Try Again
            </button>
          </div>
        ) : (
          <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
        )}

        {loading && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] pointer-events-none flex items-center justify-center">
            <div className="absolute left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#10b981] animate-scan" />
            <div className="flex flex-col items-center gap-3 bg-neutral-900/90 border border-neutral-800 px-6 py-4 rounded-2xl backdrop-blur-md">
              <Loader2 className="animate-spin text-emerald-400" size={24} />
              <span className="text-xs font-semibold tracking-wider text-neutral-300 uppercase">Analyzing via Gemini...</span>
            </div>
          </div>
        )}
        <canvas ref={canvasRef} className="hidden" />
      </div>

      {!isSheetOpen && !error && (
        <div className="absolute bottom-0 left-0 w-full p-8 pb-10 z-10 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex justify-center">
          <button onClick={handleScan} disabled={loading} className="w-20 h-20 rounded-full flex items-center justify-center border-4 border-neutral-900 shadow-2xl bg-white text-neutral-950 active:scale-90 transition-transform">
            <Camera size={32} strokeWidth={2.5} />
          </button>
        </div>
      )}

      <div className={`absolute bottom-0 left-0 w-full bg-neutral-900 border-t border-neutral-800/80 rounded-t-[2.5rem] shadow-2xl z-30 transform transition-transform duration-500 max-h-[85vh] overflow-y-auto ${isSheetOpen ? 'translate-y-0' : 'translate-y-full'}`}>
        <div className="w-12 h-1.5 bg-neutral-800 rounded-full mx-auto my-4" />
        {result && (
          <div className="px-6 pb-10 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-extrabold tracking-tight text-white capitalize">{result.item}</h2>
              <span className="px-3.5 py-1.5 rounded-full text-xs font-extrabold tracking-wider uppercase border" style={{ backgroundColor: `${result.color}15`, borderColor: result.color, color: result.color }}>
                {result.category}
              </span>
            </div>
            <hr className="border-neutral-800" />
            <div className="flex gap-3.5 items-start">
              <div className="p-2.5 bg-neutral-800/60 rounded-xl text-neutral-400 shrink-0">
                <CheckCircle2 size={20} style={{ color: result.color }} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-neutral-400 tracking-wider uppercase mb-1">Disposal Method</h4>
                <p className="text-neutral-200 text-[15px] font-medium">{result.disposal}</p>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <h4 className="text-xs font-bold text-neutral-400 tracking-wider uppercase">Segregation Tips</h4>
              {result.tips?.map((tip, idx) => (
                <div key={idx} className="p-3.5 bg-neutral-800/40 border border-neutral-800/60 rounded-2xl text-sm text-neutral-300 flex gap-3">
                  <span className="text-neutral-500 font-bold">0{idx + 1}.</span>{tip}
                </div>
              ))}
            </div>
            <div className="p-4 bg-amber-500/5 border border-amber-500/15 rounded-2xl flex gap-3.5 items-start">
              <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500 shrink-0"><Info size={16} /></div>
              <div>
                <h5 className="text-xs font-bold text-amber-500/90 tracking-wider uppercase mb-0.5">GHMC Hyderabad Rule</h5>
                <p className="text-xs text-neutral-400 user-select-text">{result.ghmc_note}</p>
              </div>
            </div>
            <button onClick={() => { setIsSheetOpen(false); setResult(null); initCamera(); }} className="mt-4 w-full bg-neutral-100 text-neutral-950 font-extrabold text-base py-4 rounded-2xl flex items-center justify-center gap-2">
              <RefreshCw size={18} strokeWidth={2.5} /> Scan Another Item
            </button>
          </div>
        )}
      </div>
    </div>
  );
}