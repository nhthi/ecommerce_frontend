import { RecommendedProductDto } from "../../../state/customer/recommendationSlice";
import { Product } from "../../../types/ProductType";
import SimilarProductCard from "./SimilarProductCard";

const SimilarProduct = ({ products }: { products: RecommendedProductDto[] }) => {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
      {products?.map((product) => (
        <SimilarProductCard key={product.productId} product={product} />
      ))}
    </div>
  );
};

export default SimilarProduct;
