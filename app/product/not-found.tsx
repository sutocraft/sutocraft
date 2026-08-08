import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F8F5EE] px-4">
      <div className="w-full max-w-lg rounded-3xl border border-[#E8E1CE] bg-white px-6 py-12 text-center shadow-sm sm:px-10">

        <div className="text-6xl">
          🛍️
        </div>

        <p className="mt-6 text-sm font-semibold uppercase tracking-[0.3em] text-[#98691D]">
          SutoCraft
        </p>

        <h1 className="mt-3 text-3xl font-bold text-[#2B2B2B]">
          Products Not Found
        </h1>

        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-gray-500">
          We couldn't find the products page you're looking for.
        </p>

        <Link
          href="/"
          className="mt-7 inline-flex h-12 items-center justify-center rounded-2xl bg-[#98691D] px-7 text-sm font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
        >
          Back To Home
        </Link>

      </div>
    </main>
  );
}