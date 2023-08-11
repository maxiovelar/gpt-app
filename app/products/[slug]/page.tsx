//@ts-nocheck

import ProductCard from "@/_components/ProductCard";
import Image from "next/image";
import productsData from "../../../api/data.json";

async function getRelatedProducts(product) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/related`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: product.name,
      }),
    });
    const relatedProduct = await res.json();
    console.log(relatedProduct);

    return relatedProduct;
  } catch (error) {
    console.log(error.message);
  }
}

const Product = async ({ params }: { params: { slug: string } }) => {
  const { slug } = params;
  const product = productsData.find((prod) => prod.slug === slug);
  const related_products_ids = await getRelatedProducts(product);
  console.log(related_products_ids);

  const filteredObjects = await productsData.filter((obj) =>
    related_products_ids.result.includes(obj.id)
  );

  console.log(filteredObjects);

  const imageUrl = product.image_url;

  return (
    <div className="flex flex-col">
      <div className="flex flex-row gap-10 mb-5 pb-5 border-b border-[#1ad197]">
        <div className="flex justify-center">
          <Image
            src={imageUrl}
            alt={product.name}
            width={500}
            height={500}
            className="p-3 mb-3 border"
            style={{ objectFit: "cover" }}
          />
        </div>
        <div className="">
          <p className="text-2xl font-bold">{product.name}</p>
          <p
            className="text-black mt-3"
            dangerouslySetInnerHTML={{
              __html: product.description,
            }}
          />
        </div>
      </div>
      <h3 className="text-xl mb-5">Related products:</h3>
      <div className="grid grid-cols-3 gap-5 max-w-6xl">
        {filteredObjects.map((related_product) => {
          return (
            <ProductCard product={related_product} key={related_product.id} />
          );
        })}
      </div>
    </div>
  );
};

export default Product;
