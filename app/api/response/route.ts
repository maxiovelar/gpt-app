import { Configuration, OpenAIApi } from "openai";
import { NextResponse } from "next/server";
import { products } from "@/_data/products";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

if (!configuration.apiKey)
  throw new Error("No OPENAI_API_KEY environment variable found");

const openai = new OpenAIApi(configuration);

export async function POST(req: Request) {
  const { prompt } = await req.json();

  if (!prompt || prompt.length === 0) {
    return NextResponse.error();
  }

  try {
    const chatCompletion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are a shopping assistant with access to the store (${JSON.stringify(
            products
          )}).  `,
        },
        {
          role: "user",
          content: "How much stock is there for the Elegance Blouse?",
        },
        { role: "assistant", content: `There is 100 stock for that item ` },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
    });

    const content = chatCompletion.data.choices[0]?.message?.content;
    const usage = chatCompletion.data.usage;
    console.log(chatCompletion);
    console.log(chatCompletion.data.choices[0]);

    return NextResponse.json({
      content: content,
      usage: usage,
    });
  } catch (error: any) {
    if (error.response) {
      console.log(error.response.status);
      console.log(error.response.data);
      return error.response.status;
    } else {
      console.log(error.message);
      return error.message;
    }
  }
}
