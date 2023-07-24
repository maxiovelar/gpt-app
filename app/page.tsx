"use client";

import axios from "axios";
import Link from "next/link";
import { useState, useRef, FormEvent } from "react";
import Spinner from "./_components/Spinner";

const Home = () => {
  const [result, setResult] = useState("");
  const [usage, setUsage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setResult("");
    const prompt = inputRef.current?.value.trim();
    if (prompt) {
      setIsLoading(true);
      try {
        const { data } = await axios.post("/api/response", {
          headers: {
            "Content-Type": "application/json",
          },
          prompt: prompt,
        });
        setIsLoading(false);
        setResult(data.content);
        setUsage(data.usage);
        console.log("USAGE:", usage);
      } catch (error) {
        console.log("Error:", error);
      }
    }
  };

  return (
    <>
      <div className="flex space-x-5">
        <div className="flex flex-col justify-between border-r border-[#1ad197] pr-5 w-96">
          <h3 className="text-3xl mb-5 text-[#1ad197] font-bold flex flex-col">
            <span>Welcome to the</span>
            <span>SquareOne AI Assistant</span>
          </h3>
          <Link
            className="text-md opacity-70 mt-10 underline"
            href="https://squareone.vercel.app/"
          >
            Visit the Square One store
          </Link>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col space-y-4 w-full"
        >
          <label className="text-xl">Feel free to ask away!</label>
          <input
            ref={inputRef}
            className="border border-black rounded-lg px-5 py-2 outline-none"
            type="text"
            required
          />
          <button
            className="px-6 py-2 font-medium bg-[#1ad197] text-white w-fit transition-all shadow-[3px_3px_0px_black] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px]"
            type="submit"
          >
            {isLoading ? <Spinner /> : "Submit"}
          </button>
          {result && inputRef.current && inputRef.current.value.length > 0 && (
            <div className="bg-gray-100 p-10 mt-10 text-black rounded">
              <p className="font-bold text-lg">{inputRef.current.value}</p>
              <p>{result}</p>
            </div>
          )}
        </form>
      </div>
    </>
  );
};

export default Home;
