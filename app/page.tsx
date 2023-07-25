"use client";

import axios from "axios";
import Link from "next/link";
import { useState, useRef, FormEvent, MouseEventHandler } from "react";
import Spinner from "./_components/Spinner";
import { UpdateIcon } from "./_components/icons/UpdateIcon";

const Home = () => {
  // const [result, setResult] = useState("");
  // const [promptList, setPromptList] = useState<string[]>([]);
  const [responseList, setResponseList] = useState<string[]>([]);
  const [usage, setUsage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  let queryList: string[] = [];

  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // setResult("");
    const prompt = inputRef.current?.value.trim();
    if (prompt) {
      // console.log("PROMPT:", prompt);
      queryList.push(prompt);
      // console.log("SPREAD: ", [...promptList, prompt]);
      // setPromptList(["a", "b", "c"]);
      // console.log("PROMPT LIST:", promptList);
      setIsLoading(true);
      try {
        const { data } = await axios.post("/api/response", {
          headers: {
            "Content-Type": "application/json",
          },
          // prompt: prompt,
          prompt: queryList.join(". "),
          // prompt: [...promptList].join(". "),
        });
        setIsLoading(false);
        // setResponseList([data.content]);
        // setResult(data.content);
        setResponseList([...responseList, data.content]);
        setUsage(data.usage);
        console.log("USAGE:", usage);
      } catch (error) {
        console.log("Error:", error);
      }
    }
  };

  const handleClear = () => {
    // setResult("");
    inputRef.current!.value = "";
    queryList = [];
    // setResponseList([]);
    setUsage(null);
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
            title="Visit Square One"
            href="https://squareone.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
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
            placeholder="How can I help you?"
            ref={inputRef}
            className="border border-black rounded-lg px-5 py-2 outline-none"
            type="text"
            required
          />
          <div className="flex gap-14">
            <button
              className="px-6 py-2 font-medium bg-[#1ad197] text-white w-fit transition-all shadow-[3px_3px_0px_black] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px]"
              type="submit"
            >
              {isLoading ? <Spinner /> : "Submit"}
            </button>
            <button
              onClick={handleClear}
              className="flex items-center gap-2 p-2 font-medium text-[#1ad197] w-fit transition-all hover:translate-x-[3px] hover:translate-y-[3px]"
            >
              <UpdateIcon />
              Clear chat
            </button>
            {/* {result && inputRef.current && inputRef.current.value.length > 0 && ( */}
            {/* <div className="flex flex-col justify-center align-center gap-5">
              {responseList &&
                inputRef.current &&
                inputRef.current.value.length > 0 &&
                responseList.map((response, index) => (
                  <div
                    key={`response-${index}`}
                    className="bg-gray-100 p-10 text-black rounded fade-down"
                  >
                    <p className="font-bold text-lg">
                      {inputRef?.current?.value}
                    </p>
                    <p>{response}</p>
                  </div>
                ))}
            </div> */}
          </div>
          {responseList.length > 0 &&
          inputRef.current &&
          inputRef.current.value.length > 0 ? (
            <div className="flex flex-col justify-center align-center gap-5 pt-10">
              {responseList.reverse().map((response, index) => (
                <div
                  key={`response-${index}`}
                  className="bg-gray-100 p-10 text-black rounded fade-down"
                >
                  <p className="font-bold text-lg">
                    {inputRef?.current?.value}
                    {/* {prompt} */}
                  </p>
                  <p>{response}</p>
                </div>
              ))}
            </div>
          ) : null}
        </form>
      </div>
    </>
  );
};

export default Home;
