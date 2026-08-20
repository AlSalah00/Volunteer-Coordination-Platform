import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { X, Camera } from "lucide-react";

export default function QrScannerModal({ isOpen, onClose, onScan }) {
  const [cameraError, setCameraError] = useState("");
  const scannerRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    let html5QrcodeInstance;
    const elementId = "qr-reader-container";

    const startCamera = async () => {
      try {
        setCameraError("");
        html5QrcodeInstance = new Html5Qrcode(elementId);
        scannerRef.current = html5QrcodeInstance;

        await html5QrcodeInstance.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 220, height: 220 } },
          (decodedText) => {
            onScan(decodedText);
            stopCamera();
          },
          () => {} // Ignore frame scan errors
        );
      } catch (err) {
        console.error("Camera access error:", err);
        setCameraError("Could not access camera. Please check permissions.");
      }
    };

    const stopCamera = async () => {
      if (scannerRef.current && scannerRef.current.isScanning) {
        try {
          await scannerRef.current.stop();
        } catch (err) {
          console.error("Failed to stop scanner:", err);
        }
      }
    };

    // Small delay guarantees DOM mounting before scanner init
    const timer = setTimeout(startCamera, 150);

    return () => {
      clearTimeout(timer);
      stopCamera();
    };
  }, [isOpen, onScan]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-purple-950/40 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1 text-purple-600/40 hover:bg-purple-50 hover:text-purple-600 cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-4 flex items-center gap-2">
          <Camera className="h-5 w-5 text-purple-600" />
          <h3 className="font-sora text-base font-bold text-purple-600">
            Scan Attendance QR
          </h3>
        </div>

        {cameraError ? (
          <div className="rounded-xl border border-coral-600/20 bg-coral-50 p-4 text-center font-inter text-xs text-coral-600">
            {cameraError}
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-purple-200">
            <div id="qr-reader-container" className="w-full" />
          </div>
        )}
      </div>
    </div>
  );
}