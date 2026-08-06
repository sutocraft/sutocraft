"use client";

import { useState } from "react";
import {
  FileText,
  ListChecks,
  MessageSquare,
} from "lucide-react";

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

const tabs = [
  {
    id: "description",
    label: "Description",
    icon: FileText,
  },
  {
    id: "specification",
    label: "Specification",
    icon: ListChecks,
  },
  {
    id: "reviews",
    label: "Reviews",
    icon: MessageSquare,
  },
] as const;

export default function ProductTabs({
  description,
  specification,
  reviews = [],
}: Props) {

  const [activeTab, setActiveTab] =
    useState<
      "description" |
      "specification" |
      "reviews"
    >("description");

  return (

    <div className="mt-12">

      {/* Tabs */}

      <div className="flex flex-wrap gap-3 rounded-2xl bg-[#F8F5EE] p-2">

        {tabs.map((tab) => {

          const Icon = tab.icon;

          return (

            <button
              key={tab.id}
              onClick={() =>
                setActiveTab(tab.id)
              }
              className={`flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-all duration-300 ${
                activeTab === tab.id
                  ? "bg-[#98691D] text-white shadow-lg"
                  : "text-[#2B2B2B] hover:bg-white"
              }`}
            >

              <Icon size={18} />

              {tab.label}

            </button>

          );

        })}

      </div>

      {/* Content */}

      <div className="mt-6 rounded-3xl border border-[#E8E1CE] bg-white p-6">

        {activeTab === "description" && (

          <div className="prose prose-sm max-w-none text-gray-700">

            {description ? (

              <div
                dangerouslySetInnerHTML={{
                  __html: description,
                }}
              />

            ) : (

              <p>
                No description available.
              </p>

            )}

          </div>

        )}

                {activeTab === "specification" && (

          <div className="space-y-4">

            {specification ? (

              <div
                className="prose prose-sm max-w-none text-gray-700"
                dangerouslySetInnerHTML={{
                  __html: specification,
                }}
              />

            ) : (

              <div className="rounded-2xl bg-[#F8F5EE] p-6 text-center text-gray-500">

                No specification available.

              </div>

            )}

          </div>

        )}

        {activeTab === "reviews" && (

          <div className="space-y-5">

            {reviews.length > 0 ? (

              reviews.map((review) => (

                <div
                  key={review.id}
                  className="rounded-2xl border border-[#E8E1CE] p-5"
                >

                  <div className="flex items-center justify-between">

                    <h4 className="font-semibold text-[#2B2B2B]">
                      {review.name}
                    </h4>

                    <span className="text-sm text-gray-500">
                      {review.created_at}
                    </span>

                  </div>

                  <div className="mt-2 flex items-center gap-1 text-yellow-500">

                    {Array.from({
                      length: review.rating,
                    }).map((_, index) => (

                      <span key={index}>
                        ★
                      </span>

                    ))}

                  </div>

                  <p className="mt-4 leading-7 text-gray-600">
                    {review.comment}
                  </p>

                </div>

              ))

            ) : (

              <div className="rounded-2xl bg-[#F8F5EE] py-14 text-center">

                <div className="text-5xl">
                  ⭐
                </div>

                <h3 className="mt-4 text-lg font-bold text-[#2B2B2B]">
                  No Reviews Yet
                </h3>

                <p className="mt-2 text-gray-500">
                  Be the first customer to review this product.
                </p>

              </div>

            )}

          </div>

        )}
        
              </div>

    </div>

  );
}

