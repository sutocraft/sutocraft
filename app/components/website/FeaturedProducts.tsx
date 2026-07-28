import Container from "./Container";

export default function FeaturedProducts() {
  return (
    <section className="bg-white py-24">
      <Container>
        {/* Section Header */}
        <div className="mb-14 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#98691D]">
            Featured Collection
          </p>

          <h2 className="mt-3 text-4xl font-bold text-[#2B2B2B]">
            Best Selling Products
          </h2>

          <p className="mt-4 text-gray-500">
            Discover our handpicked premium t-shirts.
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">

          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="group overflow-hidden rounded-3xl border border-gray-200 bg-white transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
            >
              {/* Product Image */}
              <div className="relative flex h-80 items-center justify-center overflow-hidden bg-[#F8F5EE]">

                {/* Badge */}
                <span className="absolute left-4 top-4 rounded-full bg-[#98691D] px-3 py-1 text-xs font-semibold text-white">
                  NEW
                </span>

                {/* Wishlist */}
                <button className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md transition-all duration-300 hover:bg-[#98691D] hover:text-white">
                  ♡
                </button>

                <div className="text-center transition duration-500 group-hover:scale-110">
                  <div className="mb-3 text-6xl">
                    👕
                  </div>

                  <p className="text-gray-400">
                    Product Image
                  </p>
                </div>

              </div>

              {/* Content */}
              <div className="p-6">

                <h3 className="text-xl font-semibold text-[#2B2B2B]">
                  Premium T-Shirt
                </h3>

                {/* Rating */}
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-yellow-500">
                    ★★★★★
                  </span>

                  <span className="text-sm text-gray-500">
                    (24 Reviews)
                  </span>
                </div>

                {/* Price */}
                <div className="mt-4 flex items-center gap-3">

                  <span className="text-2xl font-bold text-[#98691D]">
                    $29.99
                  </span>

                  <span className="text-lg text-gray-400 line-through">
                    $39.99
                  </span>

                </div>

                <button className="mt-6 w-full rounded-xl bg-[#98691D] py-3 font-semibold text-white transition duration-300 hover:bg-[#B48630]">
                  Add to Cart
                </button>

              </div>

            </div>
          ))}

        </div>
      </Container>
    </section>
  );
}