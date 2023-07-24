"use client";

import axios from "axios";
import Link from "next/link";
import { useState } from "react";
import { Spinner } from "./_components/Spinner";

const Home = () => {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");
  const [usage, setUsage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/api/response", {
        headers: {
          "Content-Type": "application/json",
        },
        prompt: prompt,
      });

      setResult(data.content);
      setIsLoading(false);
      setUsage(data.usage);
      console.log("USAGE:", usage);
    } catch (error) {
      console.log("Error:", error);
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
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit;
          }}
          className="flex flex-col space-y-4 w-full"
        >
          <label className="text-xl">Feel free to ask away!</label>
          <input
            className="border border-black rounded-lg px-5 py-2 outline-none"
            type="text"
            onChange={(e) => {
              setPrompt(e.target.value);
            }}
          />
          <button
            className="px-6 py-2 font-medium bg-[#1ad197] text-white w-fit transition-all shadow-[3px_3px_0px_black] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px]"
            type="submit"
          >
            {isLoading ? <Spinner size={4} /> : "Submit"}
          </button>
          {result && (
            <div className="bg-gray-100 p-10 mt-10 text-black rounded">
              <p className="font-bold text-lg">{prompt}</p>
              <p>{result}</p>
            </div>
          )}
        </form>
      </div>
    </>
  );
};

export default Home;
