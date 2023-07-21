require("dotenv").config();
const { Configuration, OpenAIApi } = require("openai");
const express = require("express");
const app = express();
const APP_PORT = process.env.APP_PORT || 3000;

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
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });
    console.log(chatCompletion.data.choices[0].message.content);
    return chatCompletion.data.choices[0].message.content;
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
  res.json({ message: "Bienvenido a GPT-APP" });
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
