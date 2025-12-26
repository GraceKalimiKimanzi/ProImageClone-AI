
import React, { useRef, useState, useCallback, useEffect } from 'react';

interface CameraModuleProps {
  onCapture: (base64: string) => void;
  onCancel: () => void;
}

const CameraModule: React.FC<CameraModuleProps> = ({ onCapture, onCancel }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { width: 1280, height: 720, facingMode: 'user' },
          audio: false,
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        setError("Could not access camera. Please ensure permissions are granted.");
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleCapture = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        onCapture(dataUrl);
      }
    }
  }, [onCapture]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
      <div className="relative max-w-2xl w-full bg-zinc-900 rounded-3xl overflow-hidden shadow-2xl border border-zinc-800">
        <div className="p-4 flex justify-between items-center border-b border-zinc-800">
          <h3 className="text-lg font-semibold">Capture Your Face</h3>
          <button onClick={onCancel} className="text-zinc-400 hover:text-white transition-colors">
            <i className="fa-solid fa-xmark text-xl"></i>
          </button>
        </div>

        <div className="relative aspect-video bg-black flex items-center justify-center">
          {error ? (
            <div className="text-center p-8">
              <i className="fa-solid fa-triangle-exclamation text-red-500 text-4xl mb-4"></i>
              <p className="text-zinc-300">{error}</p>
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover mirror"
                style={{ transform: 'scaleX(-1)' }}
              />
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="w-64 h-80 border-2 border-dashed border-white/30 rounded-[100px] flex items-center justify-center">
                  <span className="text-white/50 text-xs uppercase tracking-widest">Position Face Here</span>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="p-8 flex justify-center gap-4">
          <button
            onClick={onCancel}
            className="px-6 py-3 rounded-full bg-zinc-800 hover:bg-zinc-700 font-medium transition-all"
          >
            Cancel
          </button>
          {!error && (
            <button
              onClick={handleCapture}
              className="px-8 py-3 rounded-full bg-blue-600 hover:bg-blue-500 font-bold transition-all shadow-lg shadow-blue-900/20 flex items-center gap-2"
            >
              <i className="fa-solid fa-camera"></i>
              Capture Reference
            </button>
          )}
        </div>
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
};

export default CameraModule;
