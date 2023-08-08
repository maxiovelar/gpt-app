//@ts-nocheck
import ProductCard from "@/_components/ProductCard";

interface Product {
  id: string;
  name: string;
  price: number;
  sale: boolean;
  sale_price: number;
  currency: string;
  stock: number;
  description: string;
  slug: string;
  active: boolean;
  images: { file: { url: string } }[];
}

async function getData() {
  const res = await fetch(process.env.SWELL_API_URL as string, {
    method: "GET",
    headers: {
      Authorization: process.env.SWELL_AUTORIZATION_KEY,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

const Products = async () => {
  const data = await getData();

  return (
    <>
      <div className="space-y-3">
        <h2 className="text-4xl text-center border-b pb-5 mb-8 font-bold text-[#1ad197]">
          Products
        </h2>
        <div className="grid grid-cols-3 gap-8">
          {data.results.map((product: Product) => {
            return <ProductCard key={product.id} product={product} />;
          })}
        </div>
      </div>
    </>
  );
};

export default Products;
