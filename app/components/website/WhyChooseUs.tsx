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
    <section className="bg-[#F8F5EE] py-20">
      <Container>
        <div className="mb-14 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#98691D]">
            Why Choose Us
          </p>

          <h2 className="mt-3 text-4xl font-bold text-[#2B2B2B]">
            Shopping Made Better
          </h2>

          <p className="mt-4 text-gray-500">
            Everything you need for a smooth shopping experience.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((item) => (
            <div
              key={item.id}
              className="rounded-3xl bg-white p-8 text-center shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl"
            >
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#98691D]/10 text-5xl">
                {item.icon}
              </div>

              <h3 className="mt-6 text-xl font-bold text-[#2B2B2B]">
                {item.title}
              </h3>

              <p className="mt-3 leading-7 text-gray-500">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}