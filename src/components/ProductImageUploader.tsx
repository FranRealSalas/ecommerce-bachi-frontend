"use client";
import { useRef, useState } from "react";

export default function ProductImageUploader({
  onImageChange,
}: {
  onImageChange: (file: File | null) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = () => {
    const file = fileInputRef.current?.files?.[0] || null;
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setPreview(reader.result);
        }
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
    onImageChange(file);
  };

  const handleDelete = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setPreview(null);
    onImageChange(null);
  };

  return (
    <div className="flex flex-col space-y-2">
      <label className="text-sm font-medium text-gray-700">
        Imagen del producto
      </label>

      <input
        type="file"
        accept="image/*"
        className="block w-full text-sm text-gray-700 border border-gray-300 rounded-lg cursor-pointer bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-500 file:text-white hover:file:bg-green-600"
        ref={fileInputRef}
        onChange={handleFileChange}
      />

      {preview && (
        <div className="relative flex flex-col items-center">
          <img
            src={preview}
            alt="Vista previa"
            className="w-40 h-40 object-cover rounded-lg border"
          />
          <button
            type="button"
            onClick={handleDelete}
            className="mt-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
          >
            🗑 Borrar
          </button>
        </div>
      )}
    </div>
  );
}
