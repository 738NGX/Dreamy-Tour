import AppConstant from "@/constant/appConstant";
import McpClient from "@/middleware/mcpClient";

const gaodeMcpClient = new McpClient(
  "gaode-mcp-client",
  `https://mcp.amap.com/sse?key=${AppConstant.GAODE_API_KEY}`
)

export default gaodeMcpClient;