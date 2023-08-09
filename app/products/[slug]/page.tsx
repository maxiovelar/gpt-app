//@ts-nocheck

import ProductCard from "@/_components/ProductCard";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";

async function getData(slug: string) {
  try {
    const res = await fetch(`https://api.swell.store/products?slug=${slug}`, {
      method: "get",
      headers: {
        Authorization:
          "Basic c3F1YXJlLW9uZTpIclBiamV5TTltWXZzbVYxRUxHWVZKekpON0lGeHJoUQ==",
        "Content-Type": "application/json",
      },
    });
    const products = await res.json();
    return products;
  } catch (error) {
    return [];
  }
}

async function getRelatedProducts(product) {
  try {
    const res = await fetch("http://localhost:8000/api/related", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: product.name,
      }),
    });
    const relatedProduct = await res.json();
    return relatedProduct;
  } catch (error) {
    console.log(error.message);
  }
}

const Product = async ({ params }: { params: { slug: string } }) => {
  const { slug } = params;
  const { results } = await getData(slug);
  const product = results[0];
  const related_products = await getRelatedProducts(product);
  const imageUrl = product.images[0].file.url;

  return (
    <div className="flex flex-col">
      <div className="flex flex-row gap-10 mb-5 pb-5 border-b border-[#1ad197]">
        <div className="h-96 w-full relative">
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="p-3 mb-3 border"
          />
        </div>
        <div>
          <p className="text-2xl font-bold">{product.name}</p>
          <p
            className="text-black mt-3"
            dangerouslySetInnerHTML={{
              __html: product.description,
            }}
          ></p>
        </div>
      </div>
      <h3 className="text-xl mb-5">Related products:</h3>
      <div className="grid grid-cols-3 gap-5">
        {related_products.result.map((related_product) => {
          return (
            <ProductCard product={related_product} key={related_product.id} />
          );
        })}
      </div>
    </div>
  );
};

export default Product;
