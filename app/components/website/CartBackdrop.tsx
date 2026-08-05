"use client";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function CartBackdrop({
  open,
  onClose,
}: Props) {
  if (!open) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
    />
  );
}