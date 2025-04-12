import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { SSEClientTransport } from '@modelcontextprotocol/sdk/client/sse.js';
import OpenAI from 'openai';
import AppConstant from '@/constant/appConstant';
import deepseek from '@/config/deepseekConfig';
import CommonUtil from '@/util/commonUtil';
import EventEmitter from 'events';

type OpenAIResponse = OpenAI.Chat.Completions.ChatCompletion & { _request_id?: string | null; };

class McpClient extends EventEmitter {
  name: string;
  client: Client;
  transport: SSEClientTransport;
  outputs: string[] = [];
  isConnected: boolean = false;
  isWorking: boolean = false;
  tools: OpenAI.ChatCompletionTool[] = [];
  constructor(clientName: string, sseUrl: string) {
    super();
    this.name = `MCP Client [${CommonUtil.textColor(clientName, 'green')}]`;
    this.client = new Client(
      { name: clientName, version: "1.0.0" },
      { capabilities: { tools: {}, resources: {}, prompts: {} } }
    );
    this.transport = new SSEClientTransport(new URL(sseUrl));
  }
  private pushOutputs(newData: string) {
    this.outputs.push(`data:${newData}`);
    this.emit('outputChanged', this.outputs);
  }
  async connect() {
    try {
      await this.client.connect(this.transport);
      console.log(
        `${new Date().toISOString()} | ${this.name} connected, preparing tools...`,
      );
      await this.prepareTools();
      this.isConnected = true;
    } catch (error) {
      console.error(`${new Date().toISOString()} | Error connecting to ${this.name}: ${error}`);
    }
  }
  async prepareTools() {
    // 获取工具列表
    const toolsResult = await this.client.listTools();
    // 处理工具列表，转换为特定格式
    this.tools = toolsResult.tools.map((tool) => {
      return {
        type: 'function',
        function: {
          name: tool.name,
          description: tool.description,
          parameters: tool.inputSchema,
        },
      };
    });
    // 打印连接成功信息和工具名称
    console.log(
      `${new Date().toISOString()} | ${this.name} connected with tools: `,
      this.tools.map((item) => item.function.name),
    );
  }
  async sendMessageWithTools(messages: OpenAI.ChatCompletionMessageParam[], tools: OpenAI.Chat.Completions.ChatCompletionTool[] = this.tools) {
    // 调用 OpenAI 的聊天完成接口
    const response = await deepseek.chat.completions.create({
      model: AppConstant.DEEPSEEK_MODEL,
      max_tokens: 1000,
      messages,
      tools: tools,
    });
    return response;
  }
  async processLLMResponse(response: OpenAIResponse, messages: OpenAI.ChatCompletionMessageParam[])
    : Promise<{ response: OpenAIResponse; messages: OpenAI.ChatCompletionMessageParam[] }> {
    if (!response.choices || response.choices.length === 0) {
      return { response, messages };
    }
    for (const choice of response.choices) {
      if (!choice.message.tool_calls || choice.message.tool_calls.length === 0) {
        // 如果没有工具调用，直接返回响应
        return { response, messages };
      } else {
        for (const toolCall of choice.message.tool_calls) {
          // 调用工具
          try {
            const result = await this.client.callTool({
              name: toolCall.function.name,
              arguments: JSON.parse(toolCall.function.arguments),
            });
            messages.push({
              role: 'assistant',
              content: null,
              tool_calls: [toolCall]
            });
            const toolCallText = (result.content as any[])[0].text;
            messages.push({
              role: 'tool',
              tool_call_id: toolCall.id,
              content: result.isError
                ? `Error: ${toolCallText}`
                : toolCallText
            });
            if (!result.isError) {
              console.log(`${new Date().toISOString()} | ${this.name}: Tool ${CommonUtil.textColor(toolCall.function.name, 'blue')} called successfully.`);
              this.pushOutputs(`调用工具${toolCall.function.name}成功`);
            } else {
              console.error(`${new Date().toISOString()} | ${this.name}: Tool ${CommonUtil.textColor(toolCall.function.name, 'blue')} call failed: `, result.error);
              this.pushOutputs(`调用工具${toolCall.function.name}失败: ${result.error}`);
            }
          } catch (error: any) {
            console.error(`${new Date().toISOString()} | ${this.name}: Error calling tool ${CommonUtil.textColor(toolCall.function.name, 'blue')}:`, error);
            this.pushOutputs(`调用工具${toolCall.function.name}失败: ${error.message}`);
            messages.push({
              role: 'tool',
              tool_call_id: toolCall.id,
              content: `Error executing tool ${CommonUtil.textColor(toolCall.function.name, 'blue')}: ${error.message}`
            });
          }
        }
      }
    }
    const newResponse = await this.sendMessageWithTools(messages);
    // 递归处理新的响应（可能包含更多工具调用）
    return this.processLLMResponse(newResponse, messages);
  }
  // 处理查询的方法
  async performTask(task: string, jsonFormat: string | boolean = false) {
    try {

      this.isWorking = true;
      console.log(`${new Date().toISOString()} | ${this.name}: Starting perform task: ${task}`);
      this.outputs = [];
      this.pushOutputs('开始执行任务...');
      // 初始化消息数组
      let messages: OpenAI.ChatCompletionMessageParam[] = [
        {
          role: 'user',
          content: `Perform this task: ${task}. You have access to tools to help you.`,
        },
      ];
      const response = await this.sendMessageWithTools(messages);
      await this.processLLMResponse(response, messages);
      console.log(`${new Date().toISOString()} | ${this.name}: Task completed successfully.`);
      this.pushOutputs('任务执行成功');

      // 使得输出结果以json格式呈现
      if (jsonFormat && typeof jsonFormat === 'string') {
        console.log(`${new Date().toISOString()} | ${this.name}: Formatting output as ${jsonFormat}`);
        messages.push({
          role: 'user',
          content: `请将刚才的输出结果以形如${jsonFormat}的json格式呈现`,
        });
        const jsonResponse = await deepseek.chat.completions.create({
          model: AppConstant.DEEPSEEK_MODEL,
          max_tokens: 4000,
          messages,
          response_format: { type: 'json_object' },
        });
        messages.push({
          role: 'assistant',
          content: jsonResponse.choices[0].message.content
        });
        const result = JSON.parse(messages[messages.length - 1].content as string);
        console.log(`${new Date().toISOString()} | ${this.name}: Result: `, JSON.stringify(result));
        this.pushOutputs(`任务执行成功，结果为：${JSON.stringify(result)}`);
        this.isWorking = false;
        return { messages, result }
      } else {
        console.log(`${new Date().toISOString()} | ${this.name}: Result: `, messages[messages.length - 1].content);
        this.pushOutputs(`任务执行成功，结果为：${messages[messages.length - 1].content}`);
        this.isWorking = false;
        return { messages, result: messages[messages.length - 1].content }
      }
    } catch (error) {
      console.error(`${new Date().toISOString()} | ${this.name}: Error performing task:`, error);
      this.pushOutputs(`任务意外终止: ${error}`);
      this.isWorking = false;
    }
  }
  async close() {
    // 关闭 mcp 连接
    await this.client.close();
    console.log(
      `${new Date().toISOString()} | ${this.name} closed`,
    );
    this.isConnected = false;
  }
  async test(task: string, jsonFormat: string) {
    await this.connect();
    console.log(`${new Date().toISOString()} | ${this.name} test started.`);
    if (this.tools.length) {
      try {
        await this.performTask(task, jsonFormat);
      } catch (error) {
        console.error(`${new Date().toISOString()} | ${this.name} test error:`, error);
        this.pushOutputs(`任务执行失败: ${error}`);
      }
    }
    await this.close();
  }
}

export default McpClient;