import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Link as LinkIcon, Check } from "lucide-react";
import Modal from "../common/Modal";
import Button from "../common/Button";

export default function AttendanceQrModal({ isOpen, onClose, checkinUrl, activityName }) {
  const [qrDataUrl, setQrDataUrl] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isOpen || !checkinUrl) return;

    let isMounted = true;
    setIsGenerating(true);
    setQrDataUrl(null);

    QRCode.toDataURL(checkinUrl, { width: 320, margin: 1 })
      .then((url) => {
        if (isMounted) setQrDataUrl(url);
      })
      .catch(() => {
        if (isMounted) setQrDataUrl(null);
      })
      .finally(() => {
        if (isMounted) setIsGenerating(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, checkinUrl]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(checkinUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-sm">
      <h2 className="mb-1.5 font-sora text-lg font-extrabold text-purple-600">
        Attendance Check-In
      </h2>
      <p className="mb-5 font-inter text-sm text-purple-600/60">
        Volunteers scan this to check in to {activityName}.
      </p>

      <div className="mb-5 flex h-64 items-center justify-center rounded-xl border border-purple-200/60 bg-purple-50/40 p-6">
        {isGenerating && <p className="font-inter text-sm text-purple-600/50">Generating...</p>}
        {!isGenerating && qrDataUrl && (
          <img src={qrDataUrl} alt="Attendance check-in QR code" className="h-56 w-56" />
        )}
        {!isGenerating && !qrDataUrl && (
          <p className="font-inter text-sm text-coral-600">Couldn't generate the QR code.</p>
        )}
      </div>

      <Button variant="secondary" fullWidth onClick={handleCopy}>
        {copied ? <Check className="h-4 w-4" /> : <LinkIcon className="h-4 w-4" />}
        {copied ? "Link Copied" : "Copy Check-In Link"}
      </Button>
    </Modal>
  );
}
