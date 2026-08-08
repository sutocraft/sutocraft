export default function ProductsSkeleton() {
  return (
    <article className="overflow-hidden rounded-3xl border border-[#E8E1CE] bg-white shadow-sm">
      {/* Image Skeleton */}
      <div className="aspect-[4/5] animate-pulse bg-[#F3EFE6]" />

      {/* Content Skeleton */}
      <div className="space-y-3 p-4 sm:p-5">

        {/* Rating */}
        <div className="h-4 w-20 animate-pulse rounded-full bg-gray-200" />

        {/* Product Name */}
        <div className="space-y-2">
          <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-2/3 animate-pulse rounded bg-gray-200" />
        </div>

        {/* Price */}
        <div className="h-6 w-24 animate-pulse rounded bg-gray-200" />

        {/* Button */}
        <div className="mt-4 h-11 w-full animate-pulse rounded-2xl bg-gray-200" />

      </div>
    </article>
  );
}