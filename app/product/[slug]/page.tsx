import ProductDetails from "../../components/website/ProductDetails";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ProductPage({
  params,
}: Props) {
  const { slug } = await params;

  return <ProductDetails slug={slug} />;
}