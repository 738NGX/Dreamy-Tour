import projectConfig from "../../database/dreamy-tour-config.json"

class McpConstant {
  // deepseek 
  static readonly DEEPSEEK_BASE_URL = "https://api.deepseek.com";
  static readonly DEEPSEEK_API_KEY = projectConfig.deepseekApiKey;
  // 高德 MCP
  static readonly GAODE_API_KEY = projectConfig.gaodeApiKey;
}

export default McpConstant