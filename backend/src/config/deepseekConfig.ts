import AppConstant from "@/constant/appConstant";
import OpenAI from "openai";

const deepseek = new OpenAI({
  baseURL: AppConstant.DEEPSEEK_BASE_URL,
  apiKey: AppConstant.DEEPSEEK_API_KEY,
});

export default deepseek;
