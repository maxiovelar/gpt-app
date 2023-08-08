//@ts-nocheck
import Image from "next/image";
import Link from "next/link";

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
            const imageUrl = product.images[0].file.url;
            return (
              <Link href={`/products/${product.slug}`} key={product.id}>
                <div className="border hover:border-[#1ad197] bg-[#1ad197] rounded-lg duration-300 cursor-pointer p-5 hover:text-[#1ad197] text-white hover:bg-white border-white h-full">
                  <div className="h-96 relative">
                    <Image
                      src={imageUrl}
                      alt={product.name}
                      fill
                      className="pb-3 mb-3 border-b"
                    />
                  </div>
                  <p className="mt-3 text-xl text-center">{product.name}</p>
                  <p className="text-black mt-3">{product.description}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Products;
