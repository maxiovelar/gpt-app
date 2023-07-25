"use client";

import React, { useState, useRef, FormEvent } from "react";
import axios from "axios";
import Link from "next/link";
import Spinner from "./_components/Spinner";
import { UpdateIcon } from "./_components/icons/UpdateIcon";
import { ChatCompletionRequestMessage } from "openai";
import cx from "classnames";

const Home = () => {
  const [query, setQuery] = useState("");
  const [chatMessages, setChatMessages] = useState<
    ChatCompletionRequestMessage[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleError = (err: string) => {
    setIsLoading(false);
    console.error(err);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const inputQuery = query.trim();
    if (inputQuery) {
      setIsLoading(true);
      const newMessage: ChatCompletionRequestMessage = {
        role: "user",
        content: inputQuery,
      };
      setChatMessages((prevMessages) => [...prevMessages, newMessage]);

      try {
        const { data } = await axios.post("/api/response", {
          headers: {
            "Content-Type": "application/json",
          },
          requestMessages: [...chatMessages, newMessage],
        });
        if (data?.error) {
          handleError(data.error);
          return;
        }
        setChatMessages((prev) => [...prev, data.message]);
        setIsLoading(false);
        setQuery("");
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  const handleClear = () => {
    setChatMessages([]);
  };

  const finalMessages = [...chatMessages].reverse();

  return (
    <>
      <div className="flex space-x-5">
        <div className="flex flex-col border-r border-[#1ad197] pr-5 w-96">
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
            className="border border-black rounded-lg px-5 py-2 outline-none"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
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
              type="button"
              className="flex items-center gap-2 p-2 font-medium text-[#1ad197] w-fit transition-all hover:translate-x-[3px] hover:translate-y-[3px]"
            >
              <UpdateIcon />
              Clear chat
            </button>
          </div>

          <p
            className={cx(
              isLoading ? "visible" : "invisible",
              "animate-pulse duration-75"
            )}
          >
            SquareOne assistant is thinking...
          </p>

          {finalMessages.length > 0 && (
            <div className="flex flex-col justify-center align-center gap-5 mt-5">
              <div className="border border-gray-200 bg-gray-100 p-8 text-black rounded fade-down">
                {finalMessages.map((message, index) => (
                  <div key={`response-${index}`}>
                    <div className="flex flex-col fade-down">
                      <p
                        className={cx(
                          "font-medium text-md opacity-50 fade-down",
                          {
                            "text-right": message.role === "assistant",
                          }
                        )}
                      >
                        {message.role === "user"
                          ? "User"
                          : "SquareOne Assistant"}
                      </p>
                      <div
                        className={cx(
                          `flex-1 p-3 rounded-lg mb-5 relative`,
                          { "bg-gray-200 text-black": message.role === "user" },
                          {
                            "bg-[#1ad197] text-white":
                              message.role === "assistant",
                          }
                        )}
                      >
                        <div>{message.content}</div>
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
                ))}
              </div>
            </div>
          )}
        </form>
      </div>
    </>
  );
};

export default Home;
