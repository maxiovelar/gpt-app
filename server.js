require("dotenv").config();
const { Configuration, OpenAIApi } = require("openai");
const express = require("express");
const app = express();
const APP_PORT = process.env.APP_PORT || 3000;

const products = [
  {
    id: "001",
    name: "Elegance Blouse",
    stock: 100,
    colors: ["White", "Pale Pink", "Slate Gray"],
    price: 39.99,
  },
  {
    id: "002",
    name: "Dapper Denim Jacket",
    stock: 80,
    colors: ["Blue", "Black"],
    price: 79.99,
  },
  {
    id: "003",
    name: "Comfy Crewneck Sweater",
    stock: 120,
    colors: ["Navy Blue", "Burgundy", "Heather Gray"],
    price: 49.99,
  },
  {
    id: "004",
    name: "Chic Linen Dress",
    stock: 60,
    colors: ["Beige", "Dusty Rose"],
    price: 64.99,
  },
  {
    id: "005",
    name: "Urban Hiker Boots",
    stock: 50,
    colors: ["Brown", "Black"],
    price: 89.99,
  },
  {
    id: "006",
    name: "Cozy Cashmere Scarf",
    stock: 90,
    colors: ["Charcoal Gray", "Cream", "Mauve"],
    price: 34.99,
  },
  {
    id: "007",
    name: "Classic Fedora Hat",
    stock: 70,
    colors: ["Black", "Burgundy"],
    price: 24.99,
  },
  {
    id: "008",
    name: "Retro Cat-Eye Sunglasses",
    stock: 30,
    colors: ["Tortoise Shell", "Red"],
    price: 19.99,
  },
  {
    id: "009",
    name: "Sophisticated Trench Coat",
    stock: 110,
    colors: ["Camel", "Navy Blue"],
    price: 109.99,
  },
  {
    id: "010",
    name: "Essential V-Neck Tee",
    stock: 150,
    colors: ["White", "Black", "Heather Gray"],
    price: 14.99,
  },
  {
    id: "011",
    name: "Formal Tailored Blazer",
    stock: 65,
    colors: ["Navy Blue", "Charcoal Gray"],
    price: 89.99,
  },
  {
    id: "012",
    name: "Vintage Leather Satchel",
    stock: 40,
    colors: ["Cognac", "Dark Brown"],
    price: 79.99,
  },
  {
    id: "013",
    name: "Flowy Boho Maxi Skirt",
    stock: 85,
    colors: ["Olive Green", "Rust Orange"],
    price: 54.99,
  },
  {
    id: "014",
    name: "Sporty Windbreaker Jacket",
    stock: 75,
    colors: ["Black", "Electric Blue"],
    price: 69.99,
  },
  {
    id: "015",
    name: "Quilted Puffer Vest",
    stock: 55,
    colors: ["Navy Blue", "Burgundy"],
    price: 49.99,
  },
  {
    id: "016",
    name: "Casual Cargo Shorts",
    stock: 95,
    colors: ["Khaki", "Olive Green"],
    price: 29.99,
  },
  {
    id: "017",
    name: "Bohemian Fringed Kimono",
    stock: 45,
    colors: ["Magenta", "Turquoise"],
    price: 44.99,
  },
  {
    id: "018",
    name: "Chic Chelsea Ankle Boots",
    stock: 120,
    colors: ["Black", "Taupe"],
    price: 79.99,
  },
  {
    id: "019",
    name: "Athletic Performance Leggings",
    stock: 100,
    colors: ["Black", "Navy Blue", "Mauve"],
    price: 34.99,
  },
  {
    id: "020",
    name: "Fancy Cocktail Dress",
    stock: 70,
    colors: ["Emerald Green", "Ruby Red"],
    price: 129.99,
  },
];

app.use(express.json());

// OpenAI API Configuration
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// OpenAI API Request
const getCompletion = async (prompt) => {
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

    const content = chatCompletion.data.choices[0].message.content;
    const usage = chatCompletion.data.usage;
    return {
      content: content,
      usage: usage,
    };
  } catch (error) {
    if (error.response) {
      console.log(error.response.status);
      console.log(error.response.data);
      return error.response.status;
    } else {
      console.log(error.message);
      return error.message;
    }
  }
};

// API Routes
app.get("/api/prompt", (req, res) => {
  res.json({ message: "Welcome to GPT-APP" });
});

app.post("/api/prompt", async (req, res) => {
  const prompt = req.body.prompt;
  const completion = await getCompletion(prompt);
  res.json({ response: completion });
});

// Server
app.listen(APP_PORT, () => {
  console.log(`\n¡Servidor corriendo en el puerto ${APP_PORT}!`);
  console.log(`Ingresar a http://localhost:${APP_PORT}.\n`);
});
