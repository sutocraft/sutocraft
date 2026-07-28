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
    <section className="bg-[#F8F5EE] py-16 lg:py-20">
      <Container>
        {/* Header */}
        <div className="mb-10 text-center lg:mb-14">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#98691D] sm:text-sm">
            Shop By Category
          </p>

          <h2 className="mt-3 text-3xl font-bold text-[#2B2B2B] sm:text-4xl">
            Browse Categories
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm text-gray-500 sm:text-base">
            Find your favorite style from our collections.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6 lg:gap-6">
          {categories.map((category) => (
            <div
              key={category.id}
              className="group cursor-pointer rounded-2xl border border-[#E8E1CE] bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#98691D] hover:shadow-lg lg:rounded-3xl lg:p-6"
            >
              <div className="flex justify-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#F8F5EE] text-3xl transition duration-300 group-hover:scale-110 sm:h-16 sm:w-16 sm:text-4xl">
                  {category.image}
                </div>
              </div>

              <h3 className="mt-4 text-center text-sm font-semibold text-[#2B2B2B] sm:text-base lg:mt-5 lg:text-lg">
                {category.name}
              </h3>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}