export default function Hero() {
  return (
    <section className="bg-[#F8F5EE]">
      <div className="mx-auto flex w-full items-center justify-between gap-12 px-6 py-20 lg:px-16 xl:px-24 2xl:px-32">

        {/* Left Side */}
        <div className="flex-1">

          <p className="mb-5 text-sm font-semibold uppercase tracking-[0.35em] text-[#98691D]">
            New Collection 2026
          </p>

          <h1 className="text-5xl font-extrabold leading-tight text-[#1F2937] xl:text-7xl">
            Wear Your Style
          </h1>

          <p className="mt-8 max-w-2xl text-lg leading-9 text-gray-600">
            Premium Quality T-Shirts Crafted for Everyday Comfort.
            Discover timeless designs made for every season.
          </p>

          <div className="mt-10 flex flex-wrap gap-5">

            <button className="rounded-xl bg-[#98691D] px-8 py-4 font-semibold text-white transition hover:bg-[#B48630]">
              Shop Now
            </button>

            <button className="rounded-xl border border-[#98691D] px-8 py-4 font-semibold text-[#98691D] transition hover:bg-[#98691D] hover:text-white">
              Explore Collection
            </button>

          </div>

        </div>

        {/* Right Side */}
        <div className="flex flex-1 justify-end">

          <div className="flex aspect-square w-full max-w-[520px] items-center justify-center rounded-[32px] border-2 border-dashed border-[#D8BE8A] bg-white shadow-sm">

            <div className="text-center">

              <div className="mb-5 text-6xl">
                🖼️
              </div>

              <h3 className="text-2xl font-bold text-[#98691D]">
                Hero Banner
              </h3>

              <p className="mt-3 text-gray-500">
                Image will load from
              </p>

              <p className="font-semibold text-gray-700">
                Admin Panel
              </p>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}