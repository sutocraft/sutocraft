"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { uploadImage } from "@/lib/storage";

type Props = {
  label: string;
  folder: string;
  value?: string;
  onChange: (url: string) => void;
};

export default function ImageUploader({
  label,
  folder,
  value = "",
  onChange,
}: Props) {
  const inputRef =
    useRef<HTMLInputElement>(null);

  const [uploading, setUploading] =
    useState(false);

  async function handleUpload(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0];

    if (!file) return;

    setUploading(true);

    const result = await uploadImage(
      file,
      folder
    );

    setUploading(false);

    if (!result.success) {
      alert("Image upload failed.");
      return;
    }

    onChange(result.url);
  }

  return (
    <div className="space-y-3">

      <label className="block font-semibold text-white">
        {label}
      </label>

      <div className="flex gap-2">

        <input
  className="flex-1 rounded border border-gray-700 bg-gray-900 p-3 text-white"
  value={value ?? ""}
          placeholder="Paste image URL"
          onChange={(e) =>
            onChange(e.target.value)
          }
        />

        <button
          type="button"
          onClick={() =>
            inputRef.current?.click()
          }
          className="rounded bg-blue-600 px-5 text-white hover:bg-blue-700"
        >
          Upload
        </button>

      </div>

      <input
        hidden
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleUpload}
      />

      {uploading && (
        <p className="text-green-400">
          Uploading...
        </p>
      )}

      {(value ?? "").trim() !== "" && (

        <div className="relative h-40 w-40 overflow-hidden rounded border border-gray-700">

          <Image
  src={value ?? ""}
  alt={label}
  fill
  className="object-cover"
/>

        </div>

      )}

    </div>
  );
}