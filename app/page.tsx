"use client";

import axios from "axios";
import { useState } from "react";

const Home = () => {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");
  const [usage, setUsage] = useState(null);

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
      setUsage(data.usage);
      console.log("USAGE:", usage);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrompt(e.target.value);
  };

  return (
    <div className="p-10">
      <form onSubmit={handleSubmit}>
        <label htmlFor="">Ask shopping assistant</label>
        <input
          className="border border-black"
          type="text"
          onChange={handleChange}
        />
        <button type="submit">Submit</button>
      </form>
      <div>{result}</div>
    </div>
  );
};

export default Home;
