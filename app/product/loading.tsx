import ProductsSkeleton from "./ProductsSkeleton";

export default function Loading() {
  return (
    <main className="min-h-screen bg-[#F8F5EE]">
      <div className="border-b border-[#E8E1CE] bg-white">
        <div className="mx-auto max-w-[1600px] px-4 py-8 sm:px-6 lg:px-8">
          <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />

          <div className="mt-6 h-12 w-72 animate-pulse rounded bg-gray-200" />

          <div className="mt-3 h-4 w-96 max-w-full animate-pulse rounded bg-gray-200" />
        </div>
      </div>

      <div
  className="
    grid
    w-full
    grid-cols-2
    items-start
    justify-items-stretch
    gap-3

    sm:gap-4
    md:grid-cols-3
    xl:grid-cols-4
  "
>
  {Array.from({ length: 8 }).map((_, index) => (
    <ProductsSkeleton key={index} />
  ))}
</div>
    </main>
  );
}