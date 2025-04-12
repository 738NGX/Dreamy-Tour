import deepseek from "@/config/deepseekConfig";
import express, { Request, Response } from "express"

const llmRoute = express.Router();

llmRoute.post('/llm/text', async (req: Request, res: Response) => {
  const { task, max_tokens, temperature } = req.query;
  const completion = await deepseek.chat.completions.create({
    messages: [{ role: "user", content: task as string }],
    model: "deepseek-chat",
    max_tokens: Number(max_tokens),
    temperature: Number(temperature),
    stream: true,
  });
  for await (const chuck of completion) {
    if (chuck.choices && chuck.choices[0] && chuck.choices[0].delta && chuck.choices[0].delta.content) {
      res.write(chuck.choices[0].delta.content);
    }
  }
  res.end();
})

llmRoute.post('/llm/json', async (req: Request, res: Response) => {
  const { task, max_tokens, temperature } = req.query;
  const completion = await deepseek.chat.completions.create({
    messages: [{ role: "user", content: task as string }],
    model: "deepseek-chat",
    max_tokens: Number(max_tokens),
    temperature: Number(temperature),
    stream: true,
    response_format: { type: 'json_object' },
  });
  for await (const chuck of completion) {
    if (chuck.choices && chuck.choices[0] && chuck.choices[0].delta && chuck.choices[0].delta.content) {
      res.write(chuck.choices[0].delta.content);
    }
  }
  res.end();
})

export default llmRoute;