"use client";

import { useState } from "react";
import { FileText, ClipboardList, Star } from "lucide-react";
import { useTheme } from "./settings.theme_color";

type Props = {
  description?: string | null;
  specification?: string | null;
  reviews?: {
    id: string;
    name: string;
    rating: number;
    comment: string;
    created_at?: string;
  }[];
};

export default function ProductTabs({
  description,
  specification,
  reviews = [],
}: Props) {
  const [tab, setTab] = useState<
    "description" | "specification" | "reviews"
  >("description");

  const { themeColor } = useTheme();

    const tabs = [
    {
      id: "description",
      label: "Description",
      icon: FileText,
    },
    {
      id: "specification",
      label: "Specification",
      icon: ClipboardList,
    },
    {
      id: "reviews",
      label: "Reviews",
      icon: Star,
    },
  ] as const;

  return (
    <div className="mt-12">

      <div
        className="
          flex
          flex-wrap
          gap-3

          rounded-2xl
          bg-white
          p-2
          shadow-sm
        "
      >

        {tabs.map((item) => {

          const Icon = item.icon;
          const active = tab === item.id;

          return (

            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              className="
                flex
                items-center
                gap-2

                rounded-xl

                px-5
                py-3

                text-sm
                font-semibold

                transition-all
                duration-300
              "
              style={{
                background: active
                  ? themeColor
                  : "transparent",

                color: active
                  ? "#FFFFFF"
                  : themeColor,
              }}
            >

              <Icon size={17} />

              {item.label}

            </button>

          );

        })}

      </div>

            <div
        className="
          mt-6

          rounded-3xl

          border

          bg-white

          p-6

          shadow-sm

          sm:p-8
        "
        style={{
          borderColor: "var(--theme-color-15)",
        }}
      >

        {tab === "description" && (

          <div
            className="
              prose

              max-w-none

              leading-8

              text-gray-700
            "
          style={{
                  color: themeColor,
                }}
              >

            {description ? (

              <div
                dangerouslySetInnerHTML={{
                  __html: description,
                }}
              />

            ) : (

              <p
                style={{
                  color: themeColor,
                }}
              >
                No description available.
              </p>

            )}

          </div>

        )}

        {tab === "specification" && (

          <div
            className="
              prose

              max-w-none

              leading-8

              text-gray-700
            "
          style={{
                  color: themeColor,
                }}
              >

            {specification ? (

              <div
                dangerouslySetInnerHTML={{
                  __html: specification,
                }}
              />

            ) : (

              <p
                style={{
                  color: themeColor,
                }}
              >
                No specification available.
              </p>

            )}

          </div>

        )}

                {tab === "reviews" && (

          <div className="space-y-5">

            {reviews.length > 0 ? (

              reviews.map((review) => (

                <div
                  key={review.id}
                  className="
                    rounded-2xl

                    border

                    bg-white

                    p-5

                    transition-all
                    duration-300
                  "
                  style={{
                    borderColor: "var(--theme-color-15)",
                  }}
                >

                  <div
                    className="
                      flex

                      flex-wrap

                      items-center

                      justify-between

                      gap-3
                    "
                  >

                    <div>

                      <h4
                        className="
                          text-base

                          font-bold
                        "
                        style={{
                          color:
                            themeColor,
                        }}
                      >
                        {review.name}
                      </h4>

                      <div
                        className="
                          mt-2

                          flex

                          items-center

                          gap-1

                          text-yellow-500
                        "
                      >
                        {Array.from({
                          length:
                            review.rating,
                        }).map(
                          (_, i) => (
                            <span
                              key={i}
                            >
                              ★
                            </span>
                          )
                        )}
                      </div>

                    </div>

                    <span
                      className="
                        text-sm

                        text-gray-500
                      "
                    style={{
                  color: themeColor,
                }}
              >
                      {review.created_at}
                    </span>

                  </div>

                  <p
                    className="
                      mt-4

                      leading-7

                      text-gray-600
                    "
                  >
                    {review.comment}
                  </p>

                </div>

              ))

            ) : (

              <div
                className="
                  rounded-3xl

                  border

                  bg-white

                  py-16

                  text-center
                "
                style={{
                  borderColor: "var(--theme-color-20)",
                }}
              >

                <div className="text-6xl">
                  ⭐
                </div>

                <h3
                  className="
                    mt-5

                    text-xl

                    font-bold
                  "
                  style={{
                    color:
                      themeColor,
                  }}
                >
                  No Reviews Yet
                </h3>

                <p
                  className="
                    mt-3

                    text-gray-500
                  "
                >
                  Be the first customer
                  to review this product.
                </p>

              </div>

            )}

          </div>

        )}

      </div>

    </div>

  );

}

