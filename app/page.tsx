import Header from "./components/website/Header";
import Hero from "./components/website/Hero";
import Categories from "./components/website/Categories";
import NewArrivals from "./components/website/NewArrivals";
import FeaturedProducts from "./components/website/FeaturedProducts";

export default function HomePage() {
  return (
    <>
      <Header />
      <Hero />
      <Categories />
      <NewArrivals />
      <FeaturedProducts />
    </>
  );
}