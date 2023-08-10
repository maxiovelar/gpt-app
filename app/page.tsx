"use client";

import React, { useState, FormEvent } from "react";
import axios from "axios";
import Link from "next/link";
import Spinner from "./_components/Spinner";
import { UpdateIcon } from "./_components/icons/UpdateIcon";
import cx from "classnames";
import { LoadingText } from "./_components/LoadingText";
import productsData from "../api/data.json";

interface Product {
  id: string;
  name: string;
  price: number;
  sale: boolean;
  sale_price: number | null;
  currency: string;
  stock: number | null;
  description: string;
  slug: string;
  active: boolean;
}

interface MessagesProps {
  role: "user" | "assistant";
  content: string;
  products?: Product[];
}

const Home = () => {
  const [query, setQuery] = useState("");
  const [chatMessages, setChatMessages] = useState<MessagesProps[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleError = (err: string) => {
    setIsLoading(false);
    console.error(err);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setQuery("");
    const inputQuery = query.trim();
    if (inputQuery) {
      setIsLoading(true);
      const newMessage: MessagesProps = {
        role: "user",
        content: inputQuery,
      };
      setChatMessages((prevMessages) => [...prevMessages, newMessage]);

      try {
        const { data } = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/chat/query`,
          {
            headers: {
              "Content-Type": "application/json",
            },
            query: inputQuery,
          }
        );
        if (data?.error) {
          handleError(data.error);
          return;
        }
        console.log("DATA:", data);
        const response = data.result.text;
        const products = data.result.products;
        const dataJsonProducts: Product[] = [];

        if (products.length > 0) {
          for (const product of products) {
            const finalProduct = productsData.find(
              (prod) => prod.id === product
            );
            finalProduct && dataJsonProducts.push(finalProduct);
          }
        }
        console.log("PRODUCTS FROM DATA JSON:", dataJsonProducts);
        setChatMessages((prev) => [
          ...prev,
          { role: "assistant", content: response, products: dataJsonProducts },
        ]);
        setIsLoading(false);
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  const handleClear = async () => {
    setChatMessages([]);
    await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/chat/query`);
  };

  const finalMessages = [...chatMessages].reverse();

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4 w-full">
      <label className="text-xl">Feel free to ask away!</label>
      <input
        placeholder="How can I help you?"
        className="border border-black rounded-lg px-5 py-2 outline-none"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        type="text"
        required
      />
      <div className="flex gap-14">
        <button
          className="px-6 py-2 font-medium bg-[#1ad197] text-white w-fit transition-all shadow-[3px_3px_0px_black] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] disabled:pointer-events-none"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? <Spinner /> : "Submit"}
        </button>
        <button
          onClick={handleClear}
          type="button"
          disabled={isLoading}
          className="flex items-center gap-2 p-2 font-medium text-[#1ad197] w-fit transition-all hover:translate-x-[3px] hover:translate-y-[3px] disabled:pointer-events-none disabled:opacity-60"
        >
          <UpdateIcon />
          Clear chat
        </button>
      </div>

      {isLoading && <LoadingText isLoading={isLoading} />}

      {finalMessages.length > 0 && (
        <div className="flex flex-col justify-center align-center gap-5 mt-5">
          <div className="border border-gray-200 bg-gray-100 p-8 text-black rounded fade-down">
            {finalMessages.map((message, index) => {
              const key = `response-${index}`;

              return (
                <div key={key}>
                  <div className="flex flex-col fade-down">
                    <p
                      className={cx(
                        message.role === "assistant" && "text-right",
                        "font-medium text-md opacity-50 fade-down"
                      )}
                    >
                      {message.role === "user" ? "User" : "SquareOne Assistant"}
                    </p>
                    <div
                      className={cx(
                        `flex-1 p-3 rounded-lg mb-5 relative`,
                        {
                          "bg-gray-200 text-black": message.role === "user",
                        },
                        {
                          "bg-[#1ad197] text-white":
                            message.role === "assistant",
                        }
                      )}
                    >
                      <div
                        dangerouslySetInnerHTML={{
                          __html: message.content?.replace(/\n/g, "<br>") ?? "",
                        }}
                      />
                      {message.products && message.products?.length > 0 && (
                        <div className="flex flex-col gap-3 mt-3">
                          {message.products.map((product) => {
                            return (
                              <Link
                                href={`${process.env.NEXT_PUBLIC_SO_URL}/products/${product.slug}`}
                                target="_blank"
                                title={`View ${product.name} on SquareOne`}
                                rel="noopener noreferrer"
                                key={product.id}
                                className="flex flex-col border border-[#16be89] rounded-lg py-2 px-4 hover:bg-[#16be89] hover:cursor-pointer"
                              >
                                <div className="flex items-center gap-2">
                                  <p className="font-medium">
                                    {product.name} -
                                  </p>
                                  {product.sale && (
                                    <p className="bg-[#16be89] rounded py-0.5 px-2 border border-[#1ad197]">
                                      <span className="font-bold">SALE</span>{" "}
                                      {product.currency} {product.sale_price}
                                    </p>
                                  )}
                                  <p
                                    className={cx({
                                      "line-through": product.sale,
                                    })}
                                  >
                                    {product.currency} {product.price}
                                  </p>
                                </div>
                                <p
                                  className="text-gray-100 text-sm"
                                  dangerouslySetInnerHTML={{
                                    __html: product.description,
                                  }}
                                />
                              </Link>
                            );
                          })}
                        </div>
                      )}
                      <div
                        className={cx(
                          "absolute top-1/2 transform  rotate-45 w-2 h-2 ",
                          {
                            "left-0 -translate-x-1/2 bg-gray-200":
                              message.role === "user",
                            "right-0 translate-x-1/2 bg-[#1ad197]":
                              message.role === "assistant",
                          }
                        )}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </form>
  );
};

export default Home;
