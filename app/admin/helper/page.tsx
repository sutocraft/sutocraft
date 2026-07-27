import HelperCard from "./components/HelperCard";
import Categories from "./components/Categories";
import Brands from "./components/Brands";
import Colors from "./components/Colors";
import Sizes from "./components/Sizes";
import StockStatuses from "./components/StockStatuses";

export default function HelperPage() {
  return (
    <div className="p-6">
      <h1 className="mb-2 text-2xl font-bold">
        Helper
      </h1>

      <p className="mb-8 text-gray-500">
        Manage Categories, Brands, Colors, Sizes and Stock Status.
      </p>

      <HelperCard
  title="Categories"
  description="Create and manage product categories."
>
  <Categories />
</HelperCard>

      <HelperCard
  title="Brands"
  description="Create and manage product brands."
>
  <Brands />
</HelperCard>

      <HelperCard
  title="Colors"
  description="Create and manage product colors."
>
  <Colors />
</HelperCard>

      <HelperCard
  title="Sizes"
  description="Create and manage product sizes."
>
  <Sizes />
</HelperCard>

      <HelperCard
  title="StockStatuses"
  description="Create and manage stock statuses."
>
  <StockStatuses />
</HelperCard>
    </div>
  );
}