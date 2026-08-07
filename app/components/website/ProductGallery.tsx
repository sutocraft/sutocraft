"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

import {
  ChevronLeft,
  ChevronRight,
  Expand,
  X,
} from "lucide-react";

import {
  useTheme,
} from "@/app/components/website/settings.theme_color";

type Props = {
  images: string[];
  productName: string;
};

export default function ProductGallery({
  images,
  productName,
}: Props) {

  const {
    themeColor,
  } = useTheme();

  const gallery =
    images && images.length
      ? images
      : ["/images/no-image.png"];

  const [active, setActive] =
    useState(0);

  const [loaded, setLoaded] =
    useState(true);

  const [fullscreen, setFullscreen] =
    useState(false);

  const touchStart =
    useRef(0);

  const touchEnd =
    useRef(0);

  useEffect(() => {

    setActive(0);

    setLoaded(true);

  }, [images]);

  function previous() {

    if (gallery.length <= 1)
      return;

    setLoaded(false);

    setActive((prev) =>
      prev === 0
        ? gallery.length - 1
        : prev - 1
    );

  }

  function next() {

    if (gallery.length <= 1)
      return;

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
      touchStart.current -
      touchEnd.current;

    if (distance > 60)
      next();

    if (distance < -60)
      previous();

  }

  useEffect(() => {

    const handleKey = (
      e: KeyboardEvent
    ) => {

      if (!fullscreen)
        return;

      if (e.key === "ArrowRight")
        next();

      if (e.key === "ArrowLeft")
        previous();

      if (e.key === "Escape")
        setFullscreen(false);

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

      <div
        className="
          flex
          flex-col
          gap-4

          lg:sticky
          lg:top-24
        "
      >

        <div
          onTouchStart={
            handleTouchStart
          }
          onTouchEnd={
            handleTouchEnd
          }
          className="
            relative

            overflow-hidden

            rounded-[28px]

            border

            bg-white

            shadow-sm
          "
          style={{
            borderColor:
              `${themeColor}25`,
          }}
        >

          <div
            className="
              relative

              aspect-square

              sm:aspect-[4/5]

              lg:aspect-[4/5]
            "
          >

                        {!loaded && (
              <div
                className="absolute inset-0 animate-pulse"
                style={{
                  background:
                    `${themeColor}10`,
                }}
              />
            )}

            <Image
              id="product-main-image"
              src={gallery[active]}
              alt={productName}
              fill
              priority
              onLoadingComplete={() =>
                setLoaded(true)
              }
              className="
                object-contain

                p-4

                transition-all
                duration-500

                hover:scale-[1.04]
              "
            />

            {/* Fullscreen */}

            <button
              onClick={() =>
                setFullscreen(true)
              }
              className="
                absolute

                right-3
                top-3

                flex

                h-11
                w-11

                items-center
                justify-center

                rounded-full

                bg-white/90

                shadow-lg

                backdrop-blur

                transition-all
                duration-300

                hover:scale-105

                sm:right-4
                sm:top-4
              "
              style={{
                color: themeColor,
              }}
            >
              <Expand size={18} />
            </button>

            {gallery.length > 1 && (
              <>

                {/* Previous */}

                <button
                  onClick={previous}
                  className="
                    absolute

                    left-3
                    top-1/2

                    flex

                    h-11
                    w-11

                    -translate-y-1/2

                    items-center
                    justify-center

                    rounded-full

                    bg-white/95

                    shadow-xl

                    transition-all
                    duration-300

                    hover:scale-105

                    sm:left-5
                  "
                  style={{
                    color: themeColor,
                  }}
                >
                  <ChevronLeft size={22} />
                </button>

                {/* Next */}

                <button
                  onClick={next}
                  className="
                    absolute

                    right-3
                    top-1/2

                    flex

                    h-11
                    w-11

                    -translate-y-1/2

                    items-center
                    justify-center

                    rounded-full

                    bg-white/95

                    shadow-xl

                    transition-all
                    duration-300

                    hover:scale-105

                    sm:right-5
                  "
                  style={{
                    color: themeColor,
                  }}
                >
                  <ChevronRight size={22} />
                </button>

              </>
            )}

            <div
              className="
                absolute

                bottom-4
                left-1/2

                -translate-x-1/2

                rounded-full

                px-4
                py-2

                text-xs
                font-semibold

                text-white

                backdrop-blur
              "
              style={{
                background:
                  `${themeColor}CC`,
              }}
            >
              {active + 1} / {gallery.length}
            </div>

          </div>

        </div>

                {gallery.length > 1 && (

          <div
            className="
              grid

              grid-cols-5

              gap-3

              sm:gap-4
            "
          >

            {gallery.map(
              (
                image,
                index
              ) => (

                <button
                  key={index}
                  onClick={() => {

                    if (
                      index === active
                    )
                      return;

                    setLoaded(false);

                    setActive(index);

                  }}
                  className="
                    relative

                    aspect-square

                    overflow-hidden

                    rounded-2xl

                    border-2

                    transition-all
                    duration-300

                    hover:-translate-y-1
                  "
                  style={{
                    borderColor:
                      active === index
                        ? themeColor
                        : `${themeColor}30`,
                  }}
                >

                  <Image
                    src={image}
                    alt={`${productName}-${index}`}
                    fill
                    className="
                      object-cover

                      transition-transform
                      duration-300

                      hover:scale-105
                    "
                  />

                  {active ===
                    index && (

                    <div
                      className="
                        absolute
                        inset-0

                        rounded-2xl
                      "
                      style={{
                        background:
                          `${themeColor}18`,
                      }}
                    />

                  )}

                </button>

              )
            )}

          </div>

        )}

      </div>

      {fullscreen && (

        <div
          className="
            fixed

            inset-0

            z-[9999]

            bg-black/95
          "
        >

          <button
            onClick={() =>
              setFullscreen(
                false
              )
            }
            className="
              absolute

              right-5
              top-5

              z-50

              flex

              h-12
              w-12

              items-center
              justify-center

              rounded-full

              bg-white

              shadow-xl
            "
            style={{
              color:
                themeColor,
            }}
          >
            <X size={24} />
          </button>

          <button
            onClick={previous}
            className="
              absolute

              left-5
              top-1/2

              z-50

              flex

              h-12
              w-12

              -translate-y-1/2

              items-center
              justify-center

              rounded-full

              bg-white

              shadow-xl
            "
            style={{
              color:
                themeColor,
            }}
          >
            <ChevronLeft
              size={26}
            />
          </button>

          <button
            onClick={next}
            className="
              absolute

              right-5
              top-1/2

              z-50

              flex

              h-12
              w-12

              -translate-y-1/2

              items-center
              justify-center

              rounded-full

              bg-white

              shadow-xl
            "
            style={{
              color:
                themeColor,
            }}
          >
            <ChevronRight
              size={26}
            />
          </button>

          <div
            className="
              flex

              h-full
              w-full

              items-center
              justify-center

              p-6

              lg:p-12
            "
          >

            <div
              className="
                relative

                h-full
                w-full

                max-w-7xl
              "
            >

              <Image
                src={
                  gallery[
                    active
                  ]
                }
                alt={
                  productName
                }
                fill
                priority
                className="object-contain"
              />

            </div>

          </div>

          <div
            className="
              absolute

              bottom-8
              left-1/2

              -translate-x-1/2

              rounded-full

              px-5
              py-2

              text-sm

              font-semibold

              text-white
            "
            style={{
              background:
                `${themeColor}CC`,
            }}
          >
            {active + 1} / {gallery.length}
          </div>

        </div>

      )}

    </>

  );

}