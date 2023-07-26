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
  )}).
`;

  const moderationResponse = await openai.createModeration({
    input: requestMessages[requestMessages.length - 1].content,
  });
  if (moderationResponse.data.results[0]?.flagged) {
    console.log("RESULTS: ", moderationResponse.data.results[0]);
    console.log("Message is inappropriate");
    return NextResponse.json({
      message:
        "Message is inappropriate, I'm not able to assist with that request.",
    });
  }

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
