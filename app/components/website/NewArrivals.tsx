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
    <section className="bg-white py-20">
      <Container>
        {/* Header */}
        <div className="mb-14 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#98691D]">
            New Arrivals
          </p>

          <h2 className="mt-3 text-4xl font-bold text-[#2B2B2B]">
            Just Arrived
          </h2>

          <p className="mt-4 text-gray-500">
            Fresh styles added to our latest collection.
          </p>
        </div>

        {/* Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="group overflow-hidden rounded-3xl border border-[#E8E1CE] bg-white transition duration-300 hover:-translate-y-2 hover:shadow-xl"
            >
              {/* Image */}
              <div className="relative flex h-80 items-center justify-center bg-[#F8F5EE]">
                <span className="absolute left-4 top-4 rounded-full bg-[#98691D] px-3 py-1 text-xs font-semibold text-white">
                  NEW
                </span>

                <div className="text-center transition duration-300 group-hover:scale-110">
                  <div className="mb-3 text-6xl">👕</div>
                  <p className="text-gray-400">Product Image</p>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-lg font-semibold text-[#2B2B2B]">
                  {product.name}
                </h3>

                <div className="mt-3 flex items-center gap-3">
                  <span className="text-2xl font-bold text-[#98691D]">
                    {product.price}
                  </span>

                  <span className="text-gray-400 line-through">
                    {product.oldPrice}
                  </span>
                </div>

                <button className="mt-6 w-full rounded-xl bg-[#98691D] py-3 font-semibold text-white transition hover:bg-[#B48630]">
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