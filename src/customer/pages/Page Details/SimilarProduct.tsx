import { Product } from "../../../types/ProductType";
import SimilarProductCard from "./SimilarProductCard";

const SimilarProduct = ({ products }: { products: Product[] }) => {
  return (
    <div className="grid lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-2 gap-x-2 justify-between gap-4 gap-y-8">
      {products?.map((product) => (
        <SimilarProductCard key={product.id} product={product} />
      ))}
      {products?.map((product) => (
        <SimilarProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default SimilarProduct;
