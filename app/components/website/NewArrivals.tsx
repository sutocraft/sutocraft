import Container from "./Container";

const products = [
  {
    id: 1,
    name: "Premium Black T-Shirt",
    price: "$29.99",
    oldPrice: "$39.99",
  },
  {
    id: 2,
    name: "Classic White T-Shirt",
    price: "$24.99",
    oldPrice: "$34.99",
  },
  {
    id: 3,
    name: "Oversized Beige Tee",
    price: "$31.99",
    oldPrice: "$42.99",
  },
  {
    id: 4,
    name: "Cotton Polo Shirt",
    price: "$34.99",
    oldPrice: "$44.99",
  },
];

export default function NewArrivals() {
  return (
    <section className="bg-white py-16 lg:py-20">
      <Container>
        {/* Header */}
        <div className="mb-10 text-center lg:mb-14">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#98691D] sm:text-sm">
            New Arrivals
          </p>

          <h2 className="mt-3 text-3xl font-bold text-[#2B2B2B] sm:text-4xl">
            Just Arrived
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm text-gray-500 sm:text-base">
            Fresh styles added to our latest collection.
          </p>
        </div>

        {/* Products */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="group overflow-hidden rounded-2xl border border-[#E8E1CE] bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl lg:rounded-3xl"
            >
              {/* Image */}
              <div className="relative flex aspect-[4/5] items-center justify-center bg-[#F8F5EE]">

                <span className="absolute left-3 top-3 rounded-full bg-[#98691D] px-2 py-1 text-[10px] font-semibold text-white sm:left-4 sm:top-4 sm:px-3 sm:text-xs">
                  NEW
                </span>

                <div className="text-center transition duration-300 group-hover:scale-110">
                  <div className="text-5xl sm:text-6xl">
                    👕
                  </div>

                  <p className="mt-2 text-xs text-gray-400 sm:text-sm">
                    Product Image
                  </p>
                </div>

              </div>

              {/* Content */}
              <div className="p-4 lg:p-6">

                <h3 className="line-clamp-2 text-sm font-semibold text-[#2B2B2B] sm:text-base lg:text-lg">
                  {product.name}
                </h3>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className="text-lg font-bold text-[#98691D] sm:text-xl">
                    {product.price}
                  </span>

                  <span className="text-xs text-gray-400 line-through sm:text-sm">
                    {product.oldPrice}
                  </span>
                </div>

                <button className="mt-5 w-full rounded-xl bg-[#98691D] py-2.5 text-sm font-semibold text-white transition hover:bg-[#B48630] sm:py-3">
                  Add To Cart
                </button>

              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}