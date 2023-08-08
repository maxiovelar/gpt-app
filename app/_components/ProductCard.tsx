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
        <p
          className="text-black mt-3"
          dangerouslySetInnerHTML={{
            __html: product.description,
          }}
        />
      </div>
    </Link>
  );
};

export default ProductCard;
