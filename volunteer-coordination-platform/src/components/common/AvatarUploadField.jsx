import { useEffect, useRef, useState } from "react";
import { Camera, X } from "lucide-react";
import Avatar from "./Avatar";

export default function AvatarUploadField({ initialImageUrl = null, name, onChange, size = 112 }) {
  const inputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(initialImageUrl);

  useEffect(() => {
    setPreviewUrl(initialImageUrl);
  }, [initialImageUrl]);

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
    <div className="flex flex-col items-center gap-2">
      <div className="group relative">
        <Avatar src={previewUrl} name={name} size={size} className="border-4 border-white shadow-md" />

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          aria-label="Change photo"
          className="absolute inset-0 flex items-center justify-center rounded-full bg-purple-600/0 text-transparent
                     transition-colors group-hover:bg-purple-600/50 group-hover:text-purple-50 cursor-pointer"
        >
          <Camera className="h-5 w-5" />
        </button>

        {previewUrl && (
          <button
            type="button"
            onClick={handleRemove}
            aria-label="Remove photo"
            className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-purple-800 text-purple-50
                       shadow-sm transition-colors hover:bg-purple-900 cursor-pointer"
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
      <span className="font-inter text-xs text-purple-600/50">Click to change photo</span>
    </div>
  );
}
