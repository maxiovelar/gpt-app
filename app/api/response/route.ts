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
  const { requestMessages } = await req.json();

  const system_message = `You are a shopping assistant with access to the store (${JSON.stringify(
    products
  )}).Create a valid JSON object following this format:\n[{\"text\": \"Your response as an assistant\", \"products\": \"An array of products ids that match the customers queries.\"}]\n\nExample:\n[{\"text\": \"Sure! Here are some dresses that you might like: 1. Chic Linen Dress - Available in Beige and Dusty Rose. 2. Fancy Cocktail Dress - Available in Emerald Green and Ruby Red. 3. Flowy Boho Maxi Skirt - Available in Olive Green and Rust Orange. Let me know if you would like more information or if you have any specific preferences!", \"products\": [\"001\", \"002\"]}]\n\n
`;

  if (!requestMessages || requestMessages.length === 0) {
    return NextResponse.error();
  }

  try {
    const chatCompletion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: system_message,
        },
        {
          role: "user",
          content: "Do you have any shirt for men?",
        },
        {
          role: "assistant",
          content: `Yes, we have the following shirts to recommend for you`,
        },
        ...requestMessages,
      ],
      temperature: 0.6,
    });

    const message = chatCompletion.data.choices[0]?.message;
    const usage = chatCompletion.data.usage;

    return NextResponse.json({
      message: message,
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
