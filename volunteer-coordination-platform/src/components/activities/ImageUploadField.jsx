import { useRef, useState } from "react";
import { ImagePlus, X } from "lucide-react";

export default function ImageUploadField({ value, onChange, label = "Activity Photo" }) {
  const inputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleFile = (file) => {
    if (!file) return;
    onChange(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleRemove = () => {
    onChange(null);
    setPreviewUrl(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-inter text-sm font-medium text-purple-600/80">{label}</label>

      <div className="relative aspect-3/2 w-full max-w-sm overflow-hidden rounded-xl border-2 border-dashed border-purple-600/20 bg-purple-50/40">
        {previewUrl ? (
          <img src={previewUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-purple-600/40">
            <ImagePlus className="h-8 w-8" />
            <span className="font-inter text-xs">No photo yet — we'll use a default</span>
          </div>
        )}

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="absolute inset-0 flex items-center justify-center bg-purple-600/0 font-sora text-sm font-bold text-transparent
                     transition-colors hover:bg-purple-600/40 hover:text-purple-50 cursor-pointer"
        >
          {previewUrl ? "Change photo" : "Upload photo"}
        </button>

        {previewUrl && (
          <button
            type="button"
            onClick={handleRemove}
            aria-label="Remove photo"
            className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-purple-800/70 text-purple-50 hover:bg-purple-800 transition-colors cursor-pointer"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
      </div>

      <p className="font-inter text-xs text-purple-600/50">
        Best at 1200×800px (3:2), JPG or PNG, under 5MB. No photo? We'll use a friendly default.
      </p>
    </div>
  );
}
