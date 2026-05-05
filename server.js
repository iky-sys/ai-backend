import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

let count = 0;
setInterval(() => count = 0, 60000);

app.post("/chat", async (req, res) => {
  if (count > 30) {
    return res.status(429).json({ reply: "Terlalu banyak request" });
  }
  count++;

  const userMessage = req.body.message;

  if (!userMessage || userMessage.length > 500) {
    return res.json({ reply: "Input tidak valid" });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "Kamu adalah AI asisten ramah yang membantu tugas, curhat, dan memberi solusi dengan bahasa santai tapi jelas."
          },
          {
            role: "user",
            content: userMessage
          }
        ]
      })
    });

    const data = await response.json();

    res.json({
      reply: data.choices?.[0]?.message?.content || "Tidak ada respon"
    });

  } catch (err) {
    res.status(500).json({ reply: "Server error" });
  }
});

app.get("/", (req, res) => {
  res.send("AI Backend Aktif");
});

app.listen(3000, () => {
  console.log("Server jalan");
});
