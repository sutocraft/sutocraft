"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  Expand,
  X,
} from "lucide-react";

type Props = {
  images: string[];
  productName: string;
};

export default function ProductGallery({
  images,
  productName,
}: Props) {
  const gallery =
    images && images.length
      ? images
      : ["/images/no-image.png"];

  const [active, setActive] = useState(0);

  const [loaded, setLoaded] = useState(true);

  const [fullscreen, setFullscreen] =
    useState(false);

  const touchStart = useRef(0);
  const touchEnd = useRef(0);

  useEffect(() => {
    setActive(0);
    setLoaded(true);
  }, [images]);

  function previous() {
  if (gallery.length <= 1) return;

  setLoaded(false);

  setActive((prev) =>
    prev === 0
      ? gallery.length - 1
      : prev - 1
  );
}

  function next() {
  if (gallery.length <= 1) return;

  setLoaded(false);

  setActive((prev) =>
    prev === gallery.length - 1
      ? 0
      : prev + 1
  );
}

  function handleTouchStart(
    e: React.TouchEvent<HTMLDivElement>
  ) {
    touchStart.current =
      e.changedTouches[0].clientX;
  }

  function handleTouchEnd(
    e: React.TouchEvent<HTMLDivElement>
  ) {
    touchEnd.current =
      e.changedTouches[0].clientX;

    const distance =
      touchStart.current - touchEnd.current;

    if (distance > 60) {
      next();
    }

    if (distance < -60) {
      previous();
    }
  }

  useEffect(() => {
    const handleKey = (
      e: KeyboardEvent
    ) => {
      if (fullscreen) {
        if (e.key === "ArrowRight")
          next();

        if (e.key === "ArrowLeft")
          previous();

        if (e.key === "Escape")
          setFullscreen(false);
      }
    };

    window.addEventListener(
      "keydown",
      handleKey
    );

    return () =>
      window.removeEventListener(
        "keydown",
        handleKey
      );
  }, [fullscreen]);

  return (
    <>
      <div className="flex flex-col gap-5">

        <div
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="relative overflow-hidden rounded-3xl border border-[#E8E1CE] bg-[#F8F5EE]"
        >
          <div className="relative aspect-[4/5]">

            {false && (
              <div className="absolute inset-0 animate-pulse bg-[#EFE8D8]" />
            )}

            <Image
  id="product-main-image"
  src={gallery[active]}
              alt={productName}
              fill
              priority
              onLoadingComplete={() => {
  setLoaded(true);
}}
              className="object-contain p-4 transition-all duration-500 hover:scale-[1.03]"
              
            />

            <button
              onClick={() =>
                setFullscreen(true)
              }
              className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow transition hover:bg-[#98691D] hover:text-white"
            >
              <Expand size={18} />
            </button>

            {gallery.length > 1 && (
              <>
                <button
                  onClick={previous}
                  className="absolute left-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow transition hover:bg-[#98691D] hover:text-white"
                >
                  <ChevronLeft />
                </button>

                <button
                  onClick={next}
                  className="absolute right-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow transition hover:bg-[#98691D] hover:text-white"
                >
                  <ChevronRight />
                </button>
              </>
            )}

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
              {active + 1} / {gallery.length}
            </div>

          </div>
        </div>

                {gallery.length > 1 && (
          <div className="grid grid-cols-5 gap-3">

            {gallery.map((image, index) => (
              <button
                key={index}
                onClick={() => {
  if (index === active) return;

  setLoaded(false);
  setActive(index);
}}
                className={`relative aspect-square overflow-hidden rounded-2xl border transition-all duration-300 ${
                  active === index
                    ? "border-[#98691D] ring-2 ring-[#98691D]/20"
                    : "border-[#E8E1CE] hover:border-[#98691D]"
                }`}
              >
                <Image
                  src={image}
                  alt={`${productName}-${index + 1}`}
                  fill
                  className="object-cover"
                />

                {active === index && (
                  <div className="absolute inset-0 bg-[#98691D]/10" />
                )}
              </button>
            ))}

          </div>
        )}

      </div>

      {fullscreen && (
        <div className="fixed inset-0 z-[9999] bg-black/95">

          <button
            onClick={() => setFullscreen(false)}
            className="absolute right-6 top-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-white text-black transition hover:bg-[#98691D] hover:text-white"
          >
            <X size={24} />
          </button>

          <button
            onClick={previous}
            className="absolute left-6 top-1/2 z-50 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white text-black transition hover:bg-[#98691D] hover:text-white"
          >
            <ChevronLeft size={26} />
          </button>

          <button
            onClick={next}
            className="absolute right-6 top-1/2 z-50 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white text-black transition hover:bg-[#98691D] hover:text-white"
          >
            <ChevronRight size={26} />
          </button>

          <div className="flex h-full w-full items-center justify-center p-10">

            <div className="relative h-full w-full max-w-6xl">

              <Image
                src={gallery[active]}
                alt={productName}
                fill
                priority
                className="object-contain"
              />

            </div>

          </div>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur">
            {active + 1} / {gallery.length}
          </div>

        </div>
      )}
    </>
  );
}