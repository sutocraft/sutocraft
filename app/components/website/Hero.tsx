import Container from "./Container";

export default function Hero() {
  return (
    <section className="bg-[#F8F5EE]">
      <Container>
        <div className="grid items-center gap-12 py-16 lg:min-h-[620px] lg:grid-cols-2 lg:gap-20">

          {/* Left */}
          <div className="order-2 text-center lg:order-1 lg:text-left">

            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.4em] text-[#98691D] sm:text-sm">
              New Collection 2026
            </p>

            <h1 className="text-5xl font-extrabold leading-tight text-[#1F2937] sm:text-6xl xl:text-7xl">
              Wear Your <br />
              Style
            </h1>

            <p className="mx-auto mt-6 max-w-xl text-base leading-8 text-gray-600 lg:mx-0 lg:text-lg">
              Premium Quality T-Shirts Crafted for Everyday Comfort.
              Discover timeless designs made for every season.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">

              <button className="rounded-xl bg-[#98691D] px-8 py-4 font-semibold text-white transition hover:bg-[#B48630]">
                Shop Now
              </button>

              <button className="rounded-xl border border-[#98691D] px-8 py-4 font-semibold text-[#98691D] transition hover:bg-[#98691D] hover:text-white">
                Explore Collection
              </button>

            </div>

          </div>

          {/* Right */}
          <div className="order-1 flex justify-center lg:order-2 lg:justify-end">

            <div className="flex h-[280px] w-full max-w-[320px] items-center justify-center rounded-[30px] border-2 border-dashed border-[#D8BE8A] bg-white shadow-sm sm:h-[360px] sm:max-w-[420px] lg:h-[460px] lg:max-w-[520px]">

              <div className="text-center">

                <div className="mb-5 text-6xl sm:text-7xl">
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
      </Container>
    </section>
  );
}