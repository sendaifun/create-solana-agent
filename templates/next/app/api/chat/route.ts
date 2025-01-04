import { NextRequest, NextResponse } from "next/server";
import { HumanMessage } from "@langchain/core/messages";
import { MemorySaver } from "@langchain/langgraph";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatOpenAI } from "@langchain/openai";
import { validateEnvironment } from "@/lib/utils";

async function initializeAgent() {
  const llm = new ChatOpenAI({
    modelName: "gpt-4o-mini",
    temperature: 0.7,
  });

  validateEnvironment();

  const memory = new MemorySaver();
  const config = { configurable: { thread_id: "Chat Session" } };

  const agent = createReactAgent({
    llm,
    tools: [],
    checkpointSaver: memory,
    messageModifier: `
      You are a helpful AI assistant. You can help users with general questions and tasks.
      If you're asked about specific functionality that's not available, kindly let the user know
      and suggest alternatives if possible.
    `,
  });

  return { agent, config };
}

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    const { agent, config } = await initializeAgent();

    const stream = await agent.stream({ messages: [new HumanMessage(message)] }, config);

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
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
