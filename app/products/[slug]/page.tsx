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
      <h3 className="text-xl">Related products:</h3>
    </div>
  );
};

export default Product;
