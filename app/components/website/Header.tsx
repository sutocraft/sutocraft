import Container from "./Container";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#E8E1CE] bg-white/95 backdrop-blur">
      <Container>
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <a
            href="/"
            className="text-4xl font-bold tracking-tight text-[#98691D] xl:text-5xl"
          >
            SutoCraft
          </a>

          {/* Navigation */}
          <nav className="flex flex-1 items-center justify-center gap-8 px-8">
            <a
              href="/"
              className="font-semibold text-[#2B2B2B] transition hover:text-[#98691D]"
            >
              Home
            </a>

            <a
              href="/products"
              className="font-semibold text-[#2B2B2B] transition hover:text-[#98691D]"
            >
              Products
            </a>

            <a
              href="/about"
              className="font-semibold text-[#2B2B2B] transition hover:text-[#98691D]"
            >
              About
            </a>

            <a
              href="/contact"
              className="font-semibold text-[#2B2B2B] transition hover:text-[#98691D]"
            >
              Contact
            </a>
          </nav>

          {/* Right */}
          <div className="flex shrink-0 items-center gap-3">
            <button className="rounded-xl border border-[#98691D] px-6 py-3 font-semibold text-[#98691D] transition hover:bg-[#98691D] hover:text-white">
              Login
            </button>

            <button className="rounded-xl bg-[#98691D] px-6 py-3 font-semibold text-white transition hover:bg-[#B48630]">
              Cart (0)
            </button>
          </div>
        </div>
      </Container>
    </header>
  );
}