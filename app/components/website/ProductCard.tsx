import Container from "./Container";

const features = [
  {
    id: 1,
    icon: "🚚",
    title: "Free Shipping",
    description: "Free delivery on all orders over $100.",
  },
  {
    id: 2,
    icon: "💳",
    title: "Secure Payment",
    description: "100% secure online payment gateway.",
  },
  {
    id: 3,
    icon: "↩️",
    title: "Easy Returns",
    description: "7-day hassle-free return policy.",
  },
  {
    id: 4,
    icon: "⭐",
    title: "Premium Quality",
    description: "High-quality fabrics with lasting comfort.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="bg-[#F8F5EE] py-16 lg:py-20">
      <Container>
        {/* Header */}
        <div className="mb-10 text-center lg:mb-14">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#98691D] sm:text-sm">
            Why Choose Us
          </p>

          <h2 className="mt-3 text-3xl font-bold text-[#2B2B2B] sm:text-4xl">
            Shopping Made Better
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm text-gray-500 sm:text-base">
            Everything you need for a smooth shopping experience.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-8">
          {features.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl bg-white p-5 text-center shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl lg:rounded-3xl lg:p-8"
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#98691D]/10 text-3xl sm:h-16 sm:w-16 sm:text-4xl lg:h-20 lg:w-20 lg:text-5xl">
                {item.icon}
              </div>

              <h3 className="mt-5 text-base font-bold text-[#2B2B2B] sm:text-lg lg:text-xl">
                {item.title}
              </h3>

              <p className="mt-3 text-sm leading-6 text-gray-500 lg:text-base lg:leading-7">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}