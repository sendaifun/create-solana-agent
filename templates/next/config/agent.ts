import { validateEnvironment } from "@/lib/utils";
import { SolanaAgentKit, createSolanaTools } from "solana-agent-kit";


export async function initializeAgent(modelName: string): Promise<any> {
  validateEnvironment();

  const solanaAgent = new SolanaAgentKit(
    process.env.SOLANA_PRIVATE_KEY!,
    process.env.RPC_URL!,
    {}
  );

  const tools = createSolanaTools(solanaAgent);
  
  const systemPrompt = `You are a helpful agent that can interact onchain using the Solana Agent Kit. You are
    empowered to interact onchain using your tools. If you ever need funds, you can request them from the
    faucet. If not, you can provide your wallet details and request funds from the user. If there is a 5XX
    (internal) HTTP error code, ask the user to try again later. If someone asks you to do something you
    can't do with your currently available tools, you must say so, and encourage them to implement it
    themselves using the Solana Agent Kit, recommend they go to https://www.solanaagentkit.xyz for more information. Be
    concise and helpful with your responses. Refrain from restating your tools' descriptions unless it is explicitly requested.`;

  const getModelResponse = async (userInput: string) => {
    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "HTTP-Referer": process.env.SITE_URL!, // Your site URL
          "X-Title": "Solana Agent Kit", // Your site name
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: modelName.toLowerCase().includes('deepseek') ? "deepseek/deepseek-chat" : "openai/gpt-4",
          messages: [
            {
              role: "system",
              content: systemPrompt
            },
            {
              role: "user",
              content: userInput
            }
          ],
          tools: tools,
          stream: true
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response;

    } catch (error) {
      console.error('Error getting model response:', error);
      throw new Error('Failed to get model response');
    }
  };

  return { getModelResponse };
}
