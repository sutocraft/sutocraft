import Container from "./Container";

const categories = [
  {
    id: 1,
    name: "Men",
    image: "👔",
  },
  {
    id: 2,
    name: "Women",
    image: "👗",
  },
  {
    id: 3,
    name: "Oversized",
    image: "🧥",
  },
  {
    id: 4,
    name: "Polo",
    image: "👕",
  },
  {
    id: 5,
    name: "Kids",
    image: "🧒",
  },
  {
    id: 6,
    name: "Accessories",
    image: "🎒",
  },
];

export default function Categories() {
  return (
    <section className="bg-[#F8F5EE] py-24">
      <Container>
        {/* Header */}
        <div className="mb-14 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#98691D]">
            Shop By Category
          </p>

          <h2 className="mt-3 text-4xl font-bold text-[#2B2B2B]">
            Browse Categories
          </h2>

          <p className="mt-4 text-gray-500">
            Find your favorite style from our collections.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-6">
          {categories.map((category) => (
            <div
              key={category.id}
              className="group cursor-pointer rounded-3xl border border-[#E8E1CE] bg-white p-8 transition-all duration-300 hover:-translate-y-2 hover:border-[#98691D] hover:shadow-xl"
            >
              <div className="flex justify-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#F8F5EE] text-5xl transition duration-300 group-hover:scale-110">
                  {category.image}
                </div>
              </div>

              <h3 className="mt-6 text-center text-lg font-semibold text-[#2B2B2B]">
                {category.name}
              </h3>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}