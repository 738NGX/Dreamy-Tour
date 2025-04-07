import McpConstant from "@/constant/mcpConstant";
import OpenAI from "openai";

const deepseek = new OpenAI({
  baseURL: McpConstant.DEEPSEEK_BASE_URL,
  apiKey: McpConstant.DEEPSEEK_API_KEY,
});

export default deepseek;
