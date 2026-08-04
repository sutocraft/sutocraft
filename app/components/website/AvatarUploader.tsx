"use client";

import { useRef } from "react";

type Props = {
  onSelect: (file: File) => void;
};

export default function AvatarUploader({ onSelect }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  function openPicker() {
    inputRef.current?.click();
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (!file) return;

    const allowed = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowed.includes(file.type)) {
      alert("Only JPG, PNG or WEBP allowed.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert("Maximum file size is 2 MB.");
      return;
    }

    onSelect(file);
  }

  return (
    <>
      <button
        type="button"
        onClick={openPicker}
        className="bg-[#A8741A] hover:bg-[#8F6513] text-white font-semibold px-6 py-3 rounded-xl transition"
      >
        Change Photo
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={handleChange}
      />
    </>
  );
}