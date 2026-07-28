import Container from "./Container";

export default function Newsletter() {
  return (
    <section className="bg-[#98691D] py-24">
      <Container>
        <div className="mx-auto max-w-4xl text-center">

          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#F6E4B5]">
            Stay Connected
          </p>

          <h2 className="mt-4 text-4xl font-bold text-white lg:text-5xl">
            Subscribe To Our Newsletter
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-[#F8EFD9]">
            Get exclusive offers, new arrivals and special discounts delivered
            directly to your inbox.
          </p>

          <div className="mx-auto mt-10 flex max-w-2xl flex-col gap-4 sm:flex-row">

            <input
              type="email"
              placeholder="Enter your email address"
              className="h-14 flex-1 rounded-xl border-0 bg-white px-6 text-lg outline-none"
            />

            <button className="h-14 rounded-xl bg-[#2B2B2B] px-10 font-semibold text-white transition hover:bg-black">
              Subscribe
            </button>

          </div>

        </div>
      </Container>
    </section>
  );
}