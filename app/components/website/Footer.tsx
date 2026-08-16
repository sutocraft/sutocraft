import Container from "./Container";

import {
  FaWhatsapp,
  FaFacebookF,
  FaYoutube,
} from "react-icons/fa";

import Link from "next/link";

export default function Footer() {
  return (
    <footer
      className="
        border-t border-black/10
        bg-[#1F1F1F]
        text-white
        pb-28
        lg:pb-0
      "
    >
      <Container>

        {/* =====================================================
            MAIN FOOTER
           ===================================================== */}

        <div
          className="
            grid
            grid-cols-1
            gap-y-9
            py-9

            sm:grid-cols-2
            sm:gap-x-10
            sm:gap-y-10
            sm:py-11

            md:gap-x-12

            lg:grid-cols-[1.35fr_0.8fr_1.25fr_0.8fr]
            lg:gap-x-10
            lg:gap-y-0
            lg:py-12

            xl:grid-cols-[1.4fr_0.85fr_1.3fr_0.85fr]
            xl:gap-x-14
            xl:py-14
          "
        >

          {/* ===================================================
              COMPANY
             =================================================== */}

          <div className="min-w-0">

            <h2
              className="
                text-2xl
                font-bold
                leading-none
                tracking-tight
                text-[var(--theme-color)]

                sm:text-[27px]
              "
            >
              JayanHub
            </h2>

            <p
              className="
                mt-4
                max-w-[360px]
                text-[13px]
                leading-6
                text-gray-400

                sm:text-sm
              "
            >
              Premium quality T-Shirts crafted for everyday
              comfort. Designed with style, quality and
              durability for every occasion.
            </p>

            {/* Admin Login */}

            <Link
              href="/admin/login"
              className="
                mt-3
                inline-block
                text-[10px]
                text-gray-500
                opacity-[0.08]
                transition-all
                duration-300
                hover:text-[var(--theme-color)]
                hover:opacity-100
              "
            >
              Admin Login
            </Link>

            {/* Social Icons */}

            <div
              className="
                mt-3
                flex
                items-center
                gap-2.5
              "
            >

              {/* Facebook */}

              <a
                href="https://www.facebook.com/share/1KCQqtBzLU/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="
                  group
                  flex
                  h-9
                  w-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-[#2B2B2B]
                  text-gray-300
                  ring-1
                  ring-white/5
                  transition-all
                  duration-200
                  hover:-translate-y-0.5
                  hover:bg-[#1877F2]
                  hover:text-white
                  hover:ring-[var(--theme-color-30)]
                "
              >
                <FaFacebookF
                  size={15}
                  className="transition-transform group-hover:scale-110"
                />
              </a>

              {/* YouTube */}

              <a
                href="https://youtube.com/@sutocraft?si=mIN7Bmmq-WeFOno1"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="
                  group
                  flex
                  h-9
                  w-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-[#2B2B2B]
                  text-gray-300
                  ring-1
                  ring-white/5
                  transition-all
                  duration-200
                  hover:-translate-y-0.5
                  hover:bg-[#E53935]
                  hover:text-white
                  hover:ring-red-500/30
                "
              >
                <FaYoutube
                  size={15}
                  className="transition-transform group-hover:scale-110"
                />
              </a>

              {/* WhatsApp */}

              <a
                href="https://wa.me/8801616964247"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="
                  group
                  flex
                  h-9
                  w-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-[#2B2B2B]
                  text-gray-300
                  ring-1
                  ring-white/5
                  transition-all
                  duration-200
                  hover:-translate-y-0.5
                  hover:bg-[#25D366]
                  hover:text-white
                  hover:ring-green-500/30
                "
              >
                <FaWhatsapp
                  size={16}
                  className="transition-transform group-hover:scale-110"
                />
              </a>

            </div>
          </div>


          {/* ===================================================
              QUICK LINKS
             =================================================== */}

          <div className="min-w-0">

            <h3
              className="
                mb-4
                text-[15px]
                font-semibold
                leading-none
                text-white

                sm:text-base
              "
            >
              Quick Links
            </h3>

            <ul
              className="
                space-y-2
                text-[13px]
                leading-5
                text-gray-400
              "
            >

              <li>
                <Link
                  href="/"
                  className="
                    inline-flex
                    transition-all
                    duration-200
                    hover:translate-x-0.5
                    hover:text-[var(--theme-color)]
                  "
                >
                  Home
                </Link>
              </li>

              <li>
                <Link
                  href="/product"
                  className="
                    inline-flex
                    transition-all
                    duration-200
                    hover:translate-x-0.5
                    hover:text-[var(--theme-color)]
                  "
                >
                  Products
                </Link>
              </li>

              <li>
                <Link
                  href="/about"
                  className="
                    inline-flex
                    transition-all
                    duration-200
                    hover:translate-x-0.5
                    hover:text-[var(--theme-color)]
                  "
                >
                  About Us
                </Link>
              </li>

              <li>
                <Link
                  href="/contact"
                  className="
                    inline-flex
                    transition-all
                    duration-200
                    hover:translate-x-0.5
                    hover:text-[var(--theme-color)]
                  "
                >
                  Contact
                </Link>
              </li>

            </ul>
          </div>


          {/* ===================================================
              CONTACT
             =================================================== */}

          <div className="min-w-0">

            <h3
              className="
                mb-4
                text-[15px]
                font-semibold
                leading-none
                text-white

                sm:text-base
              "
            >
              Contact
            </h3>

            <div
              className="
                space-y-2.5
                text-[13px]
                leading-5
                text-gray-400
              "
            >

              {/* Address */}

              <p className="flex items-start gap-2">

                <span
                  className="
                    mt-0.5
                    shrink-0
                    text-xs
                  "
                >
                  📍
                </span>

                <span className="min-w-0">
                  Kumira, Sitakunda, Chittagong
                </span>

              </p>


              {/* Phone */}

              <p className="flex items-start gap-2">

                <span
                  className="
                    mt-0.5
                    shrink-0
                    text-xs
                  "
                >
                  📞
                </span>

                <a
                  href="tel:+8801616964247"
                  className="
                    min-w-0
                    transition-colors
                    duration-200
                    hover:text-[var(--theme-color)]
                  "
                >
                  +880 1616-964247
                </a>

              </p>


              {/* Email */}

              <p className="flex items-start gap-2">

                <span
                  className="
                    mt-0.5
                    shrink-0
                    text-xs
                  "
                >
                  ✉️
                </span>

                <a
                  href="mailto:sutocraftbd@gmail.com"
                  className="
                    min-w-0
                    break-all
                    transition-colors
                    duration-200
                    hover:text-[var(--theme-color)]
                  "
                >
                  sutocraftbd@gmail.com
                </a>

              </p>


              {/* Website */}

              <p className="flex items-start gap-2">

                <span
                  className="
                    mt-0.5
                    shrink-0
                    text-xs
                  "
                >
                  🌐
                </span>

                <a
                  href="https://www.sutocraftbd.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    min-w-0
                    break-all
                    transition-colors
                    duration-200
                    hover:text-[var(--theme-color)]
                  "
                >
                  www.sutocraftbd.com
                </a>

              </p>

            </div>
          </div>


          {/* ===================================================
              FOLLOW US
             =================================================== */}

          <div className="min-w-0">

            <h3
              className="
                mb-4
                text-[15px]
                font-semibold
                leading-none
                text-white

                sm:text-base
              "
            >
              Follow Us
            </h3>

            <div
              className="
                space-y-2
                text-[13px]
                leading-5
                text-gray-400
              "
            >

              <a
                href="https://www.facebook.com/share/1KCQqtBzLU/"
                target="_blank"
                rel="noopener noreferrer"
                className="
                  block
                  transition-all
                  duration-200
                  hover:translate-x-0.5
                  hover:text-[var(--theme-color)]
                "
              >
                Facebook
              </a>

              <a
                href="https://youtube.com/@sutocraft?si=mIN7Bmmq-WeFOno1"
                target="_blank"
                rel="noopener noreferrer"
                className="
                  block
                  transition-all
                  duration-200
                  hover:translate-x-0.5
                  hover:text-[var(--theme-color)]
                "
              >
                YouTube
              </a>

              <a
                href="https://wa.me/8801616964247"
                target="_blank"
                rel="noopener noreferrer"
                className="
                  block
                  transition-all
                  duration-200
                  hover:translate-x-0.5
                  hover:text-[#25D366]
                "
              >
                WhatsApp
              </a>

            </div>
          </div>

        </div>


        {/* =====================================================
            BOTTOM FOOTER
           ===================================================== */}

        <div
          className="
            border-t
            border-white/10
            py-4

            sm:py-4.5
          "
        >

          <div
            className="
              flex
              flex-col
              items-center
              justify-between
              gap-2.5

              text-center
              text-[11px]
              leading-5
              text-gray-500

              sm:flex-row
              sm:gap-4
              sm:text-xs
            "
          >

            {/* Copyright */}

            <p className="shrink-0">
              © {new Date().getFullYear()} SutoCraft.
              All Rights Reserved.
            </p>


            {/* Made in Bangladesh */}

            <p className="shrink-0">

              Made with{" "}

              <span
                className="
                  inline-block
                  text-red-500
                  transition-transform
                  duration-200
                  hover:scale-110
                "
              >
                ❤️
              </span>{" "}

              in Bangladesh

            </p>

          </div>

        </div>

      </Container>
    </footer>
  );
}