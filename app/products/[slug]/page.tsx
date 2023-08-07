import Image from "next/image";

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

const Product = async ({ params }: { params: { slug: string } }) => {
  const { slug } = params;
  const { results } = await getData(slug);
  const product = results[0];
  const imageUrl = product.images[0].file.url;

  return (
    <div className="flex flex-col">
      <div className="flex justify-center">
        <div className="rounded-lg bg-[#1ad197] duration-300 p-5 text-white  hover:border-white h-full w-1/3">
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
      </div>
      <div>
        <h3>Related products:</h3>
      </div>
    </div>
  );
};

export default Product;
