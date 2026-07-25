"use client";

import { useParams } from "next/navigation";

export default function EditProductPage() {
  const { id } = useParams();

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">
        Edit Product
      </h1>

      <p>ID: {id}</p>
    </div>
  );
}