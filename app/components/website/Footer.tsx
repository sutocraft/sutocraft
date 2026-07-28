import Container from "./Container";

export default function Footer() {
  return (
    <footer className="bg-[#1F1F1F] text-white">
      <Container>
        <div className="grid gap-12 py-20 md:grid-cols-2 lg:grid-cols-4">
          {/* Company */}
          <div>
            <h2 className="text-3xl font-bold text-[#D9A441]">
              SutoCraft
            </h2>

            <p className="mt-6 leading-8 text-gray-400">
              Premium quality T-Shirts crafted for everyday comfort.
              Designed with style, quality and durability for every occasion.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-6 text-xl font-semibold">
              Quick Links
            </h3>

            <ul className="space-y-4 text-gray-400">
              <li>
                <a href="/" className="transition hover:text-[#D9A441]">
                  Home
                </a>
              </li>

              <li>
                <a href="/products" className="transition hover:text-[#D9A441]">
                  Products
                </a>
              </li>

              <li>
                <a href="/about" className="transition hover:text-[#D9A441]">
                  About Us
                </a>
              </li>

              <li>
                <a href="/contact" className="transition hover:text-[#D9A441]">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="mb-6 text-xl font-semibold">
              Customer Service
            </h3>

            <ul className="space-y-4 text-gray-400">
              <li>
                <a href="#" className="transition hover:text-[#D9A441]">
                  My Account
                </a>
              </li>

              <li>
                <a href="#" className="transition hover:text-[#D9A441]">
                  Wishlist
                </a>
              </li>

              <li>
                <a href="#" className="transition hover:text-[#D9A441]">
                  Order Tracking
                </a>
              </li>

              <li>
                <a href="#" className="transition hover:text-[#D9A441]">
                  Privacy Policy
                </a>
              </li>

              <li>
                <a href="#" className="transition hover:text-[#D9A441]">
                  Terms & Conditions
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-6 text-xl font-semibold">
              Contact Information
            </h3>

            <div className="space-y-4 text-gray-400">
              <p>
                📍 Kumira, Sitakunda, Chittagong
              </p>

              <p>
                📞{" "}
                <a
                  href="tel:+8801616964247"
                  className="transition hover:text-[#D9A441]"
                >
                  +880 1616-964247
                </a>
              </p>

              <p>
                ✉️{" "}
                <a
                  href="mailto:sutocraftbd@gmail.com"
                  className="transition hover:text-[#D9A441]"
                >
                  sutocraftbd@gmail.com
                </a>
              </p>

              <p>
                🌐{" "}
                <a
                  href="https://www.sutocraftbd.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition hover:text-[#D9A441]"
                >
                  www.sutocraftbd.com
                </a>
              </p>
            </div>

            {/* Social */}
            <div className="mt-8 flex gap-4">
              <a
                href="https://www.facebook.com/share/1KCQqtBzLU/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-[#2F2F2F] transition hover:bg-[#D9A441]"
              >
                FB
              </a>

              <a
                href="https://youtube.com/@sutocraft?si=mIN7Bmmq-WeFOno1"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-[#2F2F2F] transition hover:bg-[#D9A441]"
              >
                YT
              </a>

              <a
                href="https://wa.me/8801616964247"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-[#2F2F2F] transition hover:bg-[#25D366]"
              >
                WA
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-[#3A3A3A] py-6 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} SutoCraft. All Rights Reserved.
        </div>
      </Container>
    </footer>
  );
}