//@ts-nocheck
import Image from "next/image";
import Link from "next/link";

const ProductCard = ({ product }) => {
  const imageUrl = product.images
    ? product.images[0].file.url
    : product.image_url
    ? product.image_url
    : "";

  return (
    <Link href={`/products/${product.slug}`} key={product.id}>
      <div
        id="card-container"
        className="h-[650px] bg-[#1ad197] rounded-lg duration-200 cursor-pointer overflow-hidden shadow-lg text-white hover:bg-white hover:text-[#1ad197] hover:border hover:border-[#1ad197] hover:shadow-none"
      >
        <div className="h-80 w-full relative">
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="pb-3 mb-3"
            style={{ objectFit: "cover" }}
          />
        </div>
        <div className="flex flex-col px-5 pb-5">
          <p className="mt-3 text-xl text-center">{product.name}</p>
          <p
            className="text-black mt-3 h-60"
            dangerouslySetInnerHTML={{
              __html: product.description,
            }}
          />
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
