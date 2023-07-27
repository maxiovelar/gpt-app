import { NextResponse } from "next/server";
import { products } from "@/_data/products";

import { ChatOpenAI } from "langchain/chat_models/openai";
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  SystemMessagePromptTemplate,
  MessagesPlaceholder,
} from "langchain/prompts";
import { ConversationChain } from "langchain/chains";
import { BufferMemory } from "langchain/memory";

// CREATE TEMPLATES, CHAIN AND MEMORY
const chat = new ChatOpenAI({ temperature: 0 });

const systemTemplate = `The following is a friendly conversation between a human and an AI. The AI is a helpful shopping assistant with access to the following store. The AI is talkative and provides lots of specific details from its context. If the product that the customer is asking for does not exist into te store, the AI truthfully says it does not exist or it run out of stock and it will recommend to the customer a similar product from the store`;
const humanTemplate = "{input}";

const chatPrompt = ChatPromptTemplate.fromPromptMessages([
  SystemMessagePromptTemplate.fromTemplate(systemTemplate),
  new MessagesPlaceholder("history"),
  HumanMessagePromptTemplate.fromTemplate(humanTemplate),
]);

const memory = new BufferMemory({
  returnMessages: true,
  memoryKey: "history",
});

const chain = new ConversationChain({
  memory,
  prompt: chatPrompt,
  llm: chat,
});

// CREATE API ROUTES
export const POST = async (req: Request) => {
  const { query } = await req.json();
  const { response } = await chain.call({
    input: query,
  });

  return NextResponse.json({ response });
};

export const DELETE = async (req: Request) => {
  await memory.clear();
  return NextResponse.json({ message: "Memory cleared" });
};
