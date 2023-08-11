//@ts-nocheck
import ProductCard from "@/_components/ProductCard";
import productsData from "/api/data.json";

const Products = async () => {
  return (
    <>
      <div className="space-y-3">
        <h2 className="text-4xl text-center border-b pb-5 mb-8 font-bold text-[#1ad197]">
          Products
        </h2>
        <div className="grid grid-cols-3 gap-8 max-w-6xl">
          {productsData.map((product: Product) => {
            return <ProductCard key={product.id} product={product} />;
          })}
        </div>
      </div>
    </>
  );
};

export default Products;
