import Container from "./Container";
import {
  Facebook,
  Youtube,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-[#1F1F1F] pb-28 text-white lg:pb-0">
      <Container>
        {/* Top */}
        <div className="grid gap-10 py-16 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12 lg:py-20">

          {/* Company */}
          <div>
            <h2 className="text-3xl font-bold text-[#D9A441]">
              SutoCraft
            </h2>

            <p className="mt-5 text-sm leading-7 text-gray-400 lg:text-base">
              Premium quality T-Shirts crafted for everyday comfort.
              Designed with style, quality and durability for every occasion.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-5 text-xl font-semibold">
              Quick Links
            </h3>

            <ul className="space-y-3 text-sm text-gray-400 lg:text-base">
              <li>
                <a href="/" className="transition hover:text-[#D9A441]">
                  Home
                </a>
              </li>

              <li>
                <a
                  href="/products"
                  className="transition hover:text-[#D9A441]"
                >
                  Products
                </a>
              </li>

              <li>
                <a
                  href="/about"
                  className="transition hover:text-[#D9A441]"
                >
                  About Us
                </a>
              </li>

              <li>
                <a
                  href="/contact"
                  className="transition hover:text-[#D9A441]"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-5 text-xl font-semibold">
              Contact
            </h3>

            <div className="space-y-3 text-sm text-gray-400 lg:text-base">

              <p>
                📍 Kumira, Sitakunda, Chittagong
              </p>

              <p>
                📞{" "}
                <a
                  href="tel:+8801616964247"
                  className="hover:text-[#D9A441]"
                >
                  +880 1616-964247
                </a>
              </p>

              <p>
                ✉️{" "}
                <a
                  href="mailto:sutocraftbd@gmail.com"
                  className="hover:text-[#D9A441]"
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
                  className="hover:text-[#D9A441]"
                >
                  www.sutocraftbd.com
                </a>
              </p>

            </div>
          </div>

          {/* Social */}
          <div>
            <h3 className="mb-5 text-xl font-semibold">
              Follow Us
            </h3>

            <div className="space-y-3 text-sm text-gray-400 lg:text-base">

              <a
                href="https://www.facebook.com/share/1KCQqtBzLU/"
                target="_blank"
                rel="noopener noreferrer"
                className="block transition hover:text-[#D9A441]"
              >
                Facebook
              </a>

              <a
                href="https://youtube.com/@sutocraft?si=mIN7Bmmq-WeFOno1"
                target="_blank"
                rel="noopener noreferrer"
                className="block transition hover:text-[#D9A441]"
              >
                YouTube
              </a>

              <a
                href="https://wa.me/8801616964247"
                target="_blank"
                rel="noopener noreferrer"
                className="block transition hover:text-[#25D366]"
              >
                WhatsApp
              </a>

            </div>

            {/* Social Buttons */}
            <div className="mt-6 flex flex-wrap gap-3">

              <a
                href="https://www.facebook.com/share/1KCQqtBzLU/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-[#2F2F2F] transition hover:bg-[#D9A441]"
              >
                <Facebook size={20} />
              </a>

              <a
                href="https://youtube.com/@sutocraft?si=mIN7Bmmq-WeFOno1"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-[#2F2F2F] transition hover:bg-red-600"
              >
                <Youtube size={20} />
              </a>

              <a
                href="https://wa.me/8801616964247"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-[#2F2F2F] transition hover:bg-[#25D366]"
              >
                <FaWhatsapp size={20} />
              </a>

            </div>
          </div>

        </div>

        {/* Bottom */}
        <div className="border-t border-[#3A3A3A] py-6">

          <div className="flex flex-col items-center justify-between gap-4 text-center text-sm text-gray-400 lg:flex-row">

            <p>
              © {new Date().getFullYear()} SutoCraft. All Rights Reserved.
            </p>

            <p>
              Made with ❤️ in Bangladesh
            </p>

          </div>

        </div>
      </Container>
    </footer>
  );
}