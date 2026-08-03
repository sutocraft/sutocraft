import Header from "./components/website/Header";
import Hero from "./components/website/Hero";
import Categories from "./components/website/Categories";
import NewArrivals from "./components/website/NewArrivals";
import FeaturedProducts from "./components/website/FeaturedProducts";
import WhyChooseUs from "./components/website/WhyChooseUs";
import Newsletter from "./components/website/Newsletter";
import Footer from "./components/website/Footer";
import MobileBottomNav from "./components/website/MobileBottomNav";
import { getHeroProducts } from "@/lib/products";
import { getWebsiteSettings } from "@/lib/settings";

export default async function Home() {
  const { data: settings } =
await getWebsiteSettings();

const heroProducts =
await getHeroProducts(
  settings.hero_max_products
);

console.log("Settings:", settings);
console.log("Hero Products:", heroProducts);

  return (
    <>
      <Header />
      <Hero
  products={heroProducts ?? []}
  settings={settings}
/>
      <Categories />
      <NewArrivals />
      <FeaturedProducts />
      <WhyChooseUs />
      <Newsletter />
      <Footer />
      <MobileBottomNav />
    </>
  );
}