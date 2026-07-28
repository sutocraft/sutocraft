import Container from "./Container";

const products = [
  {
    id: 1,
    name: "Premium T-Shirt",
    price: "$29.99",
    oldPrice: "$39.99",
  },
  {
    id: 2,
    name: "Premium T-Shirt",
    price: "$29.99",
    oldPrice: "$39.99",
  },
  {
    id: 3,
    name: "Premium T-Shirt",
    price: "$29.99",
    oldPrice: "$39.99",
  },
  {
    id: 4,
    name: "Premium T-Shirt",
    price: "$29.99",
    oldPrice: "$39.99",
  },
];

export default function FeaturedProducts() {
  return (
    <section className="bg-[#F8F5EE] py-16 lg:py-20">
      <Container>
        {/* Header */}
        <div className="mb-10 text-center lg:mb-14">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#98691D] sm:text-sm">
            Featured Collection
          </p>

          <h2 className="mt-3 text-3xl font-bold text-[#2B2B2B] sm:text-4xl">
            Best Selling Products
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm text-gray-500 sm:text-base">
            Discover our handpicked premium t-shirts.
          </p>
        </div>

        {/* Products */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="group overflow-hidden rounded-2xl bg-white shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl"
            >
              {/* Image */}
              <div className="relative overflow-hidden bg-[#F8F5EE]">

                <span className="absolute left-3 top-3 z-10 rounded-full bg-[#98691D] px-2 py-1 text-[10px] font-semibold text-white sm:px-3 sm:text-xs">
                  NEW
                </span>

                <button className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white shadow transition hover:bg-[#98691D] hover:text-white">
                  ♡
                </button>

                <div className="flex aspect-square items-center justify-center transition duration-500 group-hover:scale-110">
                  <div className="text-center">
                    <div className="text-5xl sm:text-6xl">
                      👕
                    </div>

                    <p className="mt-2 text-xs text-gray-400 sm:text-sm">
                      Product Image
                    </p>
                  </div>
                </div>

              </div>

              {/* Content */}
              <div className="p-4 lg:p-5">

                <div className="mb-2 text-xs text-yellow-500 sm:text-sm">
                  ★★★★★
                  <span className="ml-2 text-gray-500">
                    (24 Reviews)
                  </span>
                </div>

                <h3 className="line-clamp-2 text-sm font-semibold text-[#2B2B2B] sm:text-lg">
                  {product.name}
                </h3>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className="text-xl font-bold text-[#98691D] sm:text-2xl">
                    {product.price}
                  </span>

                  <span className="text-xs text-gray-400 line-through sm:text-sm">
                    {product.oldPrice}
                  </span>
                </div>

                <button className="mt-5 w-full rounded-xl bg-[#98691D] py-2.5 text-sm font-semibold text-white transition hover:bg-[#B48630] sm:py-3">
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