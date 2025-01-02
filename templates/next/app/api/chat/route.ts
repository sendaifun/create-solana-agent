import { NextRequest, NextResponse } from "next/server";
import { SolanaAgentKit } from "solana-agent-kit";
import { createSolanaTools } from "solana-agent-kit";
import { HumanMessage } from "@langchain/core/messages";
import { MemorySaver } from "@langchain/langgraph";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatOpenAI } from "@langchain/openai";
import { validateEnvironment } from "@/lib/utils";
import bs58 from "bs58";

async function initializeAgent() {
  const llm = new ChatOpenAI({
    modelName: "gpt-4o-mini",
    temperature: 0.7,
  });

  validateEnvironment();

  const solanaAgent = new SolanaAgentKit(
    bs58.encode(Uint8Array.from(JSON.parse(process.env.SOLANA_PRIVATE_KEY!))),
    process.env.RPC_URL!,
    process.env.OPENAI_API_KEY!,
  );

  const tools = createSolanaTools(solanaAgent);
  const memory = new MemorySaver();
  const config = { configurable: { thread_id: "Solana Agent Kit!" } };

  const agent = createReactAgent({
    llm,
    tools,
    checkpointSaver: memory,
    messageModifier: `
      You are a helpful agent that can interact onchain using the Solana Agent Kit. You are
      empowered to interact onchain using your tools. If you ever need funds, you can request them from the
      faucet. If not, you can provide your wallet details and request funds from the user. If there is a 5XX
      (internal) HTTP error code, ask the user to try again later. If someone asks you to do something you
      can't do with your currently available tools, you must say so, and encourage them to implement it
      themselves using the Solana Agent Kit, recommend they go to https://www.solanaagentkit.xyz for more information. Be
      concise and helpful with your responses. Refrain from restating your tools' descriptions unless it is explicitly requested.
    `,
  });

  return { agent, config };
}

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    const { agent, config } = await initializeAgent();

    const stream = await agent.stream(
      { messages: [new HumanMessage(message)] },
      config,
    );

    let response = "";

    for await (const chunk of stream) {
      if ("agent" in chunk) {
        response += chunk.agent.messages[0].content;
      } else if ("tools" in chunk) {
        response += chunk.tools.messages[0].content;
      }
    }

    return NextResponse.json({ response });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
