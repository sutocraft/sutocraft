import Header from "./components/website/Header";
import Hero from "./components/website/Hero";
import Categories from "./components/website/Categories";
import NewArrivals from "./components/website/NewArrivals";
import FeaturedProducts from "./components/website/FeaturedProducts";
import WhyChooseUs from "./components/website/WhyChooseUs";
import Newsletter from "./components/website/Newsletter";
import Footer from "./components/website/Footer";

export default function HomePage() {
  return (
    <>
      <Header />
      <Hero />
      <Categories />
      <NewArrivals />
      <FeaturedProducts />
      <WhyChooseUs />
      <Newsletter />
      <Footer />
    </>
  );
}