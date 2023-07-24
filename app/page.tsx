"use client";

import axios from "axios";
import { useState } from "react";

const Home = () => {
  const [prompt, setPrompt] = useState();
  const [result, setResult] = useState();

  // OpenAI API Request
  const handleSubmit = async (prompt) => {
    try {
      const { data } = await axios.post("/api/response", {
        headers: {
          "Content-Type": "application/json",
        },
        prompt: prompt,
      });

      setResult(data.content);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  return (
    <div className="p-10">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(prompt);
        }}
      >
        <label htmlFor="">Ask shopping assistant</label>
        <input
          className="border border-black"
          type="text"
          onChange={(e) => {
            setPrompt(e.target.value);
          }}
        />
        <button type="submit">Submit</button>
      </form>
      <div>{result}</div>
    </div>
  );
};

export default Home;
